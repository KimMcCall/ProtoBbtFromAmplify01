import { Button, Flex } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { CommentBlockType, IssueType, selectAllIssues, selectDisplayBlockForCurrentIssue, selectProOrCon, selectSomeRecordForCurrentIssue, setDisplayBlocks, setIssues } from "../features/issues/issues";
import './CommentsPage.css';
import { SyntheticEvent } from "react";
import { sortAndRepairIssues, structurePerIssue } from "../utils/utils";
import { selectFullUser } from "../features/userInfo/userInfoSlice";

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

const handleCommentButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
  event.stopPropagation();
  console.log('should show a comment input form');
  // GATOR: show a comment input form
}

function CommentsPage() {
  const dispatch = useAppDispatch();

  const allIssues = useAppSelector(selectAllIssues);
  const aRecord = useAppSelector(selectSomeRecordForCurrentIssue);
  const authorEmail = useAppSelector(selectFullUser).canonicalEmail;
  const issueBlock = useAppSelector(selectDisplayBlockForCurrentIssue);
  const proOrCon = useAppSelector(selectProOrCon);
  const commentBlocks = proOrCon === 'pro' ? issueBlock?.proComments : issueBlock?.conComments;
  
  const handleAutoCommentButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const isPro = proOrCon === 'pro';
    const nowStr = new Date().toISOString();
    const commentId = `${isPro ? 'PRO' : 'CON'}#COMMENT#${nowStr}`;
    const commenntKey = `ISSUE#${commentId}`;
    const commentType = isPro ? 'PRO' : 'CON';
    const commentText = `This is an auto-generated ${commentType} comment`;
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
            <Button onClick={handleCommentButtonClick}>
              Make your own Comment
            </Button>
            <Button onClick={handleAutoCommentButtonClick}>
              Test AutoComment
            </Button>
          </Flex>
        </div>
      </PageWrapper>
    );
  } else {
    return (
      <PageWrapper>
        <div>
          No comments found!
        </div>
      </PageWrapper>
    )
  }
}

export default CommentsPage;
