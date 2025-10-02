import { dbClient } from '../main';
import { defaultConAuthor, defaultProAuthor, docType_Unknown, PlaceholderForEmptyComment, PlaceholderForEmptyUrl } from './constants';

// CREATE Operation - Adding a new issue (with no comment)
async function createIssue(
    priority: number,
    claim: string,
    proUrl: string,
    conUrl: string,
    proDocType: string,
    conDocType: string,
    proAuthorEmail: string,
    conAuthorEmail: string,
    currentUserEmail: string,
  ) {
  const nowStr = new Date().toISOString();
  try {
    console.log(`DBM: calling IssueP2.create() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP2.create({
      issueId: 'ISSUE#' + nowStr,
      priority: priority,
      claim: claim,
      proUrl: proUrl || PlaceholderForEmptyUrl,
      conUrl: conUrl || PlaceholderForEmptyUrl,
      proDocType: proDocType || docType_Unknown,
      conDocType: conDocType || docType_Unknown,
      proAuthorEmail: proAuthorEmail || defaultProAuthor,
      conAuthorEmail: conAuthorEmail || defaultConAuthor,
      isAvailable: false,  // make it available later
      commentKey: 'ISSUE#COMMENT#' + nowStr,
      commentText: PlaceholderForEmptyComment,
      commentAuthorEmail: currentUserEmail,
      createdT: nowStr,
      updatedT: nowStr,
    });
    const { data, errors } = result;
    if (data === null) {
      if (errors) {
        const message = errors[0].message;
        console.log(message);
      }
    } else {
      console.log('Returned from createIssue: ', result);
    }
    return result;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}

// One or more parameter values are not valid. The AttributeValue for a key attribute cannot contain an empty string value. Key: commentKey (Service: DynamoDb, Status Code: 400, Request ID: 6GV7ABSRK00OJLJ8052D5K2KIRVV4KQNSO5AEMVJF66Q9ASUAAJG) (SDK Attempt Count: 1)

/*
// CREATE Operation - Adding a new issue with first comment
async function createIssueWithComment(
    isPro: boolean) {
  const nowStr = new Date().toISOString();
  try {
    console.log(`DBM: calling IssueP1.create() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP1.create({
      issueId: 'ISSUE-001',
      commentId: `${isPro ? 'PRO' : 'CON'}#COMMENT#${nowStr}`, // This acts as a unique identifier for this comment
      commentText: 'This is the first pro comment for this issue',
      authorId: 'user-123',
      createdT: nowStr,
      updatedT: nowStr,
      // Add any other fields you need
    });
    
    console.log('IssueP1 with comment created:', result);
    return result;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}
*/

// UPDATE Operation - Adding a Comment to a given issue
async function addCommentToIssue(
    issueId: string,
    priority: number,
    claim: string,
    proUrl: string,
    conUrl: string,
    proDocType: string,
    conDocType: string,
    proAuthorEmail: string,
    conAuthorEmail: string,
    isAvailable: boolean,
    commentText: string,
    commentAuthorEmail: string,
  ) {
  try {
    // Since we're using a composite key (partition + sort), 
    // adding a new comment means creating a new item with the same issueId
    // but a different commentKey value
    const nowStr = new Date().toISOString();
    const commentKey = 'ISSUE#COMMENT#' + nowStr; // Composite sort key

    console.log(`DBM: calling IssueP2.create() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP2.create({
      issueId,
      priority,
      claim,
      proUrl,
      conUrl,
      proDocType,
      conDocType,
      proAuthorEmail,
      conAuthorEmail,
      isAvailable,
      commentKey,
      commentText,
      commentAuthorEmail,
      updatedT: nowStr,
      createdT: nowStr,
    });
    
    console.log('New comment added: ', result);
    return result;
  } catch (error) {
    console.error('Error adding comment: ', error);
    throw error;
  }
}

// Another UPDATE - If you want to modify an existing comment
async function updateExistingComment(issueId: string, commentKey: string, newText: string) {
  try {
    console.log(`DBM: calling IssueP2.ujpdate() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP2.update({
      issueId: issueId,
      commentKey: commentKey,
      updatedT: new Date().toISOString(),
      // Update specific fields
      commentText: newText,
    });
    
    console.log('Comment updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

async function getAllIssueRecords() {
  try {
    console.log(`DBM: calling IssueP2.list() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP2.list();
    const returnedIssues = result.data;
    const nonNullIssues = returnedIssues.filter((issue) => issue !== null);    
    return nonNullIssues;
  } catch (error) {
    console.error('Error in getAllIssueRecords():', error);
    throw error;
  }
}

// Example usage
export {
  createIssue,
  addCommentToIssue,
  updateExistingComment,
  getAllIssueRecords,
};
