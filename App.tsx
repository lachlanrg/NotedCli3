// App.tsx
import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser, faSignInAlt, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

//Import Screens
import HomeScreen from './src/screens/homeScreen';
import ProfileScreen from './src/screens/profileScreen';
import LoginScreen from './src/screens/loginScreen'; 
import SignUpScreen from './src/screens/signupScreen'
import CreatePostScreen from './src/screens/createPostScreen'; 
import SearchScreen from './src/screens/searchScreen';
import AlbumDetailsScreen from './src/screens/albumDetailsScreen';

//Initialise Amplify Config
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './src/aws-exports';
import { generateClient } from 'aws-amplify/api';
import config from './src/amplifyconfiguration.json';

import { useColorScheme } from 'react-native'; 
import { ThemeProvider } from './src/utils/ThemeContext';
import { SearchScreenStackParamList } from './src/components/types';


(Amplify as any).configure(awsconfig);

const client = generateClient();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator<SearchScreenStackParamList>(); // Stack for Search screens
const CreatePostStack = createNativeStackNavigator(); // Stack for Create Post screens
const ProfileStack = createNativeStackNavigator(); // Stack for Profile screens

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      {/* Add more screens related to Home here */}
    </HomeStack.Navigator>
  );
};

const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="AlbumDetail" component={AlbumDetailsScreen} options={{ headerShown: false }} />
      {/* Add more screens related to Search here */}
    </SearchStack.Navigator>
  );
};

const CreatePostStackNavigator = () => {
  return (
    <CreatePostStack.Navigator>
      <CreatePostStack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false }} />
      {/* Add more screens related to Create Post here */}
    </CreatePostStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      {/* Add more screens related to Profile here */}
    </ProfileStack.Navigator>
  );
};

const MainTabNavigator = () => {
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
          } else if (route.name === 'SearchTab') {
            iconName = focused ? faSearch : faSearch;
          }

          return <FontAwesomeIcon icon={iconName || faHome} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',  
        tabBarLabel: () => null, // Remove the label from below the icons
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="SearchTab" component={SearchStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="CreatePostTab" component={CreatePostStackNavigator} options={{ headerShown: false }} /> 
      <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};


const App = () => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>

    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
};

// export default withAuthenticator(App);
export default App;

