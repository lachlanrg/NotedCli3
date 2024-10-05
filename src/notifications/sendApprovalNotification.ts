import { generateClient } from 'aws-amplify/api';
import { userDeviceTokensByUserId } from '../graphql/queries';
import { sendNotification } from './sendNotification';

export const sendApprovalNotification = async (
  recipientUserId: string,
  approverUsername: string
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

      const notificationMessage = `${approverUsername} approved your follow request`;

      // Send a notification to each valid device token
      for (const deviceToken of deviceTokens) {
        if (deviceToken) {  // Check if deviceToken is not null or undefined
          const payload = {
            deviceToken: deviceToken,
            title: notificationMessage,
            message: '', // We'll leave this empty as we want to display the title as the main message
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