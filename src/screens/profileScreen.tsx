// profileScreen.tsx
import * as React from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, TouchableOpacity, useColorScheme } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { signOut, getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import { confirmSignUp, type ConfirmSignUpInput } from 'aws-amplify/auth';
import { Linking } from 'react-native';
import { exchangeCodeForToken } from '../../src/spofityauth/SpotifyAuth';


import { toggleColorScheme } from '../utils/DarkMode'; // ADDED THIS
import { useTheme } from '../utils/ThemeContext';


type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { colorScheme, toggleColorScheme } = useTheme();

  const [userInfo, setUserInfo] = React.useState<any>(null);
  const [email, setEmail] = React.useState<string | null>(null);
  // const [confirmationCode, setConfirmationCode] = React.useState('');
  // const [username, setUsername] = React.useState('');

  React.useEffect(() => {
    currentAuthenticatedUser();
    UserAttributes();
  }, []);

  async function currentAuthenticatedUser() {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);

      setUserInfo({ username, userId, signInDetails });
    } catch (err) {
      console.log(err);
    }
  }

  const UserAttributes = async () => {
    try {
      const userAttributes = await fetchUserAttributes();
      if (userAttributes.email) {
        setEmail(userAttributes.email);
      } else {
        console.log('Email attribute is undefined');
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSignOut() {
    try {
      const { username } = await getCurrentUser();

      console.log('Attempting to sign out user: ', username);
      await signOut();
      navigation.navigate('Login');
      console.log('User Signed Out');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const handleSpotifyLogin = async () => {
    try {
      // Use a unique URI scheme for the redirect URI to handle the callback
      const clientId = 'b3b489db22654c94822b6d708396b6df'
      const redirectUri = 'yourapp://spotify-redirect';
      const spotifyAuthURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-private%20user-read-email`;
  
      // Open the Spotify authentication URL
      const supported = await Linking.canOpenURL(spotifyAuthURL);
      if (supported) {
        await Linking.openURL(spotifyAuthURL);
  
        // Listen to the redirect URI for the authorization code
        (Linking as any).addEventListener('url', async (event: { url: string }) => {
          const authorizationCode = event.url.split('code=')[1];
          if (authorizationCode) {
            // Call handleCodeExchange from SpotifyAuth.js
            await exchangeCodeForToken(authorizationCode);
            // Remove the event listener
            (Linking as any).removeEventListener('url', handleSpotifyLogin);
          }
        });

      } else {
        console.error('Cannot open Spotify authentication URL');
      }
    } catch (error) {
      console.error('Error opening Spotify authentication URL:', error);
    }
  };

  // const handleSignUpConfirmation = async () => {
  //   try {
  //     const { isSignUpComplete, nextStep } = await confirmSignUp({
  //       username,
  //       confirmationCode, // Pass the confirmationCode state here
  //     });
  //     // Handle successful confirmation
  //   } catch (error: any) {
  //     console.error('Error confirming sign up', error);
  //     Alert.alert('Error confirming sign up', error.message);
  //   }
  // };

  return (
    
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }]}>
      <Text style={styles.title}>Profile Screen</Text>
      {userInfo && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfo}>Username: {userInfo.username}</Text>
          <Text style={styles.userInfo}>User ID: {userInfo.userId}</Text>
          <Text style={styles.userInfo}>Sign In Details: {JSON.stringify(userInfo.signInDetails)}</Text>
          {email && <Text style={styles.userInfo}>Email: {email}</Text>}
        </View>
      )}
      <Button title="Spotfy LogIn" onPress={handleSpotifyLogin} />
      <Button title="Logout" onPress={handleSignOut} />
      <TouchableOpacity onPress={toggleColorScheme}>
        <Text>Toggle Dark Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  userInfoContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  userInfo: {
    marginBottom: 10,
  },
});

export default ProfileScreen;


   {/* <View> */}
      {/* <Text>Enter Confirmation Code:</Text>
        <TextInput
        style={styles.input}
        placeholder="Confirmation Code"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
        autoCapitalize="none"
      />
      <Button title="Confirm" onPress={handleSignUpConfirmation} /> Remove the () from the function call */}   
         {/* </View> */}