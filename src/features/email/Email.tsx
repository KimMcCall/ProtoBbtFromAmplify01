// Cribbed by googling "aws amplify send emails from server"
// Gemini was very helpful!
// When "moving to production" there may be some complications. These are addressed here:
//   https://docs.amplify.aws/react/build-a-backend/auth/moving-to-production/
// also
//   https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html

import { SESClient, SESClientConfig, SendEmailCommand } from '@aws-sdk/client-ses';

const configStruct: SESClientConfig = {
  region: 'us-west-1',
  credentials: {
    accessKeyId: "bogus",
    secretAccessKey: "bogus",
  },
};

const sesClient = new SESClient(configStruct);

export const sendEmail = async (event: { toAddresses: string[]; subject: string; body: string; }) => {
  try {
    const { toAddresses, subject, body } = event; // Assuming these are passed in the event

    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        ToAddresses: toAddresses,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      // Source: 'your-verified-sender@example.com', // Replace with your verified sender email
      Source: 'mccall.kim+ts01@gmail.com',
    });

    await sesClient.send(sendEmailCommand);
    console.log('Email sent successfully!');
    return { statusCode: 200, body: 'Email sent!' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { statusCode: 500, body: 'Error sending email.' };
  }
};
