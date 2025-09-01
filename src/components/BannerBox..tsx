import { useNavigate } from 'react-router-dom';
import { Flex, Menu, MenuItem, Avatar } from '@aws-amplify/ui-react';
import { haveLoggedInUser } from '../utils/utils';

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

  const editProfile = () => {
    navigate("/profile");
  };

  const logOff = () => {
    navigate("/logout", { replace: true });
  };

  const haveUser = haveLoggedInUser();

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
        {haveUser ?
          <Menu menuAlign="center"
            trigger={
              <Avatar size="large" variation="filled" />
            }
          >
            <MenuItem onClick={() => {editProfile()}}>Edit Profile</MenuItem>
            <MenuItem onClick={() => {logOff()}}>Log Off</MenuItem>
          </Menu>
        :
          <div onClick={goHome} style={loginDiv}>Log In</div>}
      </Flex>
    </div>
  );
}

export default BannerBox;
