import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from '../utils/spotifyAuth'; 
import { generateClient } from 'aws-amplify/api';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import { getCurrentUser } from 'aws-amplify/auth';

type SpotifyUser = {
  id: string;
  display_name: string;
  uri: string;
  email: string;
  images: { url: string }[];
  country: string;
  product: string;
  // Add other relevant Spotify user data fields 
};

interface TrackObjectFull {
    track: {
      name: string;
      artists: { name: string }[];
    };
  }

type SpotifyContextType = {
  spotifyUser: SpotifyUser | null;
  setSpotifyUser: (user: SpotifyUser | null) => void;
  spotifyToken: string | null;
  setSpotifyToken: (token: string | null) => void;
  refreshSpotifyToken: () => Promise<string | null>;
  fetchAndUpdateRecentlyPlayed: () => Promise<void>; 
  recentlyPlayed: TrackObjectFull[]; 
  // recentlyPlayedDisabled: boolean;
  // setRecentlyPlayedDisabled: (disabled: boolean) => void;
};

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

type SpotifyProviderProps = {
  children: ReactNode;
};

export const SpotifyProvider: React.FC<SpotifyProviderProps> = ({ children }) => {
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any[]>([]);
  const lastFetchTime = useRef<number>(0);
  const fetchingRef = useRef<boolean>(false);
  const client = generateClient();

  useEffect(() => {
    const loadTokenAndUser = async () => {
      const token = await AsyncStorage.getItem('spotifyAccessToken');
      const userJson = await AsyncStorage.getItem('spotifyUser');
      if (token) setSpotifyToken(token);
      if (userJson) setSpotifyUser(JSON.parse(userJson));
    //   console.log("Spotify user:", userJson)
    };
    loadTokenAndUser();
    let loggedRecently = false;

    const scheduleRefreshToken = async () => {
      try {
        const expirationTimeString = await AsyncStorage.getItem('spotifyTokenExpiration');
        if (!expirationTimeString) {
          console.log('No token expiration found. Refreshing in 5 minutes.');
          setTimeout(scheduleRefreshToken, 5 * 60 * 1000);
          return;
        }

        const expirationTime = parseInt(expirationTimeString, 10);
        const timeUntilExpiration = expirationTime - Date.now();

        if (timeUntilExpiration < 5 * 60 * 1000) {
            console.log('Token about to expire. Refreshing...');
            await refreshSpotifyToken();
            loggedRecently = false; // Reset after a refresh 
          } 

          // **** to print the time till expiry for spotify token ***//
        //   else if (!loggedRecently) { // Log only if not logged recently
        //     console.log(`Spotify Token valid for another ${timeUntilExpiration / (1000 * 60)} minutes.`);
        //     loggedRecently = true; 
        //     setTimeout(() => { loggedRecently = false; }, 5 * 60 * 1000); // Reset flag after 10 mins
        //   }

        // Schedule the next check (recursive call)
        scheduleRefreshToken(); 
      } catch (error) {
        console.error('Error scheduling refresh:', error);
        setTimeout(scheduleRefreshToken, 5 * 60 * 1000); // Retry after 5 mins on error
      }
    };

    if (spotifyToken) {
      scheduleRefreshToken(); 
    }
  }, [spotifyToken]); 

  const refreshSpotifyToken = async () => {
    const refreshToken = await AsyncStorage.getItem('spotifyRefreshToken');
    if (refreshToken) {
      try {
        const { accessToken, expiresIn } = await refreshAccessToken(refreshToken);
        setSpotifyToken(accessToken);
        await AsyncStorage.setItem('spotifyAccessToken', accessToken);
        await AsyncStorage.setItem('spotifyTokenExpiration', (Date.now() + expiresIn * 1000).toString());
        console.log("New Spotify Access Token: ", accessToken)
        return accessToken;
      } catch (error) {
        console.error('Failed to refresh Spotify token:', error);
        return null;
      }
    }
    return null;
  };

  const fetchAndUpdateRecentlyPlayed = async () => {
    const now = Date.now();
    const DEBOUNCE_INTERVAL = 10000; // 10 seconds

    if (fetchingRef.current || now - lastFetchTime.current < DEBOUNCE_INTERVAL) {
      console.log('Skipping fetch, too soon or already fetching');
      return;
    }

    fetchingRef.current = true;

    try {
      const accessToken = await AsyncStorage.getItem('spotifyAccessToken');
      if (!accessToken) {
        console.error("No access token found.");
        return;
      }

      const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching recently played: ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const track = data.items[0].track;
        setRecentlyPlayed(data.items || []);
        
        const { userId: currentUserId } = await getCurrentUser();

        if (!currentUserId) {
          console.error('No authenticated user found');
          return;
        }

        const input = {
          userSpotifyRecentlyPlayedTrackId: currentUserId,
          spotifyId: spotifyUser?.id,
          trackId: track.id,
          trackName: track.name,
          artistName: track.artists[0].name,
          albumName: track.album.name,
          albumImageUrl: track.album.images[0]?.url,
          playedAt: new Date().toISOString(),
        };

        // Fetch existing tracks for the user
        const existingTracksResponse = await client.graphql({
          query: queries.listSpotifyRecentlyPlayedTracks,
          variables: { 
            filter: { 
              userSpotifyRecentlyPlayedTrackId: { eq: currentUserId },
              _deleted: { ne: true }
            },
          },
        });

        let existingTracks = existingTracksResponse.data.listSpotifyRecentlyPlayedTracks.items;
        
        // Sort tracks manually
        existingTracks.sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());

        // Check if the track already exists
        const existingTrackIndex = existingTracks.findIndex(t => t.trackId === input.trackId);

        if (existingTrackIndex !== -1) {
          // Update existing entry
          await client.graphql({
            query: mutations.updateSpotifyRecentlyPlayedTrack,
            variables: { 
              input: {
                id: existingTracks[existingTrackIndex].id,
                ...input,
                _version: existingTracks[existingTrackIndex]._version
              }
            },
          });
          console.log('Updated existing track:', input.trackName);
        } else {
          // If we already have 10 tracks, delete the oldest one
          if (existingTracks.length >= 10) {
            const oldestTrack = existingTracks[existingTracks.length - 1];
            await client.graphql({
              query: mutations.deleteSpotifyRecentlyPlayedTrack,
              variables: { 
                input: {
                  id: oldestTrack.id,
                  _version: oldestTrack._version
                }
              },
            });
            console.log('Deleted oldest track:', oldestTrack.trackName);
          }

          // Create new entry
          await client.graphql({
            query: mutations.createSpotifyRecentlyPlayedTrack,
            variables: { input },
          });
          console.log('Created new track entry:', input.trackName);
        }
      }

      lastFetchTime.current = Date.now();
    } catch (error) {
      console.error('Error fetching and updating recently played tracks:', error);
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    const fetchAndSchedule = async () => {
      await fetchAndUpdateRecentlyPlayed(); // Fetch and update immediately
      const RATE = 3 * 60 * 1000; // 3 minutes
      const intervalId = setInterval(fetchAndUpdateRecentlyPlayed, RATE);
      return () => clearInterval(intervalId);
    };

    if (spotifyUser) {
      fetchAndSchedule();
    }
  }, [spotifyUser]);

  return (
    <SpotifyContext.Provider 
      value={{ 
        spotifyUser, setSpotifyUser, 
        spotifyToken, setSpotifyToken, 
        refreshSpotifyToken,
        fetchAndUpdateRecentlyPlayed,
        recentlyPlayed, 
        // recentlyPlayedDisabled,
        // setRecentlyPlayedDisabled: setRecentlyPlayedDisabledAndSave,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};