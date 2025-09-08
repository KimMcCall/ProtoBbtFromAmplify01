import './SuggestionTile.css';

interface MyProps {
  key: string;
  suggestionId: string;
}

const handleButtonClick = (suggestionId: string) => {
  console.log(`Should now bring up editor for suggestion with ID ${suggestionId}`)
}

const SuggestionTile: React.FC<MyProps> = (props)  => {
  const { suggestionId } = props;
  return (
    <div className='tile' onClick={() => {handleButtonClick(suggestionId)}} >
      Partial content of suggestion with ID: {String(suggestionId)}
    </div>
  );
}

export default SuggestionTile;
