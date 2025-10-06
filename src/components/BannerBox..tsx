import { useNavigate } from 'react-router-dom';
import { Flex, Menu, MenuItem, Avatar } from '@aws-amplify/ui-react';
import { selectCurrentUserIsLoggedIn } from '../features/userInfo/userInfoSlice';
import { useAppSelector } from '../app/hooks';

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
    <div className='bbBox' id="banner-box">
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
        wrap="nowrap"
        gap="1rem"
      >
        <span className='bbLogoSpan' onClick={goHome}>TruthSquad.com</span>
        
        {!isLoggeddIn ?
          <div className='bbLoginDiv' onClick={() => goToLogInPage()}>Log In</div>
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
