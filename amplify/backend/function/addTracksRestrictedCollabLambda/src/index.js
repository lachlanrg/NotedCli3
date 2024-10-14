const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const https = require('https');

const client = new DynamoDBClient({});
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'SpotifyPlaylist-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo';
const TOKENS_TABLE = 'SpotifyTokens-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo';
const USER_PLAYLIST_TRACKS_TABLE = 'UserPlaylistTrack-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo';

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    if (typeof event.body === 'string') {
        try {
            body = JSON.parse(event.body);
        } catch (error) {
            console.error('Error parsing event body string:', error);
            console.log('Raw event body:', event.body);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid input', error: 'Failed to parse event body string' })
            };
        }
    } else if (typeof event.body === 'object') {
        body = event.body;
    } else {
        console.error('Unexpected event body type:', typeof event.body);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid input', error: 'Unexpected event body type' })
        };
    }

    if (!body || !body.playlistId || !body.trackUris || !body.userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid input', error: 'Missing required parameters' })
        };
    }

    try {
        // 1. Get playlist details
        const playlist = await getPlaylistDetails(body.playlistId);
        console.log('Fetched playlist:', JSON.stringify(playlist, null, 2));
        
        // 2. Get playlist owner's Spotify tokens
        console.log('Fetching Spotify tokens for user:', playlist.userSpotifyPlaylistsId);
        const ownerTokens = await getSpotifyTokens(playlist.userSpotifyPlaylistsId);
        console.log('Fetched Spotify tokens:', JSON.stringify(ownerTokens, null, 2));
        
        // 3. Check user's track count and enforce limit
        const userTrackCount = await getUserTrackCount(body.playlistId, body.userId);
        const trackLimit = playlist.trackLimitPerUser === 'unlimited' ? -1 : parseInt(playlist.trackLimitPerUser);
        
        if (trackLimit !== -1 && userTrackCount + body.trackUris.length > trackLimit) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: `Adding these tracks would exceed your limit of ${trackLimit} tracks for this playlist.` })
            };
        }
        
        // 4. Add tracks to playlist using owner's access token
        await addTracksToPlaylist(body.playlistId, body.trackUris, ownerTokens.spotifyAccessToken);
        
        // 5. Update user's track count
        if (trackLimit !== -1) {
            await updateUserTrackCount(body.playlistId, body.userId, userTrackCount + body.trackUris.length);
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Tracks added successfully' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred while adding tracks to the playlist' })
        };
    }
};

async function getPlaylistDetails(playlistId) {
    const command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "bySpotifyPlaylistId", // Assuming you have a GSI named "bySpotifyPlaylistId"
        KeyConditionExpression: "spotifyPlaylistId = :playlistId",
        ExpressionAttributeValues: {
            ":playlistId": playlistId
        }
    });
    try {
        const result = await dynamoDB.send(command);
        console.log('Playlist details:', JSON.stringify(result.Items, null, 2));
        if (!result.Items || result.Items.length === 0) {
            throw new Error(`Playlist with ID ${playlistId} not found`);
        }
        return result.Items[0]; // Return the first (and should be only) item
    } catch (error) {
        console.error('Error fetching playlist details:', error);
        throw error;
    }
}

async function getSpotifyTokens(userId) {
    const command = new QueryCommand({
        TableName: TOKENS_TABLE,
        IndexName: "byUserId",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        }
    });
    try {
        const result = await dynamoDB.send(command);
        console.log('Spotify tokens:', JSON.stringify(result.Items, null, 2));
        if (!result.Items || result.Items.length === 0) {
            throw new Error(`No Spotify tokens found for user ${userId}`);
        }
        return result.Items[0];
    } catch (error) {
        console.error('Error fetching Spotify tokens:', error);
        throw error;
    }
}

async function getUserTrackCount(playlistId, userId) {
    const command = new GetCommand({
        TableName: USER_PLAYLIST_TRACKS_TABLE,
        Key: { id: `${playlistId}:${userId}` }
    });
    const result = await dynamoDB.send(command);
    return result.Item ? result.Item.trackCount : 0;
}

async function addTracksToPlaylist(playlistId, trackUris, accessToken) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ uris: trackUris });
        const options = {
            hostname: 'api.spotify.com',
            path: `/v1/playlists/${playlistId}/tracks`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 201) {
                    resolve(JSON.parse(responseBody));
                } else {
                    reject(new Error(`Failed to add tracks: ${res.statusCode} ${responseBody}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function updateUserTrackCount(playlistId, userId, newCount) {
    const command = new UpdateCommand({
        TableName: USER_PLAYLIST_TRACKS_TABLE,
        Key: { id: `${playlistId}:${userId}` },
        UpdateExpression: 'SET trackCount = :count, userId = :userId',
        ExpressionAttributeValues: {
            ':count': newCount,
            ':userId': userId
        },
        // If the item doesn't exist, create it
        ConditionExpression: 'attribute_not_exists(id) OR attribute_exists(id)'
    });
    try {
        await dynamoDB.send(command);
    } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
            // If the item doesn't exist, create it
            const putCommand = new PutCommand({
                TableName: USER_PLAYLIST_TRACKS_TABLE,
                Item: {
                    id: `${playlistId}:${userId}`,
                    playlistId: playlistId,
                    userId: userId,
                    trackCount: newCount
                }
            });
            await dynamoDB.send(putCommand);
        } else {
            throw error;
        }
    }
}
