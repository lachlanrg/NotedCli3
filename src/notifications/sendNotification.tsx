import { Alert } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { getNotificationSettings, listNotificationSettings } from '../graphql/queries';

interface NotificationPayload {
  deviceToken: string;
  message: string;
  title: string;
  data: {
    type: string;
    [key: string]: any;
  };
  userId: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendNotification = async (payload: NotificationPayload): Promise<void> => {
  try {
    const client = generateClient();

    // Fetch user's notification settings
    const settingsResponse = await client.graphql({
      query: listNotificationSettings,
      variables: { 
          filter: { userId: { eq: payload.userId } }
      }
    });

    const userSettings = settingsResponse.data.listNotificationSettings.items[0];
    if (!userSettings) {
      console.log(`No notification settings found for user ${payload.userId}`);
      return;
    }

    // Check if the notification type is enabled
    const isEnabled = checkNotificationEnabled(userSettings, payload.data.type);

    if (!isEnabled) {
      console.log(`Notification type ${payload.data.type} is disabled for user ${payload.userId}`);
      return;
    }

    console.log('Preparing to send payload:', JSON.stringify(payload));

    // Add a 1-second delay
    // await delay(1000);

    const response = await fetch('https://8r28f54x6b.execute-api.ap-southeast-2.amazonaws.com/dev/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const responseText = await response.text();
    // console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      data = { error: 'Invalid JSON response' };
    }

    // console.log('Response from server:', data);

    // You can customize this part based on your needs
    if (data.error) {
      console.log('Error sending notification:', data.error);
    } else {
      console.log('Notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const checkNotificationEnabled = (settings: any, notificationType: string): boolean => {
  switch (notificationType) {
    case 'like':
      return settings.likeEnabled;
    case 'comment':
      return settings.commentEnabled;
    case 'follow_request':
      return settings.followRequestEnabled;
    case 'repost':
      return settings.repostEnabled;
    case 'comment_like':
      return settings.commentLikeEnabled;
    case 'approval':
      return settings.approvalEnabled;
    default:
      return true; // Enable by default for unknown types
  }
};