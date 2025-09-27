// Cribbed by googling "aws amplify send emails from server"
// Gemini was very helpful!
// When "moving to production" there may be some complications. These are addressed here:
//   https://docs.amplify.aws/react/build-a-backend/auth/moving-to-production/
// also
//   https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html

import { SESClient, SESClientConfig, SendEmailCommand } from '@aws-sdk/client-ses';
import sgMail from '@sendgrid/mail';
// import { Amplify, API } from 'aws-amplify';
// import awsExports from '../../aws-exports';
// Amplify.configure(awsExports);

// import { API } from 'aws-amplify';
// import { createEmail } from '../../graphql/mutations';
// import { GraphQLResult } from '@aws-amplify/api-graphql';

// interface CreateEmailMutation {
//   id: string;
//   toAddresses: string[];
//   subject: string;
//   body: string;
// }

// export const sendEmailViaAppSync = async (emailData: { toAddresses: string[]; subject: string; body: string; }) => {
//   const { toAddresses, subject, body } = emailData;

//   const input = {
//     toAddresses,
//     subject,
//     body,
//   };

//   try {
//     const result = await API.graphql({
//       query: createEmail,
//       variables: { input },
//     }) as GraphQLResult<{ createEmail: CreateEmailMutation }>;

//     if (result.data) {
//       console.log('Email request sent successfully:', result.data.createEmail);
//     } else {
//       console.error('Error sending email request:', result.errors);
//     }
//   } catch (error) {
//     console.error('Error sending email request:', error);
//   }
// };

// Note: The following credentials are placeholders. In a real application, use secure methods to manage credentials.
// For example, use AWS IAM roles, environment variables, or AWS Secrets Manager.
// Never hard-code sensitive information in your source code. This is just for demonstration purposes.  
const configStruct: SESClientConfig = {
  region: 'us-west-1',
  credentials: {
    accessKeyId: "bogus",
    secretAccessKey: "bogus",
  },
};

const sesClient = new SESClient(configStruct);

export const sendServerEmail = async (event: { toAddresses: string[]; subject: string; body: string; }) => {
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

export const sendClientEmail = async (emailArgStruct: { toAddresses: string[]; subject: string; body: string; }) => {
  console.log('At top of sendClientEmail...');
  // const apiKey = process.env.SENDGRID_API_KEY || 'bogus';
  let apiKey = import.meta.env.SENDGRID_API_KEY || 'bogus';

  const hardCodedTestApiKey = 'SG.XXXXXXX-XXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Replace with your actual SendGrid API key for local testing only

  console.log('In sendClientEmail, apiKey is:', apiKey ? 'present' : 'absent');
  console.log(`apiKey: ${apiKey}`);

  if (apiKey === 'bogus') {
    console.error('No API key found; using hard-coded test key. This is insecure and should only be used for local testing.');
    apiKey = hardCodedTestApiKey;
  }

  sgMail.setApiKey(apiKey);
    
  try {
    const { toAddresses, subject, body } = emailArgStruct; // Assuming these are passed in the event

    // Here you would implement the logic to send the email from the client side
    console.log('Sending client email...');
    console.log('To:', toAddresses);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('About to build myEmail struct...');
    const myEmail: ClientEmailData = {
      to: toAddresses,
      subject: subject,
      body: body,
    };
    console.log('Built myEmail struct:', myEmail);

    console.log('Calling cribbedSendEmail...');
    await cribbedSendEmail(myEmail);

    return { statusCode: 200, body: 'Client email sent!' };
  } catch (error) {
    console.error('Error sending client email:', error);
    return { statusCode: 500, body: 'Error sending client email.' };
  }
};

interface ClientEmailData {
  to: string[];
  subject: string;
  body: string;
}

// cribbed from https://stackoverflow.com/questions/4338267/how-to-send-an-email-using-javascript
// But more directly from Gemini, googling "send email post fetch typescript"
async function cribbedSendEmail(emailData: ClientEmailData): Promise<Response> {
  console.log('At top of cribbedSendEmail...');

  const url = 'https://api.sendgrid.com/v3/mail/send';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      // Handle HTTP errors (e.g., 400, 500)
      const errorData = await response.json(); // Or response.text() if not JSON
      throw new Error(`Email sending failed: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    return response; // Return the successful response
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw for further handling
  }
}
