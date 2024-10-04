const { PinpointClient, SendMessagesCommand } = require("@aws-sdk/client-pinpoint");

// Update this line to match your Pinpoint project's region
const client = new PinpointClient({ region: "ap-southeast-2" });

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    let deviceToken, message, title;

    try {
        let body;
        if (typeof event.body === 'string') {
            body = JSON.parse(event.body);
        } else if (typeof event.body === 'object') {
            body = event.body;
        } else {
            throw new Error('Invalid event body type');
        }
        
        console.log('Parsed body:', JSON.stringify(body, null, 2));

        deviceToken = body.deviceToken;
        message = body.message;
        title = body.title;
    } catch (error) {
        console.error('Error parsing event body:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid input', error: error.message })
        };
    }

    if (!deviceToken || !message || !title) {
        console.error('Missing required parameters:', { deviceToken, message, title });
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing required parameters' })
        };
    }

    const params = {
        ApplicationId: "9c27c4a602f64a11b1690e58fbc0ae18",
        MessageRequest: {
            Addresses: {
                [deviceToken]: {
                    ChannelType: "APNS_SANDBOX" // or "APNS" for production
                }
            },
            MessageConfiguration: {
                APNSMessage: {
                    Action: "OPEN_APP",
                    Body: message,
                    Priority: "normal",
                    SilentPush: false,
                    Title: title,
                    TimeToLive: 30
                }
            }
        }
    };

    console.log('Sending notification to channel:', params.MessageRequest.Addresses[deviceToken].ChannelType);

    try {
        const command = new SendMessagesCommand(params);
        const response = await client.send(command);
        console.log("Notification sent successfully:", JSON.stringify(response, null, 2));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notification sent successfully', response })
        };
    } catch (error) {
        console.error("Error sending notification:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error sending notification', error: error.message })
        };
    }
};