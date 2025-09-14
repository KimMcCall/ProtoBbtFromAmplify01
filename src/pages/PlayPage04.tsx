// PlayPage03.tsx
import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";

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
              src="https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview"
              type="application/pdf"
              width="832px"
              height="642px" />
              
            {/*  If that doesn't work, maybe try this:
            <iframe
              src="https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview"
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
