import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@aws-amplify/auth';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";

function HomePage() {
  // const [loading, setLoading] = useState(true);
  const [haveUser, setHaveUser] = useState(false);

  const navigate = useNavigate();

  async function getUserInfo() {
    try {
      const showUserInfo = true;
      const { username, userId, signInDetails } = await getCurrentUser();
      if (showUserInfo) {
        console.log("Username:", username);
        console.log("User ID:", userId);
        console.log("Sign-in Details:", signInDetails);
        console.log("Login ID:", signInDetails?.loginId);
      }
      // setLoading(false);
      setHaveUser(true);
      if (showUserInfo) {
        console.log("Got current user");
      }
      /*
      console.log("Username:", username);
      console.log("User ID:", userId);
      console.log("Sign-in Details:", signInDetails);
      */
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleButtonClick = (newDir: string) => {
    navigate(newDir); // Navigate to the new route
  };

  getUserInfo();
  console.log("HomePage: haveUser=", haveUser);

  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
        <h1>My Glorious App</h1>
        <div>
          You're on the Home Page.
        </div>
        <div>
          <button onClick={() => {handleButtonClick("/sketch")}}>Go to Sketch page</button>
        </div>
        <div>
          <button onClick={() => {handleButtonClick("/suggestion")}}>Go to Suggestion page</button>
        </div>
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
        {/* loading &&  <div>Loading user info...</div> */}
        { haveUser &&  <div><button onClick={() => {
          handleButtonClick("/logout");
          }
          }>Sign Out!</button></div> }
      </Flex>
    </PageWrapper>
  ); 
}

export default HomePage;
