import { Alert } from 'react-native';

interface NotificationPayload {
  deviceToken: string;  // Note: This should be a string, not string | null
  message: string;
  title: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendNotification = async (payload: NotificationPayload): Promise<void> => {
  try {
    console.log('Preparing to send payload:', JSON.stringify(payload));

    // Add a 1-second delay
    await delay(2000);

    const response = await fetch('https://8r28f54x6b.execute-api.ap-southeast-2.amazonaws.com/dev/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const responseText = await response.text();
    // console.log('Raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      data = { error: 'Invalid JSON response' };
    }

    // console.log('Response from server:', data);

    // You can customize this part based on your needs
    if (data.error) {
      console.log('Error sending notification:', data.error);
    } else {
      console.log('Notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};