import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from '../utils/spotifyAuth'; // You'll need to create this function

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
  }, []);

  const refreshSpotifyToken = async () => {
    const refreshToken = await AsyncStorage.getItem('spotifyRefreshToken');
    if (refreshToken) {
      try {
        const { accessToken, expiresIn } = await refreshAccessToken(refreshToken);
        setSpotifyToken(accessToken);
        await AsyncStorage.setItem('spotifyAccessToken', accessToken);
        await AsyncStorage.setItem('spotifyTokenExpiration', (Date.now() + expiresIn * 1000).toString());
        return accessToken;
      } catch (error) {
        console.error('Failed to refresh Spotify token:', error);
        return null;
      }
    }
    return null;
  };

  return (
    <SpotifyContext.Provider value={{ spotifyUser, setSpotifyUser, spotifyToken, setSpotifyToken, refreshSpotifyToken }}>
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