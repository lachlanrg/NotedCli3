/**
 * @format
 */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);


import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import {
  initializePushNotifications,
  onNotificationReceivedInBackground,
} from 'aws-amplify/push-notifications';
import { handleBackgroundNotification } from './src/context/NotificationContext';

Amplify.configure(awsconfig);
initializePushNotifications();

// Set up the background notification handler
onNotificationReceivedInBackground(handleBackgroundNotification);

AppRegistry.registerComponent(appName, () => App);