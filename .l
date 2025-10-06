{
  "auth": {
    "user_pool_id": "us-west-1_1StbYsZ1D",
    "aws_region": "us-west-1",
    "user_pool_client_id": "s5avmeh5epp0eksmqssdh0if9",
    "identity_pool_id": "us-west-1:d3032496-8011-4245-b1b2-32e6aff4bdb6",
    "mfa_methods": [],
    "standard_required_attributes": [
      "email"
    ],
    "username_attributes": [
      "email"
    ],
    "user_verification_types": [
      "email"
    ],
    "mfa_configuration": "NONE",
    "password_policy": {
      "min_length": 8,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": true,
      "require_uppercase": true
    },
    "unauthenticated_identities_enabled": true
  },
  "data": {
    "url": "https://gqwwu2mrjzfwhlzipqgl4ewyda.appsync-api.us-west-1.amazonaws.com/graphql",
    "aws_region": "us-west-1",
    "api_key": "da2-d2tzhx4lifab7jfnfgbfdy75ha",
    "default_authorization_type": "API_KEY",
    "authorization_types": [
      "AMAZON_COGNITO_USER_POOLS",
      "AWS_IAM"
    ],
    "model_introspection": {
      "version": 1,
      "models": {
        "RegisteredUser": {
          "name": "RegisteredUser",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "authId": {
              "name": "authId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "name": {
              "name": "name",
              "isArray": false,
              "type": "String",
              "isRequired": false,
              "attributes": []
            },
            "canonicalEmail": {
              "name": "canonicalEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "initialEmail": {
              "name": "initialEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "isSuperAdmin": {
              "name": "isSuperAdmin",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isAdmin": {
              "name": "isAdmin",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isBanned": {
              "name": "isBanned",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "RegisteredUsers",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "key",
              "properties": {
                "name": "registeredUsersByAuthId",
                "queryField": "listByAuthId",
                "fields": [
                  "authId"
                ]
              }
            },
            {
              "type": "key",
              "properties": {
                "name": "registeredUsersByCanonicalEmail",
                "queryField": "listByCanonicalEmail",
                "fields": [
                  "canonicalEmail"
                ]
              }
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        },
        "RegisteredUserP2": {
          "name": "RegisteredUserP2",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "authId": {
              "name": "authId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "name": {
              "name": "name",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "canonicalEmail": {
              "name": "canonicalEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "initialEmail": {
              "name": "initialEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "isSuperAdmin": {
              "name": "isSuperAdmin",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isAdmin": {
              "name": "isAdmin",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isBanned": {
              "name": "isBanned",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isTrusted": {
              "name": "isTrusted",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "withholdWelcome": {
              "name": "withholdWelcome",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "RegisteredUserP2s",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "key",
              "properties": {
                "name": "registeredUserP2sByAuthId",
                "queryField": "listByAuthIdXP2",
                "fields": [
                  "authId"
                ]
              }
            },
            {
              "type": "key",
              "properties": {
                "name": "registeredUserP2sByCanonicalEmail",
                "queryField": "listByCanonicalEmailXP2",
                "fields": [
                  "canonicalEmail"
                ]
              }
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        },
        "IssueP2": {
          "name": "IssueP2",
          "fields": {
            "issueId": {
              "name": "issueId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "priority": {
              "name": "priority",
              "isArray": false,
              "type": "Int",
              "isRequired": true,
              "attributes": []
            },
            "claim": {
              "name": "claim",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "proUrl": {
              "name": "proUrl",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "conUrl": {
              "name": "conUrl",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "proDocType": {
              "name": "proDocType",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "conDocType": {
              "name": "conDocType",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "proAuthorEmail": {
              "name": "proAuthorEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "conAuthorEmail": {
              "name": "conAuthorEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "isAvailable": {
              "name": "isAvailable",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "commentKey": {
              "name": "commentKey",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "commentText": {
              "name": "commentText",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "commentAuthorEmail": {
              "name": "commentAuthorEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "createdT": {
              "name": "createdT",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": true,
              "attributes": []
            },
            "updatedT": {
              "name": "updatedT",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": true,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "IssueP2s",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "key",
              "properties": {
                "fields": [
                  "issueId",
                  "commentKey"
                ]
              }
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": true,
            "primaryKeyFieldName": "issueId",
            "sortKeyFieldNames": [
              "commentKey"
            ]
          }
        },
        "Submission": {
          "name": "Submission",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "userId": {
              "name": "userId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "category": {
              "name": "category",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "title": {
              "name": "title",
              "isArray": false,
              "type": "String",
              "isRequired": false,
              "attributes": []
            },
            "content": {
              "name": "content",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "isRead": {
              "name": "isRead",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isStarred": {
              "name": "isStarred",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isImportant": {
              "name": "isImportant",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isArchived": {
              "name": "isArchived",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isBanned": {
              "name": "isBanned",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "isTrashed": {
              "name": "isTrashed",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "Submissions",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "key",
              "properties": {
                "name": "submissionsByUserId",
                "queryField": "listByUserId",
                "fields": [
                  "userId"
                ]
              }
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        },
        "Memo": {
          "name": "Memo",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "subject": {
              "name": "subject",
              "isArray": false,
              "type": "String",
              "isRequired": false,
              "attributes": []
            },
            "content": {
              "name": "content",
              "isArray": false,
              "type": "String",
              "isRequired": false,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "Memos",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        },
        "Todo": {
          "name": "Todo",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "content": {
              "name": "content",
              "isArray": false,
              "type": "String",
              "isRequired": false,
              "attributes": []
            },
            "isDone": {
              "name": "isDone",
              "isArray": false,
              "type": "Boolean",
              "isRequired": false,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "Todos",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        },
        "SubmissionTally": {
          "name": "SubmissionTally",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "userId": {
              "name": "userId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "timestamp": {
              "name": "timestamp",
              "isArray": false,
              "type": "Int",
              "isRequired": true,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "SubmissionTallies",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "key",
              "properties": {
                "fields": [
                  "id"
                ]
              }
            },
            {
              "type": "key",
              "properties": {
                "name": "submissionTalliesByUserId",
                "queryField": "byUserId",
                "fields": [
                  "userId"
                ]
              }
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        },
        "UrlSubmission": {
          "name": "UrlSubmission",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "issueId": {
              "name": "issueId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "docType": {
              "name": "docType",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "url": {
              "name": "url",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "stance": {
              "name": "stance",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "submitterId": {
              "name": "submitterId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "submitterEmail": {
              "name": "submitterEmail",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "submitterComment": {
              "name": "submitterComment",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "issueClaim": {
              "name": "issueClaim",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "reviewed": {
              "name": "reviewed",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "accepted": {
              "name": "accepted",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "yucky": {
              "name": "yucky",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "causedBanning": {
              "name": "causedBanning",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "lifePhase": {
              "name": "lifePhase",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "isCloistered": {
              "name": "isCloistered",
              "isArray": false,
              "type": "Boolean",
              "isRequired": true,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "UrlSubmissions",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        },
        "Banning": {
          "name": "Banning",
          "fields": {
            "id": {
              "name": "id",
              "isArray": false,
              "type": "ID",
              "isRequired": true,
              "attributes": []
            },
            "userId": {
              "name": "userId",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "reason": {
              "name": "reason",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "activity": {
              "name": "activity",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "docType": {
              "name": "docType",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "badText": {
              "name": "badText",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "badGdUrl": {
              "name": "badGdUrl",
              "isArray": false,
              "type": "String",
              "isRequired": true,
              "attributes": []
            },
            "createdAt": {
              "name": "createdAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            },
            "updatedAt": {
              "name": "updatedAt",
              "isArray": false,
              "type": "AWSDateTime",
              "isRequired": false,
              "attributes": [],
              "isReadOnly": true
            }
          },
          "syncable": true,
          "pluralName": "Bannings",
          "attributes": [
            {
              "type": "model",
              "properties": {}
            },
            {
              "type": "auth",
              "properties": {
                "rules": [
                  {
                    "allow": "public",
                    "provider": "apiKey",
                    "operations": [
                      "create",
                      "update",
                      "delete",
                      "read"
                    ]
                  }
                ]
              }
            }
          ],
          "primaryKeyInfo": {
            "isCustomPrimaryKey": false,
            "primaryKeyFieldName": "id",
            "sortKeyFieldNames": []
          }
        }
      },
      "enums": {},
      "nonModels": {}
    }
  },
  "version": "1.3"
}