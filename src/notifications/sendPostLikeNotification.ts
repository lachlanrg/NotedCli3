import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';
import { createNotification } from '../graphql/mutations';

export const sendPostLikeNotification = async (postId: string, postUserId: string, likerUsername: string) => { 
  const client = generateClient();

  try {
    // Create a notification record
    await client.graphql({
      query: createNotification,
      variables: {
        input: {
          type: "LIKE",
          userId: postUserId,
          actorId: likerUsername, // Use username instead of userId
          targetId: postId,
          read: false,
          message: `${likerUsername} liked your post!`,
          createdAt: new Date().toISOString()
        }
      }
    });

    // Fetch the UserDeviceToken for the post creator
    const userDeviceTokenResponse = await client.graphql({
      query: userDeviceTokensByUserId,
      variables: { userId: postUserId }
    });

    const userDeviceTokens = userDeviceTokenResponse.data.userDeviceTokensByUserId.items;

    if (userDeviceTokens.length > 0) {
      const deviceTokens = userDeviceTokens[0].deviceTokens;

      // Send a push notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {
          const payload = {
            deviceToken: deviceToken,
            title: "New Like",
            message: `${likerUsername} liked your post!`,
            data: {
              type: 'like',
              postId: postId
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