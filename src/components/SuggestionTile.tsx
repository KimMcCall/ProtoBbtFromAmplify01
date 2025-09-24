import {SubmissionWithDateType as SubmissionType} from '../pages//AdminSubmissionsPage'
import './SuggestionTile.css';

interface MyProps {
  niceKey: string
  submission: SubmissionType
  submissionSetter: (submission: SubmissionType) => void
  editorSetter: (b: boolean) => void
}

const SuggestionTile: React.FC<MyProps> = (props)  => {
  const { niceKey, submission, submissionSetter, editorSetter } = props;

  const handleTileClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    submissionSetter(submission);
    editorSetter(true);
  }

  return (
    <div key={niceKey} className='suggestionTile' onClick={handleTileClick} >
      {submission.content}
    </div>
  );
}

export default SuggestionTile;
