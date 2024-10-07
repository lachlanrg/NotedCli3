import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';
import { createNotification } from '../graphql/mutations';

export const sendCommentNotification = async (postId: string, postUserId: string, commenterUsername: string, commentContent: string) => {
  const client = generateClient();

  try {
    // Create a notification record
    await client.graphql({
      query: createNotification,
      variables: {
        input: {
          type: "COMMENT",
          userId: postUserId,
          actorId: commenterUsername, // Use username instead of userId
          targetId: postId,
          read: false,
          message: `${commenterUsername} commented on your post: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`,
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

      // Truncate the comment content to 80 characters
      const truncatedCommentBody = commentContent.length > 80 
        ? commentContent.substring(0, 77) + '...' 
        : commentContent;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {
          const payload = {
            deviceToken: deviceToken,
            title: `${commenterUsername} commented on your post`,
            message: truncatedCommentBody,
            data: {
              type: 'comment',
              postId: postId
            }
          };

          await sendNotification(payload);
        }
      }
      console.log('Comment notifications sent successfully');
    } else {
      console.log('No device tokens found for the user');
    }
  } catch (error) {
    console.error('Error sending comment notification:', error);
  }
};