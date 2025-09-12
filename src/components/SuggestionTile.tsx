import {SubmissionWithDateType as SubmissionType} from '../pages//AdminSubmissionsPage'
import './SuggestionTile.css';

interface MyProps {
  suggestion: SubmissionType;
  submissionSetter: (submission: SubmissionType) => void;
  editorSetter: (b: boolean) => void;
}

const SuggestionTile: React.FC<MyProps> = (props)  => {
  const { suggestion, submissionSetter, editorSetter } = props;

  const handleTileClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    submissionSetter(suggestion);
    editorSetter(true);
  }

  return (
    <div key={suggestion.id} className='suggestionTile' onClick={handleTileClick} >
      {suggestion.content}
    </div>
  );
}

export default SuggestionTile;
