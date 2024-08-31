// SpotifyLoginScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



type SignUpSpotifyLoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const SignUpSpotifyLoginScreen: React.FC<SignUpSpotifyLoginScreenProps> = ({ navigation }) => {

// Replace with your actual Spotify login implementation
const handleSpotifyLogin = () => {
    // Implement your Spotify login logic here
    console.log('User logging in with Spotify...');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to Spotify</Text>
      <TouchableOpacity style={styles.button} onPress={handleSpotifyLogin}>
        <Text style={styles.buttonText}>Login with Spotify</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.maybeLaterButton} 
        onPress={() => navigation.navigate('Main')} 
      >
        <Text style={styles.maybeLaterText}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Replace with your background color
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1DB954', // Spotify green
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  maybeLaterButton: {
    marginTop: 10,
  },
  maybeLaterText: {
    color: '#1DB954', // Spotify green
  },
});

export default SignUpSpotifyLoginScreen;