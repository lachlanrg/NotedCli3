// SpotifyAuth.tsx
// Not sure if needed just yet
import axios from 'axios';

const exchangeCodeForToken = async (code) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'YOUR_REDIRECT_URI');
  params.append('client_id', 'YOUR_CLIENT_ID');
  params.append('client_secret', 'YOUR_CLIENT_SECRET');

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', params);
    const accessToken = response.data.access_token;
    // Store the access token securely (e.g., AsyncStorage or react-native-keychain)
    return accessToken;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

export { exchangeCodeForToken };
