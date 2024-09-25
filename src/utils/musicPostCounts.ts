import { generateClient } from 'aws-amplify/api';
import * as queries from '../graphql/queries';

export async function getSpotifyItemPostCount(itemId: string, isAlbum: boolean): Promise<number> {
  const client = generateClient();
  
  try {
    const response = await client.graphql({
      query: queries.listPosts,
      variables: {
        filter: isAlbum
          ? { spotifyAlbumId: { eq: itemId } }
          : { spotifyTrackId: { eq: itemId } },
      },
    });

    return response.data.listPosts.items.length;
  } catch (error) {
    console.error('Error fetching Spotify item post count:', error);
    return 0;
  }
}

export async function getSCTrackPostCount(trackId: string): Promise<number> {
  const client = generateClient();
  
  try {
    const response = await client.graphql({
      query: queries.listPosts,
      variables: {
        filter: { scTrackId: { eq: trackId } },
      },
    });

    return response.data.listPosts.items.length;
  } catch (error) {
    console.error('Error fetching SoundCloud track post count:', error);
    return 0;
  }
}