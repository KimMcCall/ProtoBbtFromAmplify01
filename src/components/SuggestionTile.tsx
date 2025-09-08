import './SuggestionTile.css';

interface MyProps {
  key: string;
  suggestionId?: string;
}

const handleButtonClick = (suggestionId: string) => {
  console.log(`Should now bring up editor for suggestion with ID ${suggestionId}`)
}

const SuggestionTile: React.FC<MyProps> = (props)  => {
  const { suggestionId } = props;
  const  definedSuggestionId = suggestionId || '';
  return (
    <div className='tile' onClick={() => {handleButtonClick(definedSuggestionId)}} >
      Partial content of suggestion with ID: {String(suggestionId)}
    </div>
  );
}

export default SuggestionTile;
