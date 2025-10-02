import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
// import or define sendEmail
// import { sendEmail } from './sendEmail/resource';
import { sayHello } from './functions/say-hello/resource';

defineBackend({
  auth,
  data,
  // sendEmail,
  sayHello
});
