import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import { Flex, Menu, MenuItem, Avatar } from '@aws-amplify/ui-react';
import { toCanonicalEmail } from '../utils/utils';

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
  const defaultUserInfo = {
    isPhoney: true,
    isAdmin: true,
    isOwner: true,
    canonicalEmail: "canonicalEmail@gmail.com",
    userId: "dsoowr989rhsfaflweru"
  };
  const [user, setUser] = useState(defaultUserInfo);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
      const fetchCurrentUser = async () => {
          try {
            console.log("BB: calling getCurrentUser()");
            const currentUser = await getCurrentUser();
            const email = currentUser.signInDetails?.loginId;
            console.log("BB: got currentUser; email=", email);
            const canonical = toCanonicalEmail(email);
            const userInfo = {
              isPhoney: false,
              isAdmin: true,
              isOwner: true,
              canonicalEmail: canonical,
              userId: currentUser.userId,
            }
            setUser(userInfo);
          } catch (error) {
              console.error('BB: Error fetching current user:', error);
              const userInfo = {
                isPhoney: true,
                isAdmin: true,
                isOwner: true,
                canonicalEmail: "bogusEmail@example.com",
                userId: "dsoowr989rhsfaflweru_BOGUS",
              }
              setUser(userInfo);
          } finally {
              setLoading(false);
          }
      };

      fetchCurrentUser();
  }, [user.isPhoney]);

  const goHome = () => {
    navigate("/", { replace: true });
  };

  const editProfile = () => {
    navigate("/profile");
  };

  const logOff = () => {
    navigate("/logout", { replace: true });
  };

  const goToLogInPage = () => {
    navigate("/login");
  };
  
  const {isPhoney, isAdmin, isOwner, canonicalEmail, userId} = user;
  console.log("BB: userId=", userId, " canonicalEmail=", canonicalEmail, " isPhoney=", isPhoney, " isAdmin=", isAdmin, " isOwner=", isOwner);

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
            <MenuItem onClick={() => {editProfile()}}>Edit Profile</MenuItem>
            <MenuItem onClick={() => {logOff()}}>Log Off</MenuItem>
          </Menu>
          }
      </Flex>
    </div>
  );
}

export default BannerBox;
