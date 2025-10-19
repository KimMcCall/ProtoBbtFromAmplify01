import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
import { getSecret } from './functions/get-secret/resource';
import { sendEmail } from './functions/send-email/resource';

defineBackend({
  auth,
  data,
  sayHello,
  getSecret,
  sendEmail,
});
