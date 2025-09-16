import { Button } from "@aws-amplify/ui-react";
import { useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { CommentBlockType, selectDisplayBlockForCurrentIssue, selectProOrCon } from "../features/issues/issues";
import './CommentsPage.css';
import { SyntheticEvent } from "react";

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
  const issueBlock = useAppSelector(selectDisplayBlockForCurrentIssue);
  const proOrCon = useAppSelector(selectProOrCon);
  const commentBlocks = proOrCon === 'pro' ? issueBlock?.proComments : issueBlock?.conComments;
  if (commentBlocks) {
    return (
      <PageWrapper>
        <div className="commentPageDiv">
          <div className="commentsAreaDiv">
          {
          commentBlocks.map(block => (
          <CommentTile block={block} />
        ))}
          </div>
          <Button onClick={handleCommentButtonClick}>
            Make your own Comment
          </Button>
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
