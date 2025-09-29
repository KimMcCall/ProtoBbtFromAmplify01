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
        const baseUrl = '/comments';
        navigate(`${baseUrl}?stance=pro`)
  }

  const handleDoBetterClick = (event: SyntheticEvent<HTMLButtonElement>) =>{
    event.stopPropagation();
    const baseUrl = '/doBetter';
    navigate(`${baseUrl}?stance=pro`)
  }

  return (
    <PageWrapper>
      <div className="noProUrlRoot">
        <Flex direction="column">
          <div className="noProUrlTextsDiv">
            <h1>Placeholder 'Pro' Page</h1>
            <div className="noProUrlTextDiv">
This is your default image before we’ve accepted a video or PDF file to express more fully and defend the
claim made on the home page.
            </div>
            <div className="noProUrlTextDiv">
              If you’re interested in creating a video or PDF document to defend that claim, please click on the
“Let Me Try To Do Better!” button below for an explanation of the procedure.
            </div>
            <ul>
              <li>We prefer YouTube videos or Google Docs, but we can also accept PDFs</li>
              <li>We insist that you be respectful and avoid inflammatory language</li>
              <li>We ask that you avoid conspiracy theories and stick to verifiable facts</li>
              <li>We ask that you avoid plagiarism and cite your sources</li>
            </ul>
            <div className="noProUrlTextDiv">
              If you just want to see the dissenting view of the issue or read comments from other users,
please click on the appropriate button below.
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
            <Button onClick={handleDoBetterClick}>
              Let Me Try To Do Better!
            </Button>
          </Flex>
        </Flex>
      </div>
    </PageWrapper>
  );
}

export default NoProUrlPage;
