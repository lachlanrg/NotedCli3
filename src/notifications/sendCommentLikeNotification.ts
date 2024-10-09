import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';
import { createNotification } from '../graphql/mutations';

export const sendCommentLikeNotification = async (commentId: string, commentUserId: string, likerUsername: string) => {
  const client = generateClient();

  try {
    // Create a notification record
    await client.graphql({
      query: createNotification,
      variables: {
        input: {
          type: "COMMENT_LIKE",
          userId: commentUserId,
          actorId: likerUsername,
          targetId: commentId,
          read: false,
          message: `${likerUsername} liked your comment!`,
          createdAt: new Date().toISOString()
        }
      }
    });

    // Fetch the UserDeviceToken for the comment creator
    const userDeviceTokenResponse = await client.graphql({
      query: userDeviceTokensByUserId,
      variables: { userId: commentUserId }
    });

    const userDeviceTokens = userDeviceTokenResponse.data.userDeviceTokensByUserId.items;

    if (userDeviceTokens.length > 0) {
      const deviceTokens = userDeviceTokens[0].deviceTokens;

      const notificationMessage = `${likerUsername} liked your comment!`;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {
          const payload = {
            deviceToken: deviceToken,
            title: notificationMessage,
            message: '',
            data: {
              type: 'comment_like',
              commentId: commentId
            },
            userId: commentUserId
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