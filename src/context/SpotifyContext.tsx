import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from '../utils/spotifyAuth'; 

type SpotifyUser = {
  id: string;
  display_name: string;
  uri: string;
  email: string;
  // Add other relevant Spotify user data fields 
};

type SpotifyContextType = {
  spotifyUser: SpotifyUser | null;
  setSpotifyUser: (user: SpotifyUser | null) => void;
  spotifyToken: string | null;
  setSpotifyToken: (token: string | null) => void;
  refreshSpotifyToken: () => Promise<string | null>;
};

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

type SpotifyProviderProps = {
  children: ReactNode;
};

export const SpotifyProvider: React.FC<SpotifyProviderProps> = ({ children }) => {
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  useEffect(() => {
    const loadTokenAndUser = async () => {
      const token = await AsyncStorage.getItem('spotifyAccessToken');
      const userJson = await AsyncStorage.getItem('spotifyUser');
      if (token) setSpotifyToken(token);
      if (userJson) setSpotifyUser(JSON.parse(userJson));
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
          } else if (!loggedRecently) { // Log only if not logged recently
            console.log(`Spotify Token valid for another ${timeUntilExpiration / (1000 * 60)} minutes.`);
            loggedRecently = true; 
            setTimeout(() => { loggedRecently = false; }, 5 * 60 * 1000); // Reset flag after 10 mins
          }

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

  return (
    <SpotifyContext.Provider 
      value={{ 
        spotifyUser, setSpotifyUser, 
        spotifyToken, setSpotifyToken, 
        refreshSpotifyToken 
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