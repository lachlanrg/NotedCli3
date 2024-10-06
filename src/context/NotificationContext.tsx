import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
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
import PopdownNotification from '../components/PopdownNotification';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  deviceToken: string | null;
  handlePermissions: () => Promise<void>;
  launchNotification: GetLaunchNotificationOutput | null;
  activeNotification: { title: string; message: string; isComment: boolean } | null;
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
  const [activeNotification, setActiveNotification] = useState<{ title: string; message: string; isComment: boolean } | null>(null);
  const setupDoneRef = useRef(false);
  const foregroundListenerRef = useRef<OnNotificationReceivedInForegroundOutput | null>(null);
  const lastNotificationTimeRef = useRef(0);
  const notificationListenerRef = useRef<{ remove: () => void } | null>(null);
  const processedNotifications = useRef(new Set<string>());

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
      if (deviceToken === token) return; // Skip if token hasn't changed
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
            },
            options: {
              address: token,
              optOut: 'NONE',
            }
          };

          await identifyUser(identifyUserInput);
          console.log('User identified to Amazon Pinpoint', { userId, username, token });

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

  const setupNotificationListeners = useCallback(() => {
    if (notificationListenerRef.current) {
      return; // Listeners already set up
    }

    const handleNotification = (notification: any) => {
      console.log('Received notification:', notification);
      
      // Generate a unique key for the notification
      const notificationKey = `${notification.title}-${notification.body}-${Date.now()}`;
      
      if (processedNotifications.current.has(notificationKey)) {
        console.log('Ignoring duplicate notification');
        return;
      }
      
      processedNotifications.current.add(notificationKey);
      
      // Remove the key after 5 seconds to prevent the set from growing indefinitely
      setTimeout(() => {
        processedNotifications.current.delete(notificationKey);
      }, 5000);

      const notificationType = notification.data && notification.data.type;
      let title = notification.title || '';
      let message = notification.body || '';
      let isComment = false;

      if (notificationType === 'comment') {
        isComment = true;
        message = title;
        title = ''; // Optional: Set a generic title for all comments
      } else if (notificationType === 'like') {
        title = '';
      } else if (notificationType === 'follow_request') {
        // For follow requests, we'll use the title as the main message
        message = title;
        title = ''; // Clear the title as we want to display the full message
      } else if (notificationType === 'repost') {
        // For reposts, we'll use the title as the main message
        message = title;
        title = ''; // Clear the title as we want to display the full message
      } else if (notificationType === 'approval') {
        // For approvals, we'll use the title as the main message
        message = title;
        title = ''; // Clear the title as we want to display the full message
      } else if (notificationType === 'comment_like') {
        // For comment likes, we'll use the title as the main message
        message = title;
        title = ''; // Clear the title as we want to display the full message
      }
      
      setActiveNotification({
        title: title,
        message: message,
        isComment: isComment
      });
    };

    notificationListenerRef.current = onNotificationReceivedInForeground(handleNotification);
    onNotificationOpened(handleNotification);
  }, []);

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

  const { isAuthenticated } = useAuth();

  const setupNotifications = useCallback(async () => {
    if (setupDoneRef.current) return;
    
    const status = await getPermissionStatus();
    if (status === 'granted') {
      setupTokenListenerAndIdentifyUser();
    } else if (status === 'shouldRequest' || status === 'shouldExplainThenRequest') {
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
    } else {
      console.log('Push notifications permissions denied');
    }

    setupNotificationListeners();
    checkLaunchNotification();
    
    setupDoneRef.current = true;
  }, [setupNotificationListeners]);

  useEffect(() => {
    if (isAuthenticated) {
      setupNotifications();
    }

    return () => {
      if (tokenListener) {
        tokenListener.remove();
      }
      if (notificationListener) {
        notificationListener.remove();
      }
      if (foregroundListenerRef.current) {
        foregroundListenerRef.current.remove();
      }
    };
  }, [isAuthenticated, setupNotifications]);

  let tokenListener: OnTokenReceivedOutput | null = null;
  let notificationListener: { remove: () => void } | null = null;

  return (
    <NotificationContext.Provider value={{ 
      deviceToken, 
      handlePermissions: setupNotifications, 
      launchNotification,
      activeNotification
    }}>
      <View style={{ flex: 1 }}>
        {children}
        {activeNotification && (
          <PopdownNotification
            title={activeNotification.title}
            message={activeNotification.message}
            isComment={activeNotification.isComment}
            onDismiss={() => setActiveNotification(null)}
          />
        )}
      </View>
    </NotificationContext.Provider>
  );
};

// Export a function to handle background notifications
export const handleBackgroundNotification: OnNotificationReceivedInBackgroundInput = async (notification) => {
  console.log('Received notification in background:', notification);
  // Process the received push notification message in the background
  // You can perform tasks like updating local storage, syncing data, etc.
};