// amplify/functions/say-hello/handler.ts
import type { Schema } from "../../data/resource"

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  const { name } = event.arguments;
  // your function code goes here
  return `Hello, ${name}!`;
};
