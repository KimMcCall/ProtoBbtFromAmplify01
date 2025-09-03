import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Menu, MenuItem, Avatar } from '@aws-amplify/ui-react';
import { cacheUserInfo } from '../utils/utils';
import { UserContext } from '../App';

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
  const [loading, setLoading] = useState(true);

  const { userCache, setUserCache } = useContext(UserContext);
  const { isPhoney } = userCache;
  console.log("In BannerBox, isPhoney=", isPhoney);


  const navigate = useNavigate();

  useEffect(() => {
      const fetchCurrentUser = async () => {
          try {
            cacheUserInfo(setUserCache)
          } catch (error) {
            console.error('BB: Error fetching current user:', error);
            const { canonicalEmail } = userCache;
            console.log("BB: userContext.canonicalEmail=", canonicalEmail);
          } finally {
              setLoading(false);
          }
      };

      fetchCurrentUser();
  }, [userCache.email]);

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

  // this is just to use the constant 'loading' so that the linter doesn't complain
  if (loading) {
    console.log("BB: Still loading...");
  }

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
        {/*
          loading ?
          <div>Loading...</div>
          :
          null
        */}
        
        {isPhoney ?
          <div onClick={() => goToLogInPage()} style={loginDiv}>Log In</div>
        :
          <Menu menuAlign="center"
            trigger={
              <Avatar size="large" variation="filled" />
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
