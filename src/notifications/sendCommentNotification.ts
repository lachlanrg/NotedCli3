import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';

export const sendCommentNotification = async (
  recipientUserId: string,
  commenterUsername: string,
  commentBody: string
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

      // Truncate the comment body to 80 characters
      const truncatedCommentBody = commentBody.length > 80 
        ? commentBody.substring(0, 77) + '...' 
        : commentBody;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {  // Check if deviceToken is not null or undefined
          const payload = {
            deviceToken: deviceToken,
            title: `${commenterUsername} commented on your post`,
            message: truncatedCommentBody,
            data: {
              type: 'comment'
            }
          };

          await sendNotification(payload);
        }
      }
      console.log('Comment notification sent successfully');
    } else {
      console.log('No device tokens found for the user');
    }
  } catch (error) {
    console.error('Error sending comment notification:', error);
  }
};