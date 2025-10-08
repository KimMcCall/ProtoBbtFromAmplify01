import { dbClient } from '../main';


/* This function, which uses IssueP1, is not called anywhere
   so we're commenting it out

// Query all comments for an issue (both PRO and CON)
async function getIssue(issueId: string) {
  try {
    console.log(`DBM: calling IssueP1.list() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP1.list({
      filter: {
        issueId: { eq: issueId }
      }
    });

    const issues = result.data;
    const nIssues = issues.length;
    if (nIssues < 1) {
      console.log(`No Issues found with issueId="${issueId}"`);
      return;
    } else if (nIssues === 1) {
      console.log(`One Issue found with issueId="${issueId}"`);
      const issue = issues[0];
      console.log('issue: ', issue);
    } else {
      // GATOR: probably will get multiple returns;
      //   Should probably just accept the first
      console.log(`Multiple Issues found with issueId="${issueId}"`);
      return;
    }
  } catch (error) {
    console.error('Error querying for Issues:', error);
    throw error;
  }
}
*/

/* This function, which uses IssueP1, is not called anywhere
   so we're commenting it out

// Query all comments for an issue (both PRO and CON)
async function getAllComments(issueId: string) {
  try {
    console.log(`DBM: calling IssueP1.list() at ${Date.now() % 10000}`);
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
*/

// Update a specific comment
async function updateComment(issueId: string, commentKey: string, newText: string) {
  try {
    console.log(`DBM: calling IssueP2.update() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP2.update({
      issueId: issueId,
      commentKey: commentKey,
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

// Delete a specific comment
async function deleteComment(issueId: string, commentKey: string) {
  try {
    console.log(`DBM: calling IssueP2.delete() at ${Date.now() % 10000}`);
    const result = await dbClient.models.IssueP2.delete({
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
  // getIssue,
  // getAllComments,
  updateComment,
  deleteComment
};
