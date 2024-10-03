import { generateClient } from 'aws-amplify/api';
import { getSpotifyItemPostAndRepostCount, getSCTrackPostAndRepostCount } from './customQueries';
import { GraphQLResult } from '@aws-amplify/api-graphql';

interface SpotifyItemPostAndRepostCountData {
  listPosts: {
    items: {
      id: string;
      reposts: {
        items: { id: string }[];
      };
    }[];
  };
}

export async function getSpotifyItemPostCount(itemId: string, isAlbum: boolean): Promise<number> {
  const client = generateClient();
  
  try {
    const response = await client.graphql({
      query: getSpotifyItemPostAndRepostCount,
      variables: isAlbum
        ? { spotifyAlbumId: itemId, spotifyTrackId: null }
        : { spotifyAlbumId: null, spotifyTrackId: itemId },
    }) as GraphQLResult<SpotifyItemPostAndRepostCountData>;

    if (response.data) {
      const posts = response.data.listPosts.items;
      const postCount = posts.length;
      const repostCount = posts.reduce((total, post) => total + post.reposts.items.length, 0);
      return postCount + repostCount;
    } else {
      console.error('No data returned from GraphQL query');
      return 0;
    }
  } catch (error) {
    console.error('Error fetching Spotify item post and repost count:', error);
    return 0;
  }
}

interface SCTrackPostAndRepostCountData {
  listPosts: {
    items: {
      id: string;
      reposts: {
        items: { id: string }[];
      };
    }[];
  };
}

export async function getSCTrackPostCount(trackId: string): Promise<number> {
  const client = generateClient();
  
  try {
    const response = await client.graphql({
      query: getSCTrackPostAndRepostCount,
      variables: { scTrackId: trackId },
    }) as GraphQLResult<SCTrackPostAndRepostCountData>;

    if (response.data) {
      const posts = response.data.listPosts.items;
      const postCount = posts.length;
      const repostCount = posts.reduce((total, post) => total + post.reposts.items.length, 0);
      return postCount + repostCount;
    } else {
      console.error('No data returned from GraphQL query');
      return 0;
    }
  } catch (error) {
    console.error('Error fetching SoundCloud track post and repost count:', error);
    return 0;
  }
}