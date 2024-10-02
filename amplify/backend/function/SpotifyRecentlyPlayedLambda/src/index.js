import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';

// Add this function at the top of your file
function generateUniqueId() {
    const hex = '0123456789abcdef';
    let uuid = '';
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid += '-';
        } else if (i === 14) {
            uuid += '4'; // Version 4 UUID always has a '4' here
        } else if (i === 19) {
            uuid += hex[(Math.random() * 4 | 8)]; // '8', '9', 'a', or 'b'
        } else {
            uuid += hex[(Math.random() * 16 | 0)];
        }
    }
    return uuid;
}

const dynamoDb = DynamoDBDocument.from(new DynamoDB());

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export const handler = async (event) => {
    try {
        const users = await getAllUsersWithSpotifyTokens();
        console.log('Users fetched:', users); // Add this log

        if (!Array.isArray(users)) {
            throw new Error('Users is not an array');
        }

        for (const user of users) {
            await processUser(user);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully processed all users' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: error.toString() })
        };
    }
};

async function getAllUsersWithSpotifyTokens() {
    const params = {
        TableName: 'SpotifyTokens-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo'
    };
    try {
        const result = await dynamoDb.scan(params);
        console.log('DynamoDB scan result:', result); // Add this log
        return result.Items || [];
    } catch (error) {
        console.error('Error scanning DynamoDB:', error);
        throw error;
    }
}

async function processUser(user) {
    try {
        // Use the userId from the SpotifyTokens entry
        const userId = user.userId;
        
        // Fetch user details using the correct userId
        const userDetails = await getUserDetails(userId);
        if (userDetails && userDetails.recentlyPlayedDisabled) {
            console.log(`User ${userId} has recently played disabled. Skipping processing.`);
            return; // Exit the function early if recentlyPlayedDisabled is true
        } else {
            console.log(`Recently played is Not disabled for user ${userId}`); // New console log
        }

        let accessToken = user.spotifyAccessToken;
        const refreshToken = user.spotifyRefreshToken;

        if (isTokenExpired(user.tokenExpiration)) {
            console.log('Token expired, refreshing...');
            const newTokens = await refreshSpotifyAccessToken(refreshToken);
            if (!newTokens || !newTokens.access_token) {
                throw new Error('Failed to refresh token');
            }
            accessToken = newTokens.access_token;
            await updateTokensInDynamoDB(user.id, { ...newTokens, spotifyRefreshToken: refreshToken });
        }

        const recentTrack = await fetchMostRecentTrack(accessToken);
        if (recentTrack) {
            await updateRecentlyPlayedTrackInDynamoDB(user, recentTrack);
        }

        console.log(`Successfully processed user: ${userId}`);
    } catch (error) {
        console.error(`Error processing user ${user.userId}:`, error);
    }
}

