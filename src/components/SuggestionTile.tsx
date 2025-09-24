import {SubmissionWithDateType as SubmissionType} from '../pages//AdminSubmissionsPage'
import './SuggestionTile.css';

interface MyProps {
  key: string
  submission: SubmissionType
  submissionSetter: (submission: SubmissionType) => void
  editorSetter: (b: boolean) => void
}

const SuggestionTile: React.FC<MyProps> = (props)  => {
  const { key, submission, submissionSetter, editorSetter } = props;

  const handleTileClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    submissionSetter(submission);
    editorSetter(true);
  }

  return (
    <div key={key} className='suggestionTile' onClick={handleTileClick} >
      {submission.content}
    </div>
  );
}

export default SuggestionTile;
