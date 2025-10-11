// import { secret } from "@aws-amplify/backend";
import type { Schema } from "../../data/resource"
import { env } from '$amplify/env/get-secret';


export const handler: Schema["getSecret"]["functionHandler"] = async (/*event*/) => {
  // Retrieve the secret value from the environment variable
  const apiKey = env.API_KEY; 
  // You can also retrieve a secret by name from the event arguments if needed
  // const { name } = event.arguments;
  // if (!name) throw new Error('Secret name parameter is required');
  // const secretValue = secret(name);
  // const secretValue = "swordfish!";
  // return secretValue.toString();
  return apiKey;
};
