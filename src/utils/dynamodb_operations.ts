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
    isPro: boolean,
    copiedIssueId: string,
    copiedClaim: string,
    copiedPriority: number,
    copiedProUrl: string,
    copiedConUrl: string,
    copiedProAuthorId: string,
    copiedConAuthorId: string,
    copiedProIsPdf: boolean,
    copiedConIsPdf: boolean,
    copiedMakeAvailable: boolean,
    commentText: string,
    authorId: string,
  ) {
  try {
    // Since we're using a composite key (partition + sort), 
    // adding a new comment means creating a new item with the same issueId
    // but a different proComment value
    const nowStr = new Date().toISOString();
    const commentId = `${isPro ? 'PRO' : 'CON'}#COMMENT#${nowStr}`;

    const result = await dbClient.models.IssueP1.create({
      issueId: copiedIssueId, // Same issue ID
      priority: copiedPriority,
      claim: copiedClaim,
      proUrl: copiedProUrl,
      conUrl: copiedConUrl,
      proIsPdf: copiedProIsPdf,
      conIsPdf: copiedConIsPdf,
      proAuthorId: copiedProAuthorId,
      conAuthorId: copiedConAuthorId,
      makeAvailable: copiedMakeAvailable,
      commentId: commentId, // This acts as a unique identifier for this comment
      commentText: commentText,
      commentType: isPro ? 'PRO' : 'CON',
      authorId: authorId,
      commentKey: 'ISSUE#' + commentId, // Composite sort key: "ISSUE#PRO#{commentId}" or "ISSUE#CON#{commentId}"
      updatedT: nowStr,
      createdT: nowStr,
    });
    
    console.log(`New ${isPro ? 'PRO' : 'CON'} comment added:`, result);
    return result;
  } catch (error) {
    console.error(`Error adding ${isPro ? 'PRO' : 'CON'} comment:`, error);
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
    const result = await dbClient.models.IssueP1.list();
    const returnedIssues = result.data;
    const nonNullIssues = returnedIssues.filter((issue) => issue !== null);    
    const issuesWithPossibleNullPriority = nonNullIssues;
    const healthyIssues = issuesWithPossibleNullPriority.map((issue)=> {
      if (issue.priority == null) {
        issue.priority = 0;
      }
      return issue;
    });
    console.log(`# healthyIssues: ${healthyIssues.length}`)
    return healthyIssues;
  } catch (error) {
    console.error('Error in getAllIssueRecords():', error);
    throw error;
  }
}

// QUERY Operation - Get all records for a specific issue
async function getAllRecordsForIssue(issueId: string) {
  try {
    const result = await dbClient.models.IssueP1.list({
      filter: {
        issueId: { eq: issueId }
      }
    });
    
    const issuesWithPossibleNullPriority = result.data;
    const healthyIssues = issuesWithPossibleNullPriority.map((issue)=> {
      if (issue.priority == null) {
        issue.priority = 0;
      }
      return issue;
    });

    return healthyIssues;
  } catch (error) {
    console.error('Error querying comments:', error);
    throw error;
  }
}

// Example usage
export {
  createIssue,
  addCommentToIssue,
  updateExistingComment,
  getAllIssueRecords,
  getAllRecordsForIssue,
};
