// spotifyTopAlbums function
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../../graphql/queries';
import awsconfig from '../../aws-exports';

Amplify.configure(awsconfig);
const client = generateClient();

export interface AlbumCount {
    albumId: string;
    count: number;
  }
  
export interface RankedSpotifyAlbums {
    albumId: string;
    count: number;
    // ... other album details from your post schema
    spotifyAlbumName?: string | null;    
    spotifyAlbumArtists?: string | null;
    spotifyAlbumImageUrl?: string | null;
  }

  export const fetchTopSpotifyAlbums = async (): Promise<RankedSpotifyAlbums[]> => {
    try {
        const response = await client.graphql({ 
          query: queries.listPosts,
            variables: {
              filter: {
                _deleted: { ne: true } 
              }
            },
        });
            const spotifyAlbums = response.data.listPosts.items.filter(
              (post: any) => post.spotifyAlbumId
            );
    
            const albumCounts: { [albumId: string]: number } = spotifyAlbums.reduce((acc: { [albumId: string]: number }, post: any) => {
                const albumId = post.spotifyAlbumId;
                acc[albumId] = (acc[albumId] || 0) + 1;
                return acc;
              }, {});
    
            const rankedAlbums: AlbumCount[] = Object.entries(albumCounts)
              .map(([albumId, count]) => ({ albumId, count }))
              .sort((a: AlbumCount, b: AlbumCount) => b.count - a.count) // Specify types for a and b
              .slice(0, 10);
    
            const topAlbumsWithDetails: RankedSpotifyAlbums[] = await Promise.all(
              rankedAlbums.map(async (album: AlbumCount) => {
                const albumPost = spotifyAlbums.find(
                  (post: any) => post.spotifyAlbumId === album.albumId
                );
                return { ...album, ...albumPost }; 
              })
            );
            return topAlbumsWithDetails;
    
        } catch (error) {
            console.error('Error fetching top Spotify albums:', error);
            return []; // Return an empty array in case of an error
          }
        };