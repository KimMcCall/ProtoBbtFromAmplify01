import { Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Import default styles
import PageWrapper from '../components/PageWrapper';

const spacer: React.CSSProperties = {
  margin: '120px',
};

const hideButton: React.CSSProperties = {
  display: 'none',
};

const shouldShowUserInfo = false;

function LoginPage() {
  return (
    <PageWrapper>
      <div style={spacer}>
        <Authenticator>
          {({ signOut, user }) => (
            shouldShowUserInfo
            ?
              (
              <div>
                <h1>Hello!</h1>
                <h1>LoginId: {user?.signInDetails?.loginId}</h1>
                <h1>UserId: {user?.userId}</h1>
                <button onClick={signOut} style={hideButton}>Sign Out</button>
              </div>
              )
            :
              (
              <Navigate to="/" replace />
              )
          )}
        </Authenticator>
      </div>
    </PageWrapper>
  );
}

export default LoginPage;
