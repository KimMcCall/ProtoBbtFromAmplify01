// NoConUrlPage.tsx

import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './NoConUrlPage.css'
import { useNavigate } from "react-router-dom";
import { SyntheticEvent } from "react";

function NoConUrlPage() {
  const navigate = useNavigate();
  
    const handleShowContrastingViewClick = (event: SyntheticEvent<HTMLButtonElement>) =>{
      event.stopPropagation();
      navigate('/issue?stance=pro')
    }
  
  const handleShowCommentsClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    const baseUrl = '/commentsXP2';
    navigate(`${baseUrl}?stance=con`)
  }

  return (
    <PageWrapper>
      <div className="noConUrlRoot">
        <Flex direction="column">
          <div className="noConUrlTextsDiv">
            <h1>Default 'Con' Page</h1>
            <div className="noConUrlTextDiv">
              This is your default image before we’ve accepted a video or PDF
file to (respectfully) counter the claim made on the home page.
            </div>
            <div className="noConUrlTextDiv">If you’re interested in creating a video or PDF document to refute
that claim, please click on the “Let Me Try To Do Better!” button
below for an explanation of the procedure
            </div>

          </div>
          <Flex className="noConUrlButtonRow" direction="row">
            <Button onClick={handleShowContrastingViewClick}>
              Show Our View
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

export default NoConUrlPage;
