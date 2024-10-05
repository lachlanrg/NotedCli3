import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';

export const sendPostLikeNotification = async (postId: string, postUserId: string, likerUsername: string) => {
  const client = generateClient();

  try {
    // Fetch the UserDeviceToken for the post creator
    const userDeviceTokenResponse = await client.graphql({
      query: userDeviceTokensByUserId,
      variables: { userId: postUserId }
    });

    const userDeviceTokens = userDeviceTokenResponse.data.userDeviceTokensByUserId.items;

    if (userDeviceTokens.length > 0) {
      const deviceTokens = userDeviceTokens[0].deviceTokens;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {  // Check if deviceToken is not null or undefined
          const payload = {
            deviceToken: deviceToken,
            title: "New Like", // This won't be displayed for likes
            message: `${likerUsername} liked your post!`,
            data: {
              type: 'like'
            }
          };

          await sendNotification(payload);
        }
      }
      console.log('Like notifications sent successfully');
    } else {
      console.log('No device tokens found for the user');
    }
  } catch (error) {
    console.error('Error sending like notification:', error);
  }
};