async function getUserDetails(userId) {
    const params = {
        TableName: 'User-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo', // Replace with your actual User table name
        Key: { id: userId }
    };
    try {
        const result = await dynamoDb.get(params);
        return result.Item;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
}

function isTokenExpired(expirationTime) {
    return Date.now() > expirationTime;
}

async function refreshSpotifyAccessToken(refreshToken) {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', 
            new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: SPOTIFY_CLIENT_ID,
                client_secret: SPOTIFY_CLIENT_SECRET
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        console.log('Spotify token refresh response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error refreshing Spotify token:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function updateTokensInDynamoDB(userId, tokens) {
    try {
        // First, get the current item to retrieve its version
        const getParams = {
            TableName: 'SpotifyTokens-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo',
            Key: { id: userId }
        };
        const currentItem = await dynamoDb.get(getParams);
        
        if (!currentItem.Item) {
            throw new Error('SpotifyTokens item not found');
        }

        const currentVersion = currentItem.Item._version || 0;

        const params = {
            TableName: 'SpotifyTokens-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo',
            Key: { id: userId },
            UpdateExpression: 'set spotifyAccessToken = :accessToken, spotifyRefreshToken = :refreshToken, tokenExpiration = :expiration, #version = :newVersion',
            ExpressionAttributeValues: {
                ':accessToken': tokens.access_token,
                ':refreshToken': tokens.refresh_token || tokens.spotifyRefreshToken,
                ':expiration': Date.now() + tokens.expires_in * 1000,
                ':newVersion': currentVersion + 1,
                ':currentVersion': currentVersion  // Add this line
            },
            ExpressionAttributeNames: {
                '#version': '_version'
            },
            ConditionExpression: '#version = :currentVersion',
            ReturnValues: 'ALL_NEW'
        };
        console.log('UpdateTokens params:', JSON.stringify(params, null, 2));

        const result = await dynamoDb.update(params);
        console.log('Successfully updated tokens in DynamoDB:', result);
    } catch (error) {
        console.error('Error updating tokens in DynamoDB:', error);
        throw error;
    }
}

async function fetchMostRecentTrack(accessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.data.items && response.data.items.length > 0) {
            return response.data.items[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching recent track:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function updateRecentlyPlayedTrackInDynamoDB(user, trackData) {
    const track = trackData.track;
    const now = new Date().toISOString();
    const input = {
        id: generateUniqueId(), // This will now be a 36-character UUID
        __typename: "SpotifyRecentlyPlayedTrack",
        _lastChangedAt: Date.now(),
        _version: 1,
        createdAt: now,
        updatedAt: now,
        userSpotifyRecentlyPlayedTrackId: user.userId,
        spotifyId: user.spotifyUserId,
        trackId: track.id,
        trackName: track.name,
        artistName: track.artists[0].name,
        albumName: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        playedAt: trackData.played_at,
        spotifyUri: track.external_urls.spotify,
    };

    try {
        // Fetch existing tracks for the user
        const existingTracksResponse = await dynamoDb.query({
            TableName: 'SpotifyRecentlyPlayedTrack-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo',
            IndexName: 'byUser',
            KeyConditionExpression: 'userSpotifyRecentlyPlayedTrackId = :userId',
            ExpressionAttributeValues: {
                ':userId': user.userId
            },
            ScanIndexForward: false,
            Limit: 10
        });

        const existingTracks = existingTracksResponse.Items;

        // Check if the track already exists
        const existingTrackIndex = existingTracks.findIndex(t => t.trackId === input.trackId);

        if (existingTrackIndex !== -1) {
            // Update existing entry
            const existingTrack = existingTracks[existingTrackIndex];
            await dynamoDb.update({
                TableName: 'SpotifyRecentlyPlayedTrack-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo',
                Key: { id: existingTrack.id },
                UpdateExpression: 'set playedAt = :playedAt, updatedAt = :updatedAt, #lastChangedAt = :lastChangedAt, #version = :version',
                ExpressionAttributeValues: {
                    ':playedAt': input.playedAt,
                    ':updatedAt': now,
                    ':lastChangedAt': Date.now(),
                    ':version': existingTrack._version + 1
                },
                ExpressionAttributeNames: {
                    '#lastChangedAt': '_lastChangedAt',
                    '#version': '_version'
                }
            });
            console.log('Updated existing RP track:', input.trackName);
        } else {
            let deletedTrack = null;
            // If we already have 10 tracks, delete the oldest one
            if (existingTracks.length >= 10) {
                deletedTrack = existingTracks[existingTracks.length - 1];
                await dynamoDb.delete({
                    TableName: 'SpotifyRecentlyPlayedTrack-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo',
                    Key: { id: deletedTrack.id }
                });
                console.log('Deleted oldest RP track:', deletedTrack.trackName);
            }

            // Create new entry
            await dynamoDb.put({
                TableName: 'SpotifyRecentlyPlayedTrack-kfnhwh5lxjfxzejjpxln4spsqi-stagingtwo',
                Item: input // Use the input object directly, which now includes the unique id
            });
            console.log('RP track update:', {
                action: 'Created new entry',
                newTrack: input.trackName,
                newTrackId: input.id, // Log the new track ID
                deletedTrack: deletedTrack ? deletedTrack.trackName : 'None'
            });
        }
    } catch (error) {
        console.error('Error updating recently played track:', error);
        throw error;
    }
}
