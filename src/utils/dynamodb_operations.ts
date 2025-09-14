/*
import { dbClient } from '../main';

// CREATE Operation - Adding a new issue with first comment
async function createIssueWithComment() {
  try {
    const result = await dbClient.models.IssueP1.create({
      issueId: 'ISSUE-001',
      proComment: 'PRO-COMMENT-001', // This acts as a unique identifier for this comment
      commentText: 'This is the first pro comment for this issue',
      authorId: 'user-123',
      createdAt: new Date().toISOString(),
      // Add any other fields you need
    });
    
    console.log('IssueP1 with comment created:', result);
    return result;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}

// UPDATE Operation - Adding another proComment to the same issue
async function addProCommentToIssue(issueId: string) {
  try {
    // Since we're using a composite key (partition + sort), 
    // adding a new comment means creating a new item with the same issueId
    // but a different proComment value
    const result = await dbClient.models.IssueP1.create({
      issueId: issueId, // Same issue ID
      proComment: `PRO-COMMENT-${Date.now()}`, // New unique sort key
      commentText: 'This is another pro comment for the same issue',
      authorId: 'user-456',
      createdAt: new Date().toISOString(),
    });
    
    console.log('New pro comment added:', result);
    return result;
  } catch (error) {
    console.error('Error adding pro comment:', error);
    throw error;
  }
}

// Another UPDATE - If you want to modify an existing comment
async function updateExistingComment(issueId: string, proCommentId: string) {
  try {
    const result = await dbClient.models.IssueP1.update({
      issueId: issueId,
      proComment: proCommentId,
      // Update specific fields
      commentText: 'Updated comment text',
      updatedAt: new Date().toISOString(),
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
  createIssueWithComment,
  addProCommentToIssue,
  updateExistingComment,
  getProCommentsForIssue
};
*/
