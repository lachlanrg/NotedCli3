// App.tsx
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faPlus, faSearch, faUser, faCompass } from '@fortawesome/free-solid-svg-icons';
import { dark, light, gray, error, placeholder, lgray } from './src/components/colorModes';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { faCompass } from '@fortawesome/free-regular-svg-icons';


//Import Screens
import HomeScreen from './src/screens/HomeStack/homeScreen';
import ProfileScreen from './src/screens/ProfileStack/profileScreen';
import LoginScreen from './src/screens/loginScreen'; 
import SignUpScreen from './src/screens/signupScreen'
import CreatePostScreen from './src/screens/createPostScreen'; 
import SearchScreen from './src/screens/SearchStack/searchScreen';
import AlbumDetailsScreen from './src/screens/SearchStack/albumDetailsScreen';
import UserSearchScreen from './src/screens/ProfileStack/userSearchScreen';
import UserSearchProfileScreen from './src/screens/ProfileStack/userSearchProfileScreen';
import NotificationsScreen from './src/screens/ProfileStack/notificationsScreen';
import PostSpotifyTrackScreen from './src/screens/SearchStack/postSpotifyTrackScreen';
import PostSpotifyAlbumScreen from './src/screens/SearchStack/postSpotifyAlbumScreen';
import PostSCTrackScreen from './src/screens/SearchStack/postSCTrackScreen';
import ExploreScreen from './src/screens/ExploreStack/exploreScreen';
import ItemDetailsExploreScreen from './src/screens/ExploreStack/itemDetailsExploreScreen';
import ResetPasswordScreen from './src/screens/ProfileStack/ResetPasswordScreen';
import HomeUserProfileScreen from './src/screens/HomeStack/homeUserProfileScreen';
import PostRepostScreen from './src/screens/HomeStack/postRepostScreen';
import RepostOriginalPostScreen from './src/screens/HomeStack/repostOriginalPostScreen';
import SignUpSpotifyLoginScreen from './src/screens/SignUpSpotifyLoginScreen';
import GeneralSettingsScreen from './src/screens/ProfileStack/generalSettingsScreen';
import AccountSettingsScreen from './src/screens/ProfileStack/accountSettingsScreen';
import NotificationsSettingsScreen from './src/screens/ProfileStack/notificationsSettingsScreen';
import SpotifyAccountSettingsScreen from './src/screens/ProfileStack/spotifyAccountSettingsScreen';
import AccessibilitySettingsScreen from './src/screens/ProfileStack/accessibilitySettingsScreen';
import PrivacySettingsScreen from './src/screens/ProfileStack/privacySettingsScreen';

//Initialise Amplify Config
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './src/aws-exports';
import { generateClient } from 'aws-amplify/api';
import config from './src/amplifyconfiguration.json';

import { useColorScheme } from 'react-native'; 
import { ThemeProvider } from './src/utils/ThemeContext';

import { SpotifyProvider } from './src/context/SpotifyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Stack ParamLists
import { SearchScreenStackParamList } from './src/components/types';
import { ProfileStackParamList } from './src/components/types';
import { CreatePostStackParamList } from './src/components/types';
import { HomeStackParamList } from './src/components/types';
import { ExploreStackParamList } from './src/components/types';


(Amplify as any).configure(awsconfig);

const client = generateClient();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchScreenStackParamList>(); // Stack for Search screens
const CreatePostStack = createNativeStackNavigator<CreatePostStackParamList>(); // Stack for Create Post screens
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>(); // Stack for Profile screens
const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="HomeUserProfile" component={HomeUserProfileScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="PostRepost" component={PostRepostScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="RepostOriginalPost" component={RepostOriginalPostScreen} options={{ headerShown: false }} />

    </HomeStack.Navigator>
  );
};

const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="AlbumDetail" component={AlbumDetailsScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="PostSpotifyTrack" component={PostSpotifyTrackScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="PostSpotifyAlbum" component={PostSpotifyAlbumScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="PostSCTrack" component={PostSCTrackScreen} options={{ headerShown: false }} />

    </SearchStack.Navigator>
  );
};

const CreatePostStackNavigator = () => {
  return (
    <CreatePostStack.Navigator>
      <CreatePostStack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false }} />
    </CreatePostStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="UserSearch" component={UserSearchScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="UserSearchProfile" component={UserSearchProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="GeneralSettings" component={GeneralSettingsScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="AccountSettings" component={AccountSettingsScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="SpotifyAccountSettings" component={SpotifyAccountSettingsScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="AccessibilitySettings" component={AccessibilitySettingsScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} options={{ headerShown: false }} />

    </ProfileStack.Navigator>
  );
};

const ExploreStackNavigator = () => {
  return (
    <ExploreStack.Navigator>
      <ExploreStack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: false }} />
      <ExploreStack.Screen name="ItemDetailsExplore" component={ItemDetailsExploreScreen} options={{ headerShown: false }} />
    </ExploreStack.Navigator>
  )
}

const MainTabNavigator = () => {
  const homeScreenRef = useRef(null);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? faHome : faHome;
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? faUser : faUser;
          } else if (route.name === 'CreatePostTab') { 
          iconName = focused ? faPlus : faPlus;
          } else if (route.name === 'ExploreTab') { 
          iconName = focused ? faCompass : faCompass;
          } else if (route.name === 'SearchTab') {
            iconName = focused ? faSearch : faSearch;
          }

          return <FontAwesomeIcon icon={iconName || faHome} size={size} color={color} />;
        },
        tabBarActiveTintColor: light,
        tabBarInactiveTintColor: lgray,  
        tabBarLabel: () => null, // Remove the label from below the icons
        tabBarStyle: { backgroundColor: gray, borderTopWidth: 0 },
        safeAreaInsets: { top: 0 },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="SearchTab" component={SearchStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="CreatePostTab" component={CreatePostStackNavigator} options={{ headerShown: false }} /> 
      <Tab.Screen name="ExploreTab" component={ExploreStackNavigator} options={{ headerShown: false }} /> 
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};


// const MainScreenWithSpotify = () => ( 
//   <SpotifyProvider> 
//     <MainTabNavigator /> 
//   </SpotifyProvider> 
// );

const App = () => {
  const colorScheme = useColorScheme();

  return (
    <SpotifyProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ThemeProvider>
              <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack.Navigator>
                  <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="SignUpSpotifyLogin" component={SignUpSpotifyLoginScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
              </NavigationContainer>
            </ThemeProvider>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </SpotifyProvider>
  );
};

// export default withAuthenticator(App);
export default App;

