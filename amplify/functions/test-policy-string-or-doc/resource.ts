import { defineFunction, secret } from '@aws-amplify/backend';

export const testPolicyStringOrDoc = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'test-policy-string-or-doc',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts',
  environment: {
    // Reference the secret with the `secret()` function
    PERSPECTIVE_API_KEY: secret('GOOGLE_SERVICE_API_KEY'),
    GOOGLE_CLIENT_EMAIL: secret('GOOGLE_CLIENT_EMAIL'),
    GOOGLE_PRIVATE_KEY: secret('GOOGLE_PRIVATE_KEY')
  },
});
