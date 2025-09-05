import { useNavigate } from 'react-router-dom';
import { Flex } from '@aws-amplify/ui-react';
import { useAppSelector } from "../app/hooks";
import { selectIsSuperAdmin } from "../features/userInfo/userInfoSlice";
import './NavBar.css';

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
  const isSuperAdmin =  useAppSelector(selectIsSuperAdmin);

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
        <div className='navBarItem' onClick={() => {handleButtonClick("/")}} style={buttonDiv}>Home</div>
        <div className='navBarItem' onClick={() => {handleButtonClick("/mission")}} style={buttonDiv}>Mission</div>
        <div className='navBarItem' onClick={() => {handleButtonClick("/suggest")}} style={buttonDiv}>Suggest</div>
        <div className='navBarItem' onClick={() => {handleButtonClick("/finances")}} style={buttonDiv}>Finances</div>
        <div className='navBarItem' onClick={() => {handleButtonClick("/donate")}} style={buttonDiv}>Donate</div>
        {isSuperAdmin && <div className='navBarItem' onClick={() => {handleButtonClick("/play01")}} style={buttonDiv}>Play 1</div>}
        {isSuperAdmin && <div className='navBarItem' onClick={() => {handleButtonClick("/play02")}} style={buttonDiv}>Play2</div>}
        {isSuperAdmin && <div className='navBarItem' onClick={() => {handleButtonClick("/todos")}} style={buttonDiv}>ToDos</div>}
      </Flex>
    </div>
  );
}

export default NavBar;
