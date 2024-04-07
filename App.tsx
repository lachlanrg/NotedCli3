// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

(Amplify as any).configure(awsconfig);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// export default withAuthenticator(App);
export default App;

