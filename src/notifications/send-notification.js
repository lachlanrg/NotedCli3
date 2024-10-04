const { PinpointClient, SendMessagesCommand } = require("@aws-sdk/client-pinpoint");

const client = new PinpointClient({ region: "ap-southeast-2" });

const params = {
  ApplicationId: "9c27c4a602f64a11b1690e58fbc0ae18",
  MessageRequest: {
    Addresses: {
      "84844bde225c32584f881d97cdb03ad47efe373639f5540f3a82180e96f04f73": {
        ChannelType: "APNS"
      }
    },
    MessageConfiguration: {
      APNSMessage: {
        Action: "OPEN_APP",
        Body: "This is a test notification",
        Priority: "normal",
        SilentPush: false,
        Title: "Test Notification",
        TimeToLive: 30
      }
    }
  }
};

async function sendNotification() {
  try {
    const command = new SendMessagesCommand(params);
    const response = await client.send(command);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

sendNotification();