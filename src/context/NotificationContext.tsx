import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { getNotificationSettings, listNotificationSettings } from '../graphql/queries';

interface NotificationContextType {
  deviceToken: string | null;
  handlePermissions: () => Promise<void>;
  launchNotification: GetLaunchNotificationOutput | null;
  activeNotification: { title: string; message: string; isComment: boolean } | null;
  inAppEnabled: boolean;
  updateInAppEnabled: (enabled: boolean) => void;
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
  const [inAppEnabled, setInAppEnabled] = useState<boolean>(true);

  const client = generateClient();

  const createOrGetNotificationSettings = async (userId: string) => {
    try {
      // Check if NotificationSettings exist for the user
      const existingSettings = await client.graphql({
        query: listNotificationSettings,
        variables: { 
            filter: { userId: { eq: userId } }
        }
      });

      if (existingSettings.data.listNotificationSettings.items.length > 0) {
        console.log('Existing NotificationSettings found');
        return existingSettings.data.listNotificationSettings.items[0];
      }

      // If no settings exist, create new settings
      const newSettings = await client.graphql({
        query: mutations.createNotificationSettings,
        variables: {
          input: {
            userId: userId,
            likeEnabled: true,
            commentEnabled: true,
            followRequestEnabled: true,
            repostEnabled: true,
            commentLikeEnabled: true,
            approvalEnabled: true,
            inAppEnabled: true,
          }
        }
      });

      console.log('Created new NotificationSettings');
      return newSettings.data.createNotificationSettings;
    } catch (error) {
      console.error('Error in createOrGetNotificationSettings:', error);
      return null;
    }
  };

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

      // After updating the device token, create or get NotificationSettings
      await createOrGetNotificationSettings(userId);
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
    fetchNotificationSettings();

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
      
      if (!inAppEnabled) {
        console.log('In-app notifications are disabled. Skipping popdown notification.');
        return;
      }
      
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

  const fetchNotificationSettings = async () => {
    try {
      const { userId } = await getCurrentUser();
      const settingsData = await client.graphql({
        query: listNotificationSettings,
        variables: { 
          filter: { userId: { eq: userId } }
        }
      });
      
      if (settingsData.data?.listNotificationSettings.items.length > 0) {
        const settings = settingsData.data.listNotificationSettings.items[0];
        setInAppEnabled(settings.inAppEnabled);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const updateInAppEnabled = (enabled: boolean) => {
    setInAppEnabled(enabled);
  };

  return (
    <NotificationContext.Provider value={{ 
      deviceToken, 
      handlePermissions, 
      launchNotification,
      activeNotification,
      inAppEnabled,
      updateInAppEnabled
    }}>
      <View style={{ flex: 1 }}>
        {children}
        {inAppEnabled && activeNotification && (
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