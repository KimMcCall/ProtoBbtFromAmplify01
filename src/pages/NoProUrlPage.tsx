// NoProUrlPage.tsx

import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './NoProUrlPage.css'
import { SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";

function NoProUrlPage() {
  const navigate = useNavigate();

  const handleShowContrastingViewClick = (event: SyntheticEvent<HTMLButtonElement>) =>{
    event.stopPropagation();
    navigate('/issue?stance=con')    
  }
  
  const handleShowCommentsClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
        const baseUrl = '/commentsXP2';
        navigate(`${baseUrl}?stance=pro`)
  }

  return (
    <PageWrapper>
      <div className="noProUrlRoot">
        <Flex direction="column">
          <div className="noProUrlTextsDiv">
            <h1>Default 'Pro' Page</h1>
            <div className="noProUrlTextDiv">
This is your default image before we’ve accepted a video or PDF file to express more fully and defend the
claim made on the home page.
            </div>
            <div className="noProUrlTextDiv">
              If you’re interested in creating a video or PDF document to defend that claim, please click on the
“Let Me Try To Do Better!” button below for an explanation of the procedure.
            </div>

          <div className="showContrastingViewButtonDiv">
            <Flex>
            </Flex>
          </div>
          </div>
          <Flex className="noProUrlButtonRow" direction="row">
            <Button onClick={handleShowContrastingViewClick}>
              Show Dissenting View
            </Button>
            <Button onClick={handleShowCommentsClick}>
              Show Comments
            </Button>
            <Button>
              Let Me Try To Do Better!
            </Button>
          </Flex>
        </Flex>
      </div>
    </PageWrapper>
  );
}

export default NoProUrlPage;
