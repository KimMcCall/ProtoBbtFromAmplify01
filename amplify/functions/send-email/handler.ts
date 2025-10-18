import type { Schema } from "../../data/resource"
import { env } from '$amplify/env/send-email';
import * as sendgridMail from '@sendgrid/mail';

export const handler: Schema["sendEmail"]["functionHandler"] = async (event) => {
  const apiKey = env.API_KEY;
  sendgridMail.setApiKey(apiKey);

  const content = [];
  if (event.arguments.text) {
    content.push({
      type: 'text/plain',
      value: event.arguments.text,
    });
  }
  if (event.arguments.html) {
    content.push({
      type: 'text/html',
      value: event.arguments.html,
    });
  }
  if (content.length === 0) {
    throw new Error('Either text or html parameter is required');
  }

  // Construct the email object

  if (!event.arguments.sender) throw new Error('Sender parameter is required');
  if (!event.arguments.subject) throw new Error('Subject parameter is required');
  if (!event.arguments.recipients || event.arguments.recipients.length === 0) {
    throw new Error('Recipients parameter is required');
  }

  const email = {
    from: event.arguments.sender,
    to: event.arguments.recipients.filter((r): r is string => r !== null),
    subject: event.arguments.subject,
    text: event.arguments.text || '',
    html: event.arguments.html || '',
    // content: content,
  };

// Send the email
async function sendEmail() {
  try {
    await sendgridMail.send(email);
    console.log('Email sent successfully!');
  } catch (error: any) {
    console.error(error);
    return 'Email failed to send'
    if (error.response) {
      console.error(error.response.body);
      return `Email failed to send: ${JSON.stringify(error.response.body)}`;
    }
  }
  return 'Email send attempt finished (check logs for success/failure)';
}

  return await sendEmail();
};
