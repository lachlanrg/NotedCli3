import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { getSpotifyTokens, listSpotifyTokens } from '../graphql/queries';
import { SpotifyTokens } from '../API';

const client = generateClient();

export const createSpotifyPlaylist = async (name: string, description: string, type: 'COLLABORATIVE' | 'RESTRICTED_COLLABORATIVE') => {
  try {
    const { userId } = await getCurrentUser();

    // Fetch the SpotifyTokens for the current user
    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: {
        filter: {
          userId: {
            eq: userId
          }
        }
      } 
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const spotifyUserId = spotifyTokens.spotifyUserId;
    const accessToken = spotifyTokens.spotifyAccessToken;

    let playlistBody;
    if (type === 'COLLABORATIVE') {
      playlistBody = {
        name,
        description,
        public: false,
        collaborative: true,
      };
    } else { // RESTRICTED_COLLABORATIVE
      playlistBody = {
        name,
        description,
        public: true,
      };
    }

    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playlistBody),
    });

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json();
      throw new Error(`Failed to create playlist: ${errorData.error.message}`);
    }

    const playlistData = await playlistResponse.json();
    console.log(playlistData);
    return playlistData;
  } catch (error) {
    console.error('Error creating Spotify playlist:', error);
    throw error;
  }
};

export const getUserSpotifyPlaylists = async () => {
  try {
    const { userId } = await getCurrentUser();

    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: {
        filter: {
          userId: {
            eq: userId
          }
        }
      } 
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const accessToken = spotifyTokens.spotifyAccessToken;

    const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!playlistsResponse.ok) {
      const errorData = await playlistsResponse.json();
      throw new Error(`Failed to fetch playlists: ${errorData.error.message}`);
    }

    const playlistsData = await playlistsResponse.json();
    
    // Filter playlists to include only public and collaborative ones
    const filteredPlaylists = playlistsData.items.filter((playlist: any) => 
      playlist.public || playlist.collaborative
    );

    return filteredPlaylists;
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error);
    throw error;
  }
};

export const getPlaylistById = async (playlistId: string) => {
  try {
    const { userId } = await getCurrentUser();

    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: {
        filter: {
          userId: {
            eq: userId
          }
        }
      } 
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const accessToken = spotifyTokens.spotifyAccessToken;

    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json();
      throw new Error(`Failed to fetch playlist: ${errorData.error.message}`);
    }

    const playlistData = await playlistResponse.json();
    return playlistData;
  } catch (error) {
    console.error('Error fetching Spotify playlist:', error);
    throw error;
  }
};

export const updatePlaylistImage = async (playlistId: string, imageBase64: string) => {
  try {
    const { userId } = await getCurrentUser();

    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: {
        filter: {
          userId: {
            eq: userId
          }
        }
      } 
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const accessToken = spotifyTokens.spotifyAccessToken;
    // Remove the "data:image/jpeg;base64," prefix if it exists
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    console.log('Playlist ID:', playlistId);
    console.log('Access Token:', accessToken.substring(0, 10) + '...');
    console.log('Image data length:', base64Data.length);

    const updateResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'image/jpeg'
      },
      body: base64Data
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.log('Response status:', updateResponse.status);
      console.log('Response headers:', JSON.stringify(updateResponse.headers));
      console.log('Error text:', errorText);
      throw new Error(`Failed to update playlist image: ${updateResponse.status} ${updateResponse.statusText} - ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Error updating playlist image:', error);
    throw error;
  }
};

export const searchTracks = async (query: string) => {
  try {
    const { userId } = await getCurrentUser();
    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: { filter: { userId: { eq: userId } } }
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const accessToken = spotifyTokens.spotifyAccessToken;

    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      throw new Error(`Failed to search tracks: ${errorData.error.message}`);
    }

    const searchData = await searchResponse.json();
    return searchData;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const addTrackToPlaylist = async (playlistId: string, trackUris: string[], playlistType: string, userId: string) => {
  try {
    console.log('Adding tracks to playlist:', playlistId);
    console.log('Playlist type:', playlistType);
    console.log('Track URIs:', trackUris);
    console.log('User ID:', userId);

    if (playlistType === 'RESTRICTED_COLLABORATIVE') {
      return addTrackToRestrictedCollabPlaylist(playlistId, trackUris, userId);
    }

    // For COLLABORATIVE and other types, use the direct Spotify API
    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: { filter: { userId: { eq: userId } } }
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const accessToken = spotifyTokens.spotifyAccessToken;

    const addTrackResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });

    if (!addTrackResponse.ok) {
      const errorData = await addTrackResponse.json();
      throw new Error(`Failed to add tracks to playlist: ${errorData.error.message}`);
    }

    const addTrackData = await addTrackResponse.json();
    return addTrackData;
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    throw error;
  }
};

const addTrackToRestrictedCollabPlaylist = async (playlistId: string, trackUris: string[], userId: string) => {
  try {
    const payload = {
      playlistId,
      trackUris,
      userId
    };

    // console.log('Sending payload to Lambda:', JSON.stringify(payload));

    const response = await fetch('https://ruh4rf4q75.execute-api.ap-southeast-2.amazonaws.com/dev/add-tracks-restricted', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // console.log('Response status:', response.status);
    // console.log('Response headers:', JSON.stringify(response.headers));

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      throw new Error('Invalid JSON response from Lambda');
    }

    if (!response.ok) {
      throw new Error(`Failed to add tracks to restricted collaborative playlist: ${responseData.message || response.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error adding tracks to restricted collaborative playlist:', error);
    throw error;
  }
};

export const getPlaylistTracks = async (playlistId: string) => {
  try {
    const { userId } = await getCurrentUser();
    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: { filter: { userId: { eq: userId } } }
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const accessToken = spotifyTokens.spotifyAccessToken;

    const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!tracksResponse.ok) {
      const errorData = await tracksResponse.json();
      throw new Error(`Failed to fetch playlist tracks: ${errorData.error.message}`);
    }

    const tracksData = await tracksResponse.json();
    return tracksData.total;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
};

export const getPlaylistDetails = async (playlistId: string) => {
  try {
    const { userId } = await getCurrentUser();
    const response = await client.graphql({
      query: listSpotifyTokens,
      variables: { filter: { userId: { eq: userId } } }
    });

    const spotifyTokens = response.data.listSpotifyTokens.items[0] as SpotifyTokens;

    if (!spotifyTokens) {
      throw new Error('No Spotify tokens found for the user');
    }

    const accessToken = spotifyTokens.spotifyAccessToken;

    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json();
      throw new Error(`Failed to fetch playlist details: ${errorData.error.message}`);
    }

    const playlistData = await playlistResponse.json();
    return {
      tracks: playlistData.tracks.total,
      followers: playlistData.followers.total
    };
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    throw error;
  }
};
