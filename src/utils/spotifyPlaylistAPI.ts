import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { getSpotifyTokens, listSpotifyTokens } from '../graphql/queries';
import { SpotifyTokens } from '../API';

const client = generateClient();

export const createSpotifyPlaylist = async (name: string, description: string) => {
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

    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${spotifyUserId}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description,
        public: false,
        collaborative: true,
      }),
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
