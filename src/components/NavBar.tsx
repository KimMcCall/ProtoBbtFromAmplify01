import { useNavigate } from 'react-router-dom';
import { Flex } from '@aws-amplify/ui-react';

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

function NavBar() {
  const navigate = useNavigate();

  const handleButtonClick = (newDir: string) => {
    navigate(newDir); // Navigate to the new route
  };

  return (
    <div id="banner-box" style={bar}>
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="left"
        wrap="nowrap"
        gap="1rem"
      >
        <div onClick={() => {handleButtonClick("/")}} style={buttonDiv}>Home</div>
        <div onClick={() => {handleButtonClick("/mission")}} style={buttonDiv}>Mission</div>
        <div onClick={() => {handleButtonClick("/suggestion")}} style={buttonDiv}>Suggest</div>
        <div onClick={() => {handleButtonClick("/finances")}} style={buttonDiv}>Finances</div>
        <div onClick={() => {handleButtonClick("/donate")}} style={buttonDiv}>Donate</div>
        <div onClick={() => {handleButtonClick("/play01")}} style={buttonDiv}>Play 1</div>
        <div onClick={() => {handleButtonClick("/play02")}} style={buttonDiv}>Play2</div>
      </Flex>
    </div>
  );
}

export default NavBar;
