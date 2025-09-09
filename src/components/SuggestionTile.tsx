import './SuggestionTile.css';

interface MyProps {
  key: string;
  suggestionId: string;
  category: string;
  content: string;
}

const handleButtonClick = (suggestionId: string) => {
  console.log(`Should now bring up editor for suggestion with ID ${suggestionId}`)
}

const SuggestionTile: React.FC<MyProps> = (props)  => {
  const { suggestionId, /*category, */ content } = props;
  return (
    <div key={suggestionId} className='tile' onClick={() => {handleButtonClick(suggestionId)}} >
      {content}
    </div>
  );
}

export default SuggestionTile;
