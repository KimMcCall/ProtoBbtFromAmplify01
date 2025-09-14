/*
import { dbClient } from '../main';

// Create a PRO comment
async function createProComment(issueId: string, commentText: string, authorId: string) {
  try {
    const commentId = `PRO-${Date.now()}`;
    const result = await dbClient.models.IssueP1.create({
      issueId: issueId,
      commentKey: `PRO#${commentId}`, // Composite sort key
      commentType: 'PRO',
      commentId: commentId,
      commentText: commentText,
      authorId: authorId,
      createdT: new Date().toISOString(),
    });
    
    console.log('Pro comment created:', result);
    return result;
  } catch (error) {
    console.error('Error creating pro comment:', error);
    throw error;
  }
}

// Create a CON comment
async function createConComment(issueId: string, commentText: string, authorId: string) {
  try {
    const commentId = `CON-${Date.now()}`;
    const result = await dbClient.models.IssueP1.create({
      issueId: issueId,
      commentKey: `CON#${commentId}`, // Composite sort key
      commentType: 'CON',
      commentId: commentId,
      commentText: commentText,
      authorId: authorId,
      createdT: new Date().toISOString(),
    });
    
    console.log('Con comment created:', result);
    return result;
  } catch (error) {
    console.error('Error creating con comment:', error);
    throw error;
  }
}

// Query all PRO comments for an issue
async function getProComments(issueId: string) {
  try {
    const result = await dbClient.models.IssueP1.list({
      filter: {
        and: [
          { issueId: { eq: issueId } },
          { commentKey: { beginsWith: 'PRO#' } }
        ]
      }
    });
    
    console.log('Pro comments:', result);
    return result;
  } catch (error) {
    console.error('Error querying pro comments:', error);
    throw error;
  }
}

// Query all CON comments for an issue
async function getConComments(issueId: string) {
  try {
    const result = await dbClient.models.IssueP1.list({
      filter: {
        and: [
          { issueId: { eq: issueId } },
          { commentKey: { beginsWith: 'CON#' } }
        ]
      }
    });
    
    console.log('Con comments:', result);
    return result;
  } catch (error) {
    console.error('Error querying con comments:', error);
    throw error;
  }
}

// Query all comments for an issue (both PRO and CON)
async function getAllComments(issueId: string) {
  try {
    const result = await dbClient.models.IssueP1.list({
      filter: {
        issueId: { eq: issueId }
      }
    });
    
    // Sort by comment type and creation date
    const sortedComments = result.data?.sort((a, b) => {
      if (a.commentType !== b.commentType) {
        return a.commentType === 'PRO' ? -1 : 1; // PRO comments first
      }
      return new Date(a.createdT).getTime() - new Date(b.createdT).getTime();
    });
    
    console.log('All comments:', sortedComments);
    return { ...result, data: sortedComments };
  } catch (error) {
    console.error('Error querying all comments:', error);
    throw error;
  }
}

// Update a specific comment
async function updateComment(issueId: string, commentKey: string, newText: string) {
  try {
    const result = await dbClient.models.IssueP1.update({
      issueId: issueId,
      commentKey: commentKey,
      commentText: newText,
      updatedAt: new Date().toISOString(),
    });
    
    console.log('Comment updated:', result);
    return result;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
}

// Delete a specific comment
async function deleteComment(issueId: string, commentKey: string) {
  try {
    const result = await dbClient.models.IssueP1.delete({
      issueId: issueId,
      commentKey: commentKey,
    });
    
    console.log('Comment deleted:', result);
    return result;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export {
  createProComment,
  createConComment,
  getProComments,
  getConComments,
  getAllComments,
  updateComment,
  deleteComment
};
*/
