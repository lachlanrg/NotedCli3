import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId, getPost } from '../graphql/queries';
import { sendNotification } from './sendNotification';
import { createNotification } from '../graphql/mutations';

export const sendRepostNotification = async (postId: string, postUserId: string, reposterUsername: string) => {
  const client = generateClient();

  try {
    // Fetch the original post first
    const postResponse = await client.graphql({
      query: getPost,
      variables: { id: postId }
    });
    const originalPost = postResponse.data.getPost;

    if (!originalPost) {
      throw new Error('Original post not found');
    }

    // Create a notification record
    await client.graphql({
      query: createNotification,
      variables: {
        input: {
          type: "REPOST",
          userId: postUserId,
          actorId: reposterUsername,
          targetId: postId,
          read: false,
          message: `${reposterUsername} reposted your post!`,
          createdAt: new Date().toISOString()
        }
      }
    });

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
        if (deviceToken) {
          const payload = {
            deviceToken: deviceToken,
            title: notificationMessage,
            message: '',
            data: {
              type: 'repost',
              postId: postId
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