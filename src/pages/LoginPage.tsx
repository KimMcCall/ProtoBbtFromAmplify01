import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Import default styles
import PageWrapper from '../components/PageWrapper';
import LoggedInPage from './LoggedInPage';
import './LoginPage.css';
import { useAppDispatch } from '../app/hooks';
import { setNextPath } from '../features/navigation/navigationSlice';

const shouldShowUserInfo = false;

function LoginPage() {
  const dispatch = useAppDispatch();
  dispatch(setNextPath('/')); // After login, go to home page
  
  return (
    <PageWrapper>
      <div className='spacer'>
        <Authenticator>
          {({ signOut, user }) => (
            shouldShowUserInfo || !user
            ?
              (
              <div>
                <h1>Hello!</h1>
                <h1>LoginId: {user?.signInDetails?.loginId}</h1>
                <h1>UserId: {user?.userId}</h1>
                <button className='hiddenButton' onClick={signOut}>Sign Out</button>
              </div>
              )
            :
              (
              <LoggedInPage {...user} />
              )
          )}
        </Authenticator>
      </div>
    </PageWrapper>
  );
}

export default LoginPage;
