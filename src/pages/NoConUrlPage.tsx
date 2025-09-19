// NoConUrlPage.tsx

import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './NoConUrlPage.css'

function NoConUrlPage() {
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
