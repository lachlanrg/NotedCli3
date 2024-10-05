import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';

export const sendRequestNotification = async (
  recipientUserId: string,
  senderUsername: string,
  isPrivateAccount: boolean
) => {
  const client = generateClient();

  try {
    // Fetch the UserDeviceToken for the recipient
    const userDeviceTokenResponse = await client.graphql({
      query: userDeviceTokensByUserId,
      variables: { userId: recipientUserId }
    });

    const userDeviceTokens = userDeviceTokenResponse.data.userDeviceTokensByUserId.items;

    if (userDeviceTokens.length > 0) {
      const deviceTokens = userDeviceTokens[0].deviceTokens;

      // Determine the notification message based on the account type
      const notificationTitle = isPrivateAccount
        ? `${senderUsername} requested to follow you`
        : `${senderUsername} is now following you`;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {  // Check if deviceToken is not null or undefined
          const payload = {
            deviceToken: deviceToken,
            title: notificationTitle,
            message: '', // We'll leave this empty as we want to display the title as the main message
            data: {
              type: 'follow_request'
            }
          };

          await sendNotification(payload);
        }
      }
    //   console.log('Request/Follow notification sent successfully');
    } else {
      console.log('No device tokens found for the user');
    }
  } catch (error) {
    console.error('Error sending request/follow notification:', error);
  }
};