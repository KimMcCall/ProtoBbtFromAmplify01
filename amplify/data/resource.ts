import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  RegisteredUser: a
    .model({
      authId: a.string().required(),
      name: a.string(),
      canonicalEmail: a.string().required(),
      initialEmail: a.string().required(),
      isSuperAdmin: a.boolean().required().default(false),
      isAdmin: a.boolean().required().default(false),
      isBanned: a.boolean().required().default(false),
    })
    .secondaryIndexes((index) => [
      index("authId").queryField("listByAuthId"),
      index("canonicalEmail").queryField("listByCanonicalEmail"),
    ])
    .authorization((allow) => [allow.publicApiKey()]),
  IssueP1: a
    .model({
      issueId: a.string().required(),
      proUrl: a.string().required(),
      conUrl: a.string().required(),
      proAuthorId: a.string().required(), // Who contributed the proUrl
      conAuthorId: a.string().required(), // Who contributed the conUrl
      commentKey: a.string().required(), // Composite sort key: "PRO#{commentId}" or "CON#{commentId}"
      /* The 'required()' call in the following line is commented out because it
         generated an error Property 'required' does not exist on type 'EnumType<readonly
      */
      commentType: a.enum(['PRO', 'CON'])/*.required()*/, // Helper field to identify comment type
      commentId: a.string().required(), // Unique identifier for the comment
      commentText: a.string().required(),
      authorId: a.string().required(),  // author of comment
      createdT: a.datetime().required(),
      updatedT: a.datetime().required(),
    })
    .identifier(['issueId', 'commentKey']) // Composite primary key
    .authorization((allow) => [allow.publicApiKey()]),
  Submission: a
    .model({
      userId: a.string(),
      category: a.string().required(),
      title: a.string().required().default(''),
      content: a.string().required(),
      isRead: a.boolean().required().default(false),
      isStarred: a.boolean().required().default(false),
      isImportant: a.boolean().required().default(false),
      isArchived: a.boolean().required().default(false),
      isBanned: a.boolean().required().default(false),
      isTrashed: a.boolean().required().default(false),
    })
    .secondaryIndexes((index) => [
      index("userId").queryField("listByUserId"),
    ])
    .authorization((allow) => [allow.publicApiKey()]),
  Memo: a
    .model({
      subject: a.string(),
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean().default(false), // Example of adding a new boolean field
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
