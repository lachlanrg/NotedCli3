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
  

export interface RankedSoundCloudTrack { 
  trackId: string;
  count: number;
  scTrackTitle?: string | null;
  scTrackUsername?: string | null;
  scTrackArtworkUrl?: string | null;
}

export const fetchTopSoundCloudTracks = async (): Promise<RankedSoundCloudTrack[]> => {
  try {
    const response = await client.graphql({ query: queries.listPosts });
    const soundCloudTracks = response.data.listPosts.items.filter(
      (post: any) => post.scTrackId 
    );

    const trackCounts: { [trackId: string]: number } = soundCloudTracks.reduce(
      (acc: { [trackId: string]: number }, post: any) => {
        const trackId = post.scTrackId;
        acc[trackId] = (acc[trackId] || 0) + 1;
        return acc;
      },
      {}
    );

    const rankedTracks: TrackCount[] = Object.entries(trackCounts)
      .map(([trackId, count]) => ({ trackId, count }))
      .sort((a: TrackCount, b: TrackCount) => b.count - a.count)
      .slice(0, 10);

    const topTracksWithDetails: RankedSoundCloudTrack[] = await Promise.all(
      rankedTracks.map(async (track: TrackCount) => {
        const trackPost = soundCloudTracks.find(
          (post: any) => post.scTrackId === track.trackId
        );
        return { ...track, ...trackPost };
      })
    );

    return topTracksWithDetails;
  } catch (error) {
    console.error('Error fetching top SoundCloud tracks:', error);
    return [];
  }
};