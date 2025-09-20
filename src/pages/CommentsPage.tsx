import { Button, Flex } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { CommentBlockType, IssueType, selectAllIssues, selectDisplayBlockForCurrentIssue, selectSomeRecordForCurrentIssue, setDisplayBlocks, setIssues } from "../features/issues/issues";
import './CommentsPage.css';
import { SyntheticEvent, useState } from "react";
import { sortAndRepairIssues, structurePerIssue } from "../utils/utils";
import { selectCurrentUser } from "../features/userInfo/userInfoSlice";
import { addCommentToIssue } from "../utils/dynamodb_operations";
import CommentSubmissionForm from "../components/CommentSubmissionForm";
import { useNavigate } from "react-router-dom";

interface CommentTileProps {
  block: CommentBlockType;
}

function CommentTile(props: CommentTileProps) {
  const { block } = props;
  const { commentKey, time, authorEmail, text } = block;

  return (
    <div key={commentKey} className="commentPanelDiv">
      <div className="commentTileDiv">
        <span className="emailAndTimeSpan">
          From {authorEmail} at {time}
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
  console.log(`With queryStringStance='${queryStringStance}' we have stance: '${stance}'`);

  const showPro = stance === 'pro';

  const allIssues = useAppSelector(selectAllIssues);
  const aRecord = useAppSelector(selectSomeRecordForCurrentIssue);
  const authorEmail = useAppSelector(selectCurrentUser).canonicalEmail;
  const issueBlock = useAppSelector(selectDisplayBlockForCurrentIssue);
  const commentBlocks = showPro ? issueBlock?.proComments : issueBlock?.conComments; 

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
    createCommentWithText(text);
  }
  
  const handleAutoCommentButtonClick = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const commentText = `This is an auto-generated ${showPro ? 'PRO' : 'CON'} comment that should show up in the dB.`;
    createCommentWithText(commentText);
  }

  const createCommentWithText = async (text: string) => {
    const isPro = showPro;
    const nowStr = new Date().toISOString();
    const commentId = `${isPro ? 'PRO' : 'CON'}#COMMENT#${nowStr}`;
    const commenntKey = `ISSUE#${commentId}`;
    const commentType = isPro ? 'PRO' : 'CON';
    const commentText = text;
    // @ts-expect-error I'm pretty sure there are no fields here with 'undefined' content
    const clonedRecord: IssueType = { ...aRecord };
    clonedRecord.commentType = commentType;
    clonedRecord.commentId = commentId;
    clonedRecord.commentKey = commenntKey;
    clonedRecord.commentText = commentText;
    clonedRecord.createdT = nowStr;
    clonedRecord.updatedT = nowStr;
    clonedRecord.authorId = authorEmail;
    const augmentedIssues = allIssues.concat(clonedRecord);
    // const augmentedIssues = allIssues;
    const sortedAndRepairedIssus = sortAndRepairIssues(augmentedIssues);
    const structured = structurePerIssue(sortedAndRepairedIssus);
    dispatch(setIssues(sortedAndRepairedIssus));
    dispatch(setDisplayBlocks(structured));

    const copiedIssueId = clonedRecord.issueId;
    const copiedClaim = clonedRecord.claim;
    const copiedPriority = clonedRecord.priority;
    const copiedProUrl = clonedRecord.proUrl;
    const copiedConUrl = clonedRecord.conUrl;
    const copiedProAuthorId = clonedRecord.proAuthorId;
    const copiedConAuthorId = clonedRecord.conAuthorId;
    const copiedProIsPdf = clonedRecord.proIsPdf;
    const copiedConIsPdf = clonedRecord.conIsPdf;
    const copiedMakeAvailable = clonedRecord.makeAvailable;
    const authorId = clonedRecord.authorId;

    await addCommentToIssue(
      isPro,
      copiedIssueId,
      copiedClaim,
      copiedPriority,
      copiedProUrl,
      copiedConUrl,
      copiedProAuthorId,
      copiedConAuthorId,
      copiedProIsPdf,
      copiedConIsPdf,
      copiedMakeAvailable,
      commentText,
      authorId,
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
    return (
      <PageWrapper>
        <div className="commentPageDiv">
          <div className="commentsAreaDiv">
          {
          commentBlocks.map(block => (
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
