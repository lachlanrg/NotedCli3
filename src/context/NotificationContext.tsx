import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getPermissionStatus,
  requestPermissions,
  onTokenReceived,
  OnTokenReceivedInput,
  OnTokenReceivedOutput,
  onNotificationOpened,
  OnNotificationOpenedInput,
  onNotificationReceivedInForeground,
  OnNotificationReceivedInForegroundInput,
  OnNotificationReceivedInForegroundOutput,
  OnNotificationReceivedInBackgroundInput,
  getLaunchNotification,
  GetLaunchNotificationOutput,
  identifyUser,
  IdentifyUserInput
} from 'aws-amplify/push-notifications';
import { getCurrentUser, GetCurrentUserOutput } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';

interface NotificationContextType {
  deviceToken: string | null;
  handlePermissions: () => Promise<void>;
  launchNotification: GetLaunchNotificationOutput | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [launchNotification, setLaunchNotification] = useState<GetLaunchNotificationOutput | null>(null);

  const client = generateClient();

  const updateUserDeviceToken = async (userId: string, token: string) => {
    try {
      // Query for existing UserDeviceToken entry
      const response = await client.graphql({
        query: queries.userDeviceTokensByUserId,
        variables: { userId: userId }
      });

      const items = response.data.userDeviceTokensByUserId.items;

      if (items.length > 0) {
        // Update existing entry
        const existingEntry = items[0];
        if (!existingEntry.deviceTokens.includes(token)) {
          const updatedTokens = [...existingEntry.deviceTokens, token];
          await client.graphql({
            query: mutations.updateUserDeviceToken,
            variables: {
              input: {
                id: existingEntry.id,
                deviceTokens: updatedTokens,
                _version: existingEntry._version
              }
            }
          });
          console.log('Updated UserDeviceToken entry');
        } else {
          console.log('Device token already exists for this user');
        }
      } else {
        // Create new entry
        await client.graphql({
          query: mutations.createUserDeviceToken,
          variables: {
            input: {
              userId: userId,
              deviceTokens: [token]
            }
          }
        });
        console.log('Created new UserDeviceToken entry');
      }
    } catch (error) {
      console.error('Error updating UserDeviceToken:', error);
    }
  };

  const setupTokenListenerAndIdentifyUser = () => {
    const myTokenReceivedHandler: OnTokenReceivedInput = async (token) => {
      console.log('Received device token:', token);
      setDeviceToken(token);
      
      try {
        const { userId, username }: GetCurrentUserOutput = await getCurrentUser();
        console.log('Identifying user to Amazon Pinpoint', { userId, username, token });

        if (userId && token) {
          const identifyUserInput: IdentifyUserInput = {
            userId: userId,
            userProfile: {
              name: username || '',
              // Add more user profile details as needed
            },
            options: {
              address: token,
              optOut: 'NONE',
            }
          };

          await identifyUser(identifyUserInput);
          console.log('User identified to Amazon Pinpoint', { userId, username, token });

          // Update UserDeviceToken
          await updateUserDeviceToken(userId, token);
        } else {
          console.log('User not authenticated or missing required information');
        }
      } catch (error) {
        console.error('Error identifying user to Amazon Pinpoint:', error);
      }
    };
  
    return onTokenReceived(myTokenReceivedHandler);
  };

  useEffect(() => {
    handlePermissions();
    setupTokenListenerAndIdentifyUser();
    setupNotificationListener();
    setupForegroundNotificationListener();
    checkLaunchNotification();

    return () => {
      if (tokenListener) {
        tokenListener.remove();
      }
      if (notificationListener) {
        notificationListener.remove();
      }
      if (foregroundNotificationListener) {
        foregroundNotificationListener.remove();
      }
    };
  }, []);

  let tokenListener: OnTokenReceivedOutput | null = null;
  let notificationListener: { remove: () => void } | null = null;
  let foregroundNotificationListener: OnNotificationReceivedInForegroundOutput | null = null;

  const setupNotificationListener = () => {
    const handleNotificationOpened: OnNotificationOpenedInput = (notification) => {
      console.log('Notification opened:', notification);
      // Handle the opened notification here
      // You can add logic to navigate to a specific screen or update the app state
      // based on the notification content
    };

    notificationListener = onNotificationOpened(handleNotificationOpened);
  };

  const setupForegroundNotificationListener = () => {
    const handleForegroundNotification: OnNotificationReceivedInForegroundInput = (notification) => {
      console.log('Received notification in foreground:', notification);
      // Handle the foreground notification here (e.g., show an alert, update UI)
    };

    foregroundNotificationListener = onNotificationReceivedInForeground(handleForegroundNotification);
  };

  const checkLaunchNotification = async () => {
    try {
      const notification = await getLaunchNotification();
      if (notification) {
        console.log('App launched from notification:', notification);
        setLaunchNotification(notification);
        // Handle the launch notification here
        // For example, navigate to a specific screen based on the notification content
      }
    } catch (error) {
      console.error('Error getting launch notification:', error);
    }
  };

  const handlePermissions = async () => {
    const status = await getPermissionStatus();
    if (status === 'granted') {
      setupTokenListenerAndIdentifyUser();
      return;
    }
    if (status === 'denied') {
      console.log('Push notifications permissions denied');
      return;
    }
    if (status === 'shouldRequest' || status === 'shouldExplainThenRequest') {
      try {
        const result = await requestPermissions();
        if (result) {
          setupTokenListenerAndIdentifyUser();
        } else {
          console.log('Push notifications permissions not granted');
        }
      } catch (error) {
        console.error('Error requesting push notification permissions:', error);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      deviceToken, 
      handlePermissions, 
      launchNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Export a function to handle background notifications
export const handleBackgroundNotification: OnNotificationReceivedInBackgroundInput = async (notification) => {
  console.log('Received notification in background:', notification);
  // Process the received push notification message in the background
  // You can perform tasks like updating local storage, syncing data, etc.
};