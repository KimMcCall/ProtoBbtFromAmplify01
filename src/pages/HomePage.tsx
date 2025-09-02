import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { haveLoggedInUser } from "../utils/utils";


let haveUser: boolean = false;

async function checkforUser() {
    haveUser = await haveLoggedInUser();
}

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    checkforUser();
  }, []);

  const handleButtonClick = (newDir: string) => {
    navigate(newDir); // Navigate to the new route
  };

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
