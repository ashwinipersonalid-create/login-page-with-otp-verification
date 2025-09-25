import twilio from "twilio";

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMS = async (to, body) => {
  try {
    if (!to || !body) throw new Error("Recipient number and message body are required");

    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    console.log("SMS sent successfully:", message.sid);
    return message;
  } catch (error) {
    console.error("Twilio SMS Error:", error);
    throw error; // re-throw so caller can handle it
  }
};
