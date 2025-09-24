import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

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
  RegisteredUserP2: a
    .model({
      authId: a.string().required(),
      name: a.string().required().default(''),
      canonicalEmail: a.string().required(),
      initialEmail: a.string().required(),
      isSuperAdmin: a.boolean().required().default(false),
      isAdmin: a.boolean().required().default(false),
      isBanned: a.boolean().required().default(false),
      isTrusted: a.boolean().required().default(false),
    })
    .secondaryIndexes((index) => [
      index("authId").queryField("listByAuthIdXP2"),
      index("canonicalEmail").queryField("listByCanonicalEmailXP2"),
    ])
    .authorization((allow) => [allow.publicApiKey()]),
  IssueP1: a
    .model({
      issueId: a.string().required(),
      priority: a.integer(),
      claim: a.string().required(),
      proUrl: a.string().required(),
      conUrl: a.string().required(),
      proIsPdf: a.boolean().required().default(false),
      conIsPdf: a.boolean().required().default(false),
      proAuthorId: a.string().required(), // Who contributed the proUrl
      conAuthorId: a.string().required(), // Who contributed the conUrl
      makeAvailable: a.boolean().required().default(false),
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
  IssueP2: a
    .model({
      issueId: a.string().required(),
      priority: a.integer().required().default(10000),
      claim: a.string().required(),
      proUrl: a.string().required(),
      conUrl: a.string().required(),
      proDocType: a.string().required().default('NONE'), // Other possible values: Pdf, YouTube, GoogleDoc, Unknown
      conDocType: a.string().required().default('NONE'), // Other possible values: Pdf, YouTube, GoogleDoc, Unknown
      proAuthorEmail: a.string().required(), // Who contributed the proUrl
      conAuthorEmail: a.string().required(), // Who contributed the conUrl
      isAvailable: a.boolean().required().default(false),
      commentKey: a.string().required(), // Second half of composite sort key: "ISSUE#COMMENT#{timeStamp}"
      commentText: a.string().required(),
      commentAuthorEmail: a.string().required(),  // author of comment
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
  SubmissionTally: a
    .model({
      id: a.id().required(),
      userId: a.string().required(),
      timestamp: a.integer().required(),
    })
    .secondaryIndexes((index) => [
      index("userId").queryField("byUserId"),
    ])
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
