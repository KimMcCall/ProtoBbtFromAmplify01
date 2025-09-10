import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";


function HomePage() {
  const navigate = useNavigate();

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
        {/* loading &&  <div>Loading user info...</div> */}
      </Flex>
    </PageWrapper>
  ); 
}

export default HomePage;
