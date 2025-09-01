import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Import default styles
import PageWrapper from '../components/PageWrapper';

const spacer: React.CSSProperties = {
  margin: '120px',
};

const hideButton: React.CSSProperties = {
  display: 'none',
};

function LogiinPage() {
  return (
    <PageWrapper>
      <div style={spacer}>
        <Authenticator>
          {({ signOut, user }) => (
            <div>
              <h1>Hello {user?.username}</h1>
              <button onClick={signOut} style={hideButton}>Sign Out</button>
            </div>
          )}
        </Authenticator>
      </div>
    </PageWrapper>
  );
}

export default LogiinPage;
