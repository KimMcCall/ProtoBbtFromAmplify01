import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Import default styles

function LogiinPage() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign Out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default LogiinPage;
