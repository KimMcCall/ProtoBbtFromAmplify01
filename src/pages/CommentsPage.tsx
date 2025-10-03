import { Button, Flex } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { CommentBlockType,
  IssueType,
  selectAllIssues,
  selectDisplayBlockForCurrentIssue,
  selectSomeRecordForCurrentIssue,
  setDisplayBlocks,
  setAllIssues } from "../features/issues/issues";
import './CommentsPage.css';
import { SyntheticEvent, useState } from "react";
import { checkForSubmissionPermission, sortAndRepairIssues, structurePerIssue, tallySubmission } from "../utils/utils";
import { selectCurrentUser, selectCurrentUserId } from "../features/userInfo/userInfoSlice";
import { addCommentToIssue } from "../utils/dynamodb_operations";
import CommentSubmissionForm from "../components/CommentSubmissionForm";
import { useNavigate } from "react-router-dom";

interface CommentTileProps {
  block: CommentBlockType;
}

function CommentTile(props: CommentTileProps) {
  const { block } = props;
  const { commentKey, time, commentAuthorEmail, text } = block;

  return (
    <div key={commentKey} className="commentPanelDiv">
      <div className="commentTileDiv">
        <span className="emailAndTimeSpan">
          From {commentAuthorEmail} at {time}
        </span>
        <div className="commentTextDiv">
          {text}
        </div>
      </div>
    </div>
  );
}

function CommentsPage() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [shouldShowForm, setShouldShowForm] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const queryStringStance = urlParams.get('stance'); // Should return "pro", "con", or null (which we hope to avoid)
  const explicitlyAskedForPro = queryStringStance === 'pro';
  const stance = explicitlyAskedForPro ? 'pro' : 'con';

  const showPro = stance === 'pro';

  const allIssues = useAppSelector(selectAllIssues);
  const aRecord = useAppSelector(selectSomeRecordForCurrentIssue);
  const authorEmail = useAppSelector(selectCurrentUser).canonicalEmail;
  const issueBlock = useAppSelector(selectDisplayBlockForCurrentIssue);
  // @ts-expect-error I'm pretty sure issueBlock is not undefined
  const commentBlocks = issueBlock.comments;

  const currentUserId = useAppSelector(selectCurrentUserId);

  const handleBackToViewButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const newUrl = `/issue?stance=${stance}`;
    console.log(`Calling navigate('${newUrl}')`)
    navigate(newUrl, {replace: true});
  }

  const handleCommentButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShouldShowForm(true);
  }

  const createCommentFromSubmission = async (text: string) => {
    const freeToProceed = await checkForSubmissionPermission(currentUserId);
    if (!freeToProceed.granted) {
      return;
    }
    createCommentWithText(text);
    tallySubmission(currentUserId);
  }
  
  const handleAutoCommentButtonClick = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const freeToProceed = await checkForSubmissionPermission(currentUserId);
    if (!freeToProceed.granted) {
      return;
    }
    const commentText = `This is an auto-generated comment that should show up in the dB.`;
    createCommentWithText(commentText);
    tallySubmission(currentUserId);
  }

  const createCommentWithText = async (text: string) => {
    const nowStr = new Date().toISOString();
    const commenntKey = `ISSUE#COMMENT#${nowStr}`;
    const commentText = text;
    // @ts-expect-error I'm pretty sure there are no fields here with 'undefined' content
    const clonedRecord: IssueType = { ...aRecord };
    clonedRecord.commentKey = commenntKey;
    clonedRecord.commentText = commentText;
    clonedRecord.createdT = nowStr;
    clonedRecord.updatedT = nowStr;
    clonedRecord.commentAuthorEmail = authorEmail;
    const augmentedIssues = allIssues.concat(clonedRecord);
    const sortedAndRepairedIssues = sortAndRepairIssues(augmentedIssues);
    const structured = structurePerIssue(sortedAndRepairedIssues);
    dispatch(setAllIssues(sortedAndRepairedIssues));
    dispatch(setDisplayBlocks(structured));

    const copiedIssueId = clonedRecord.issueId;
    const copiedPriority = clonedRecord.priority;
    const copiedClaim = clonedRecord.claim;
    const copiedProUrl = clonedRecord.proUrl;
    const copiedConUrl = clonedRecord.conUrl;
    const copiedProAuthorEmail = clonedRecord.proAuthorEmail;
    const copiedConAuthorEmail = clonedRecord.conAuthorEmail;
    const copiedProDocType = clonedRecord.proDocType;
    const copiedConDocType = clonedRecord.conDocType;
    const copiedIsAvailable = clonedRecord.isAvailable;
    const copiedAuthorEmail = clonedRecord.commentAuthorEmail;

    await addCommentToIssue(
      copiedIssueId,
      copiedPriority,
      copiedClaim,
      copiedProUrl,
      copiedConUrl,
      copiedProDocType,
      copiedConDocType,
      copiedProAuthorEmail,
      copiedConAuthorEmail,
      copiedIsAvailable,
      commentText,
      copiedAuthorEmail,
    );
  }

  const handleCancelSubmissionForm = () => {
    setShouldShowForm(false);
  }

  const handleSubmitSubmissionForm = (text: string) => {
    setShouldShowForm(false);
    if (text.length == 0) {
      return;
    }
    createCommentFromSubmission(text);
  }

  if (commentBlocks) {
    const nonEmptyBlocks = commentBlocks.filter(block => block.text);
    return (
      <PageWrapper>
        <div className="commentPageDiv">
          <div className="commentsAreaDiv">
          {
          nonEmptyBlocks.map(block => (
          <CommentTile key={block.commentKey} block={block} />
        ))}
          </div>
          <Flex>
            <Button onClick={handleBackToViewButtonClick}>
              Back to {showPro ? 'Our View': 'Dissenting View'}
            </Button>
            <Button onClick={handleCommentButtonClick}>
              Make your own Comment
            </Button>
            {
              false && 
              (
                <Button onClick={handleAutoCommentButtonClick}>
                  Test AutoComment
                </Button>
              )
            }
          </Flex>
        </div>
        {
          shouldShowForm &&
          (
            // UI to display if myConstant is true
            <CommentSubmissionForm cancelF={handleCancelSubmissionForm} submitF={handleSubmitSubmissionForm}/>
          )
        }

      </PageWrapper>
    );
  } else {
    return (
      <PageWrapper>
        <div>
          No comments found!
        </div>
        {
          shouldShowForm &&
          (
            // UI to display if myConstant is true
            <CommentSubmissionForm cancelF={handleCancelSubmissionForm} submitF={handleSubmitSubmissionForm}/>
          )
        }
      </PageWrapper>
    )
  }
}

export default CommentsPage;
