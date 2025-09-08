import './SuggestionTile.css';

/*
const bar: React.CSSProperties = {
  height: '730px',
  width: '140px',
  border: '1px solid blue',
  padding: '6px',
  margin: '1px',
  backgroundColor: '#d0e0ff',
};

const buttonDiv: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '150%',
};
*/
const handleButtonClick = (suggestionId: string) => {
  console.log(`Should now bring up editor for suggestion with ID ${suggestionId}`)
}

function SuggestionTile({ suggestionId }) {
  return (
    <div className='tile' onClick={() => {handleButtonClick(suggestionId)}} >
      Partial content of suggestion with ID: {String(suggestionId)}
    </div>
  );
}

export default SuggestionTile;
