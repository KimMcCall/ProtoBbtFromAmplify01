import {SubmissionWithDateType as SubmissionType} from '../pages//AdminSubmissionsPage'
import './SuggestionTile.css';

interface MyProps {
  suggestion: SubmissionType;
}

const SuggestionTile: React.FC<MyProps> = (props)  => {
  const { suggestion } = props;

  const handleButtonClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    const suggestionId = suggestion.id;
    console.log(`Should now bring up editor for suggestion with ID ${suggestionId}`)
  }

  return (
    <div key={suggestion.id} className='suggestionTile' onClick={handleButtonClick} >
      {suggestion.content}
    </div>
  );
}

export default SuggestionTile;
