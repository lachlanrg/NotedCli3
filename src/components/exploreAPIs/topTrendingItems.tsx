import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries'; // Adjust path as needed

const client = generateClient();

export interface TrackCount {
    trackId: string;
    count: number;
  }
  
export interface RankedTrack {
    trackId: string;
    count: number;
    // ... other track details from your post schema
    spotifyTrackName?: string | null;    
    spotifyTrackArtists?: string | null;
  }

export interface RankedTopTrending {
    trackId: string;
    count: number;
    // ... other track details from your post schema
    spotifyTrackName?: string | null;    
    spotifyTrackArtists?: string | null;
    spotifyTrackImageUrl?: string | null;

    spotifyAlbumName?: string | null;
    spotifyAlbumImageUrl?: string | null;
    spotifyAlbumArtists?: string | null;

    scTrackTitle?: string | null;
    scTrackUsername?: string | null;
    scTrackArtworkUrl?: string | null;
}


export const fetchTopTrendingItems = async (): Promise<RankedTopTrending[]> => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Calculate date one week ago
  
      const response = await client.graphql({ 
        query: queries.listPosts,
        variables: {
          filter: {
            _deleted: { ne: true } 
          }
        },
      });
      const allPosts = response.data.listPosts.items.filter(
        (post: any) => new Date(post.createdAt) >= oneWeekAgo // Filter posts from the past week
      );
    
        const itemCounts: { [itemId: string]: number } = allPosts.reduce((acc: { [itemId: string]: number }, post: any) => {
          const itemId = post.spotifyTrackId || post.spotifyAlbumId || post.scTrackId; 
    
          if (itemId) { // Only count if an itemId exists
            acc[itemId] = (acc[itemId] || 0) + 1;
          }
          return acc;
        }, {});
    
        const rankedItems: TrackCount[] = Object.entries(itemCounts)
          .map(([itemId, count]) => ({ trackId: itemId, count }))
          .sort((a: TrackCount, b: TrackCount) => b.count - a.count)
          .slice(0, 10); 
    
        const topItemsWithDetails: RankedTopTrending[] = await Promise.all(
          rankedItems.map(async (item: TrackCount) => {
            const itemPost = allPosts.find(
              (post: any) => 
                post.spotifyTrackId === item.trackId ||
                post.spotifyAlbumId === item.trackId ||
                post.scTrackId === item.trackId 
            );
    
            return { ...item, ...itemPost };
          })
        );
    
        return topItemsWithDetails;
    
      } catch (error) {
        console.error('Error fetching top items:', error);
        return []; 
      }
    };