// App.tsx
import * as React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'; //ADDED THIS
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


import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './src/aws-exports';

import { generateClient } from 'aws-amplify/api';
import config from './src/amplifyconfiguration.json';

import { useColorScheme } from 'react-native'; //ADDED THIS
import { ThemeProvider } from './src/utils/ThemeContext';



(Amplify as any).configure(awsconfig);


const client = generateClient();


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const DetailStack = createNativeStackNavigator();


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
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ headerShown: false}} />
      <Tab.Screen name="SearchTab" component={SearchScreen} options={{ headerShown: false }} />
      <Tab.Screen name="CreatePostTab" component={CreatePostScreen} options={{ headerShown: false }} /> 
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ headerShown: false}} />
    </Tab.Navigator>
  );
};

// const DetailStackNavigator = () => {
//   return (
//     <DetailStack.Navigator>
//       {/* Add screens for each detail screen here */}
//       {/* For example: */}
//       <DetailStack.Screen name="ArtistDetail" component={artistDetailScreen} />
//     </DetailStack.Navigator>
//   );
// };

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

