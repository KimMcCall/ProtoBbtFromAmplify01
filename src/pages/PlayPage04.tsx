// PlayPage03.tsx
import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { defaultConUrl } from "../utils/constants";

function PlayPage04() {
  return (
    <PageWrapper>
      <Flex direction='row'>
        <Flex direction='column' gap='8px'>
          <div>
            Here's some stuff above the PDF
          </div>
          <div id="pdf-container">
            <embed
              src={defaultConUrl}
              type="application/pdf"
              width="832px"
              height="642px" />
              
            {/*  If that doesn't work, maybe try this:
            <iframe
              src={defaultConUrl}
              width="836"
              height="640"
              allow="autoplay" />
            */}
          </div>
          <Flex>
            <Button>
              Alternative View
            </Button>
            <Button>
              Comment
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage04;
