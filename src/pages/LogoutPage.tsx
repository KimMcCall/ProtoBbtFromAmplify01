import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

import '@aws-amplify/ui-react/styles.css'; // Import default styles

async function handleSignOut(setSignedOut: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) {
  try {
    await signOut();
    console.log('User signed out successfully.');
    setSignedOut(true);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

function LogoutPage() {
  const [signedOut, setSignedOut] = useState(false);
  const navigate = useNavigate();

  handleSignOut(setSignedOut);

  useEffect(() => {
    if (signedOut) {
      console.log("in LogoutPage, signedOut is true; navigating to /");
      navigate("/", { replace: true });
    } else {
      console.log("in LogoutPage, signedOut is false; staying here");
    }
  }, [navigate, signedOut]);
  
  return (
    <>
    </>
  );
}

export default LogoutPage;
