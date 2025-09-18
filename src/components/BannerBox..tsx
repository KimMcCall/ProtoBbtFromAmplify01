import { useNavigate } from 'react-router-dom';
import { Flex, Menu, MenuItem, Avatar } from '@aws-amplify/ui-react';
import { selectCurrentUserIsLoggedIn } from '../features/userInfo/userInfoSlice';
import { useAppSelector } from '../app/hooks';

const box: React.CSSProperties = {
  height: '46px',
  width: '1206px',
  border: '2px solid blue',
  padding: '4px',
  backgroundColor: '#d0e0ff',
  paddingRight: '20px',
};

const logoSpan: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '150%',
};

const loginDiv: React.CSSProperties = {
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '120%',
};

function BannerBox() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/", { replace: true });
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const logOff = () => {
    navigate("/logout", { replace: true });
  };

  const goToLogInPage = () => {
    navigate("/login");
  };
  
  const isLoggeddIn = useAppSelector(selectCurrentUserIsLoggedIn);

  return (
    <div id="banner-box" style={box}>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        gap="1rem"
      >
        <span onClick={goHome} style={logoSpan}>TruthSquad.com</span>
        
        {!isLoggeddIn ?
          <div onClick={() => goToLogInPage()} style={loginDiv}>Log In</div>
        :
          <Menu menuAlign="center"
            trigger={
              <Avatar variation="filled" />
            }
          >
            <MenuItem onClick={() => {goToProfile()}}>Profile</MenuItem>
            <MenuItem onClick={() => {logOff()}}>Log Off</MenuItem>
          </Menu>
          }
      </Flex>
    </div>
  );
}

export default BannerBox;
