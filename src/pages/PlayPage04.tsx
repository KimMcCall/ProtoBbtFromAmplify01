// PlayPage03.tsx
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";

function PlayPage04() {
  return (
    <PageWrapper>
      <Flex direction='row'>
        <Flex direction='column'>
          <div>
            Here's some stuff above the PDF
          </div>
          <div id="pdf-container">
            <embed
              src="https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview"
              type="application/pdf"
              width="836"
              height="640px" />
              
            {/*  If that doesn't work, maybe try this:
            <iframe
              src="https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview"
              width="836"
              height="640"
              allow="autoplay" />*/}
          </div>

          <div>
            Here's some stuff below the PDF
          </div>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage04;

// https://drive.google.com/file/d/14YSO2JayELhphAY_1Nb-tHYTF5fqBCWT/view?usp=sharing
// https://drive.google.com/file/d/14YSO2JayELhphAY_1Nb-tHYTF5fqBCWT/view?usp=sharing
// https://drive.google.com/file/d/14YSO2JayELhphAY_1Nb-tHYTF5fqBCWT/view?usp=sharing
