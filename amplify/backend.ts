import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
// import or define sendEmail
// import { sendEmail } from './sendEmail/resource';

defineBackend({
  auth,
  data,
  // sendEmail,
});
