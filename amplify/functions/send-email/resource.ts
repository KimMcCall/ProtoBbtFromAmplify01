import { defineFunction, secret } from '@aws-amplify/backend';

export const sendEmail = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'send-email',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  environment: {
    // Reference the secret with the `secret()` function
    API_KEY: secret('SENDGRID_API_KEY'), 
  },
});
