import { dbClient } from '../main';

// CREATE Operation - Adding a new issue with first comment
async function createIssue(
    proUrl: string,
    conUrl: string,
  ) {
  const nowStr = new Date().toISOString();
  try {
    const result = await dbClient.models.IssueP1.create({
      issueId: 'ISSUE#' + nowStr,
      proUrl: proUrl,
      conUrl: conUrl,
      // commentId: `${isPro ? 'PRO' : 'CON'}#COMMENT#${nowStr}`, // This acts as a unique identifier for this comment
      commentId: '',
      commentKey: '',
      commentType: 'PRO',
      authorId: '',
      commentText: '',
      createdT: nowStr,
      updatedT: nowStr,
    });
    console.log('IssueP1 with comment created:', result);
    return result;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}

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

// UPDATE Operation - Adding another proComment to the same issue
async function addCommentToIssue(
    isPro: boolean,
    coppiedIssueId: string,
    copiedProUrl: string,
    copiedConUrl: string,
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
      issueId: coppiedIssueId, // Same issue ID
      proUrl: copiedProUrl,
      conUrl: copiedConUrl,
      commentId: commentId, // This acts as a unique identifier for this comment
      commentText: commentText,
      commentType: isPro ? 'PRO' : 'CON',
      authorId: authorId,
      commentKey: `${isPro ? 'PRO' : 'CON'}#` + commentId, // Composite sort key: "PRO#{commentId}" or "CON#{commentId}"
      updatedT: nowStr,
      createdT: nowStr,
    });
    
    console.log('New pro comment added:', result);
    return result;
  } catch (error) {
    console.error('Error adding pro comment:', error);
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

// QUERY Operation - Get all pro comments for a specific issue
async function getProCommentsForIssue(issueId: string) {
  try {
    const result = await dbClient.models.IssueP1.list({
      filter: {
        issueId: { eq: issueId }
      }
    });
    
    console.log('Pro comments for issue:', result);
    return result;
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
  getProCommentsForIssue
};
