import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';

export const sendCommentLikeNotification = async (commentId: string, commentUserId: string, likerUsername: string) => {
  const client = generateClient();

  try {
    // Fetch the UserDeviceToken for the comment creator
    const userDeviceTokenResponse = await client.graphql({
      query: userDeviceTokensByUserId,
      variables: { userId: commentUserId }
    });

    const userDeviceTokens = userDeviceTokenResponse.data.userDeviceTokensByUserId.items;

    if (userDeviceTokens.length > 0) {
      const deviceTokens = userDeviceTokens[0].deviceTokens;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {  // Check if deviceToken is not null or undefined
          const payload = {
            deviceToken: deviceToken,
            title: "New Comment Like",
            message: `${likerUsername} liked your comment!`
          };

          await sendNotification(payload);
        }
      }
      console.log('Comment like notification sent successfully');
    } else {
      console.log('No device tokens found for the user');
    }
  } catch (error) {
    console.error('Error sending comment like notification:', error);
  }
};