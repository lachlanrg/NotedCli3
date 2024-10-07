import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';
import { createNotification } from '../graphql/mutations';

export const sendApprovalNotification = async (
  recipientUserId: string,
  approverUsername: string
) => {
  const client = generateClient();

  try {
    // Create a notification record
    await client.graphql({
      query: createNotification,
      variables: {
        input: {
          type: "APPROVAL",
          userId: recipientUserId,
          actorId: approverUsername,
          targetId: null, // Approval doesn't have a specific target
          read: false,
          message: `${approverUsername} approved your follow request`,
          createdAt: new Date().toISOString()
        }
      }
    });

    // Fetch the UserDeviceToken for the recipient
    const userDeviceTokenResponse = await client.graphql({
      query: userDeviceTokensByUserId,
      variables: { userId: recipientUserId }
    });

    const userDeviceTokens = userDeviceTokenResponse.data.userDeviceTokensByUserId.items;

    if (userDeviceTokens.length > 0) {
      const deviceTokens = userDeviceTokens[0].deviceTokens;

      const notificationMessage = `${approverUsername} approved your follow request`;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {
          const payload = {
            deviceToken: deviceToken,
            title: notificationMessage,
            message: '',
            data: {
              type: 'approval'
            }
          };

          await sendNotification(payload);
        }
      }
      console.log('Approval notification sent successfully');
    } else {
      console.log('No device tokens found for the user');
    }
  } catch (error) {
    console.error('Error sending approval notification:', error);
  }
};