import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';

export const sendRepostNotification = async (postId: string, postUserId: string, reposterUsername: string) => {
  const client = generateClient();

  try {
    // Fetch the UserDeviceToken for the original post creator
    const userDeviceTokenResponse = await client.graphql({
      query: userDeviceTokensByUserId,
      variables: { userId: postUserId }
    });

    const userDeviceTokens = userDeviceTokenResponse.data.userDeviceTokensByUserId.items;

    if (userDeviceTokens.length > 0) {
      const deviceTokens = userDeviceTokens[0].deviceTokens;

      const notificationMessage = `${reposterUsername} reposted your post!`;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {  // Check if deviceToken is not null or undefined
          const payload = {
            deviceToken: deviceToken,
            title: notificationMessage,
            message: '', // We'll leave this empty as we want to display the title as the main message
            data: {
              type: 'repost'
            }
          };

          await sendNotification(payload);
        }
      }
      console.log('Repost notification sent successfully');
    } else {
      console.log('No device tokens found for the user');
    }
  } catch (error) {
    console.error('Error sending repost notification:', error);
  }
};