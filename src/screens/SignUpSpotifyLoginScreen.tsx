import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '../config';
import { dark } from '../components/colorModes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSpotify } from '../context/SpotifyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from '@aws-amplify/auth';
import { createSpotifyTokens } from '../graphql/mutations';

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'streaming',
  'user-modify-playback-state',
  'user-read-playback-state',
  'user-read-currently-playing',
  'app-remote-control',
  'user-read-recently-played',
].join(' ');
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';

type SignUpSpotifyLoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const SignUpSpotifyLoginScreen: React.FC<SignUpSpotifyLoginScreenProps> = ({ navigation }) => {
  // const { setSpotifyUser, setSpotifyToken } = useSpotify();
  const spotifyContext = useSpotify();

  if (!spotifyContext) {
    // Handle the case where context is undefined
    return null; // or some loading/error component
  }

  const { setSpotifyUser, setSpotifyToken } = spotifyContext;



  useEffect(() => {
    console.log('SignUpSpotifyLogin component mounted');
    console.log('CLIENT_ID:', CLIENT_ID);
    console.log('REDIRECT_URI:', REDIRECT_URI);

    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      console.log('Received deep link URL:', url);

      if (url.includes('notedcli3://auth-callback')) {
        const code = url.split('code=')[1].split('&')[0];
        console.log('Received auth code:', code);

        try {
          const tokenResponse = await exchangeCodeForToken(code);
          await handleSuccessfulAuth(tokenResponse);
        } catch (error) {
          console.error('Error in authentication process:', error);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    checkExistingToken();

    return () => {
      console.log('SignUpSpotifyLogin component unmounted');
      subscription.remove();
    };
  }, [navigation]);

  const exchangeCodeForToken = async (code: string) => {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token exchange failed:', response.status, errorText);
        throw new Error(`Failed to exchange code for token: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in
      };
    } catch (error) {
      console.error('Error in token exchange:', error);
      throw error;
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    const tokenEndpoint = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    });

    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in
    };
  };

  const handleSuccessfulAuth = async (tokenResponse: any) => {
    try {
      const { accessToken, refreshToken, expiresIn } = tokenResponse;
      const userInfo = await fetchSpotifyUserInfo(accessToken);

      setSpotifyUser(userInfo);
      setSpotifyToken(accessToken);
      await AsyncStorage.setItem('spotifyAccessToken', accessToken);
      await AsyncStorage.setItem('spotifyRefreshToken', refreshToken);
      await AsyncStorage.setItem('spotifyTokenExpiration', (Date.now() + expiresIn * 1000).toString());
      await AsyncStorage.setItem('spotifyUser', JSON.stringify(userInfo));

      const { userId } = await getCurrentUser();
      await saveSpotifyTokensToDynamoDB(userId, accessToken, refreshToken, expiresIn, userInfo.id);
      
      console.log('Spotify User Info:', userInfo);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error in handleSuccessfulAuth:', error);
    }
  };

  const fetchSpotifyUserInfo = async (accessToken: string) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  };

  const getValidAccessToken = async () => {
    const accessToken = await AsyncStorage.getItem('spotifyAccessToken');
    const expirationTime = await AsyncStorage.getItem('spotifyTokenExpiration');
    const refreshToken = await AsyncStorage.getItem('spotifyRefreshToken');

    if (!accessToken || !expirationTime || !refreshToken) {
      
      throw console.log("No Spotify tokens found")
    }

    if (Date.now() > parseInt(expirationTime)) {
      console.log('Access token expired, refreshing...');
      const { accessToken: newAccessToken, expiresIn } = await refreshAccessToken(refreshToken);
      const newExpirationTime = Date.now() + expiresIn * 1000;
      await AsyncStorage.setItem('spotifyAccessToken', newAccessToken);
      await AsyncStorage.setItem('spotifyTokenExpiration', newExpirationTime.toString());
      return newAccessToken;
    }

    return accessToken;
  };

  const checkExistingToken = async () => {
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        const userInfo = await fetchSpotifyUserInfo(accessToken);
        setSpotifyUser(userInfo);
        navigation.navigate('Main');
      }
    } catch (error) {
      console.error('Error checking existing token:', error);
    }
  };

  const saveSpotifyTokensToDynamoDB = async (userId: string, accessToken: string, refreshToken: string, expiresIn: number, spotifyUserId: string) => {
    const tokenExpiration = Date.now() + expiresIn * 1000;
      
    try {
      const client = generateClient();
      const input = {
        userId,
        spotifyUserId,
        spotifyAccessToken: accessToken,
        spotifyRefreshToken: refreshToken,
        tokenExpiration
      };
  
      await client.graphql({ query: createSpotifyTokens, variables: { input } });
      console.log('Spotify tokens saved successfully to DynamoDB with data:', input);
    } catch (error) {
      console.error('Error saving Spotify tokens to DynamoDB:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <WebView
          source={{
            uri: `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`,
          }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('notedcli3://auth-callback')) {
              Linking.openURL(navState.url);
            }
          }}
          style={styles.webview}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: dark,
  },
});

export default SignUpSpotifyLoginScreen;