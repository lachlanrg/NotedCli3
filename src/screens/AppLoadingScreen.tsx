// src/screens/AppLoadingScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { fetchAuthSession } from '@aws-amplify/auth';
import { initializeHomeScreenData, HomeScreenData } from '../utils/homeScreenInitializer';

type AppLoadingScreenProps = {
  navigation: NavigationProp<any>;
};

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkUserSessionAndInitialize = async () => {
      try {
        const session = await fetchAuthSession();
        const { accessToken, idToken } = session.tokens ?? {};
        if (accessToken && idToken) {
          // Initialize HomeScreen data
          const homeScreenData: HomeScreenData = await initializeHomeScreenData();
          // Navigate to Main stack with initialized data
          navigation.navigate('Main', { 
            screen: 'HomeTab', 
            params: { 
              screen: 'Home', 
              params: { initialData: homeScreenData } 
            } 
          });
          console.log("Access Token Valid with ID: ", accessToken.payload.sub);
          console.log("ID Token Valid with ID: ", idToken.payload.sub);
        } else {
          // Navigate to Login screen if no valid session
          navigation.navigate('Login');
          console.log("Access Token invalid: ", accessToken);
        }
      } catch (err) {
        console.log('No valid session found:', err);
        navigation.navigate('Login');
      }
    };

    checkUserSessionAndInitialize();
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