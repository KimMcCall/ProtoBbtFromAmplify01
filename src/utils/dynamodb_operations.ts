import { dbClient } from '../main';

// CREATE Operation - Adding a new issue with first comment
async function createIssue(
    priority: number,
    claim: string,
    proUrl: string,
    conUrl: string,
    proIsPdf: boolean,
    conIsPdf: boolean,
    proAuthorId: string,
    conAuthorId: string,
    makeAvailable: boolean,
  ) {
  const nowStr = new Date().toISOString();
  try {
    const result = await dbClient.models.IssueP1.create({
      issueId: 'ISSUE#' + nowStr,
      priority: priority,
      claim: claim,
      proUrl: proUrl,
      conUrl: conUrl,
      proIsPdf: proIsPdf,
      conIsPdf: conIsPdf,
      proAuthorId: proAuthorId,
      conAuthorId: conAuthorId,
      makeAvailable: makeAvailable,
      // commentId: `${isPro ? 'PRO' : 'CON'}#COMMENT#${nowStr}`, // This acts as a unique identifier for this comment
      commentId: '',
      commentKey: 'PRO#',
      commentType: 'PRO',
      authorId: '',
      commentText: '',
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
    const result = await dbClient.models.IssueP1.update({
      issueId: issueId,
      commentKey: commentKey,
      // Update specific fields
      commentText: newText,
      updatedT: new Date().toISOString(),
    });
    
    console.log('Comment updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

// QUERY Operation - Get all Issue records
async function getAllIssueRecords() {
  try {
    const result = await dbClient.models.IssueP2.list();
    const returnedIssues = result.data;
    const nonNullIssues = returnedIssues.filter((issue) => issue !== null);    
    console.log(`# nonNullIssues: ${nonNullIssues.length}`)
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
