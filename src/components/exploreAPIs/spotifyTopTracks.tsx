// spotifyTopTracks function
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);
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
    spotifyTrackImageUrl?: string | null;
  }

  export const fetchTopSpotifyTracks = async (): Promise<RankedTrack[]> => {
    try {
        const response = await client.graphql({ query: queries.listPosts });
            const spotifyTracks = response.data.listPosts.items.filter(
              (post: any) => post.spotifyTrackId
            );
    
            const trackCounts: { [trackId: string]: number } = spotifyTracks.reduce((acc: { [trackId: string]: number }, post: any) => {
                const trackId = post.spotifyTrackId;
                acc[trackId] = (acc[trackId] || 0) + 1;
                return acc;
              }, {});
    
            const rankedTracks: TrackCount[] = Object.entries(trackCounts)
              .map(([trackId, count]) => ({ trackId, count }))
              .sort((a: TrackCount, b: TrackCount) => b.count - a.count) // Specify types for a and b
              .slice(0, 10);
    
            const topTracksWithDetails: RankedTrack[] = await Promise.all(
              rankedTracks.map(async (track: TrackCount) => {
                const trackPost = spotifyTracks.find(
                  (post: any) => post.spotifyTrackId === track.trackId
                );
                return { ...track, ...trackPost }; 
              })
            );
            return topTracksWithDetails;
            
    
        } catch (error) {
            console.error('Error fetching top Spotify tracks:', error);
            return []; // Return an empty array in case of an error
          }
        };