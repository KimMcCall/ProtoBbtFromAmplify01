import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

import '@aws-amplify/ui-react/styles.css'; // Import default styles
import PageWrapper from "../components/PageWrapper";
import { selecNext } from "../features/navigation/navigationSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearCurrentUserInfo } from "../features/userInfo/userInfoSlice";

let logoutSucceded = false;

async function handleSignOut(setSignedOut: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) {
  try {
    await signOut();
    console.log('User signed out successfully.');
    setSignedOut(true);
    logoutSucceded = true
    
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

function LogoutPage() {
  const [signedOut, setSignedOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  handleSignOut(setSignedOut);
  if (logoutSucceded) {
    dispatch(clearCurrentUserInfo());
  }
  const newPath = useAppSelector(selecNext);

  useEffect(() => {
    if (signedOut) {
      console.log(`in LogoutPage, signedOut is true; navigating to ${newPath}`);
      navigate(newPath, { replace: true });
    } else {
      console.log("in LogoutPage, signedOut is false; staying here");
    }
  }, [navigate, newPath, signedOut]);
  
  return (
    <PageWrapper>
      <div>
        <p>You're being logged out........</p>
      </div>
    </PageWrapper>
  );
}

export default LogoutPage;
