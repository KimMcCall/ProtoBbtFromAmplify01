import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
// import or define sendEmail
// import { sendEmail } from './sendEmail/resource';

defineBackend({
  auth,
  data,
  sayHello,
  // sendEmail,
});
