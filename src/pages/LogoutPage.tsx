import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

import '@aws-amplify/ui-react/styles.css'; // Import default styles

async function handleSignOut() {
  try {
    await signOut();
    console.log('User signed out successfully.');
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

function LogoutPage() {
  const navigate = useNavigate();

  handleSignOut();

  useEffect(() => {
    navigate("/", { replace: true });
  }, []);
  
  return (
    <>
    </>
  );
}

export default LogoutPage;
