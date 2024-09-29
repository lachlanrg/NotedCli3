// src/screens/AppLoadingScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { fetchAuthSession } from '@aws-amplify/auth';

type AppLoadingScreenProps = {
  navigation: NavigationProp<any>;
};

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const session = await fetchAuthSession();
        const { accessToken, idToken } = session.tokens ?? {};
        if (accessToken && idToken) {
          // Navigate to Main stack if tokens are valid
          navigation.navigate('Main');
          console.log("Access Token Valid with ID: ", accessToken.payload.sub)
          console.log("ID Token Valid with ID: ", idToken.payload.sub)
        } else {
          // Navigate to Login screen if no valid session
          navigation.navigate('Login');
          console.log("Access Token invalid: ", accessToken)
        }
      } catch (err) {
        console.log('No valid session found:', err);
        navigation.navigate('Login');
      }
    };

    checkUserSession();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppLoadingScreen;