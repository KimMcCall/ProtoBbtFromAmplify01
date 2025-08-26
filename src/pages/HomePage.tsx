import { useNavigate } from 'react-router-dom';
// import { useAuthenticator } from '@aws-amplify/ui-react';


function HomePage() {
  const navigate = useNavigate();
  // const { signOut } = useAuthenticator();

  const handleButtonClick = (newDir: string) => {
    navigate(newDir); // Navigate to the new route
  };

  return (
    <main>
      <h1>My Glorious Home Page</h1>
      <div>
        <button onClick={() => {handleButtonClick("/todos")}}>Go to ToDos page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/public01")}}>Go to 1st public page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/public02")}}>Go to 2nd public page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/protected01")}}>Go to 1st protected page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/protected02")}}>Go to 2nd protected page</button>
      </div>
      <div>
        <button onClick={() => {handleButtonClick("/logout")}}>Sign Out!</button>
      </div>
      {/*}
      <div>
        <button onClick={signOut}>Sign out</button>
      </div>
      */}
    </main>
  ); 
}

export default HomePage;
