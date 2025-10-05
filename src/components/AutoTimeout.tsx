// AutoTimeout.jsx

import { ReactNode, useEffect, useRef } from 'react';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearCurrentUserInfo, selectCurrentUserIsAdmin, selectCurrentUserIsSuperAdmin } from '../features/userInfo/userInfoSlice';

const IDLE_TIMEOUT_MINUTES = 30;
const TIMEOUT_WARNING_SECONDS = 60;
// const IDLE_TIMEOUT_MINUTES = 1;
// const TIMEOUT_WARNING_SECONDS = 20;

interface AutoTimeoutProps {
  children: ReactNode;
}

const AutoTimeout = ({ children }: AutoTimeoutProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const timeoutId = useRef<NodeJS.Timeout | number>(0);
  const warningTimeoutId = useRef<NodeJS.Timeout | number>(0);

  const isAdmin = useAppSelector(selectCurrentUserIsAdmin);
  const isSuperAdmin = useAppSelector(selectCurrentUserIsSuperAdmin);

  const resetTimer = () => {
    if (isSuperAdmin || isAdmin) {
      // admins and superAdmins are exempt from auto-logout
      return;
    }
    // Clear any existing timers
    clearTimeout(timeoutId.current);
    clearTimeout(warningTimeoutId.current);

    // Set a new timer for the warning
    warningTimeoutId.current = setTimeout(() => {
      // Show an in-app modal or notification warning
      console.warn(`You will be logged out in ${TIMEOUT_WARNING_SECONDS} seconds due to inactivity.`);
    }, (IDLE_TIMEOUT_MINUTES * 60 * 1000) - (TIMEOUT_WARNING_SECONDS * 1000));

    // Set the new timer for the actual logout
    timeoutId.current = setTimeout(async () => {
      console.log('Logging out due to inactivity...');
        await signOut();
        dispatch(clearCurrentUserInfo());
        navigate('/'); // Redirect to home page
    }, IDLE_TIMEOUT_MINUTES * 60 * 1000);
  };

  useEffect(() => {
    const handleActivity = () => resetTimer();

    // Listen for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    // Initial timer setup
    resetTimer();

    // Cleanup timers and event listeners on component unmount
    return () => {
      clearTimeout(timeoutId.current);
      clearTimeout(warningTimeoutId.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  return <>{children}</>;
};

export default AutoTimeout;
