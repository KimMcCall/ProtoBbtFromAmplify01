// import { secret } from "@aws-amplify/backend";
import type { Schema } from "../../data/resource"
import { env } from '$amplify/env/get-secret';


export const handler: Schema["getSecret"]["functionHandler"] = async (/*event*/) => {
  // Retrieve the secret value from the environment variable
  const apiKey = env.API_KEY; 
  return apiKey;
};
