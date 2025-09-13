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
              src="https://drive.google.com/file/d/14YSO2JayELhphAY_1Nb-tHYTF5fqBCWT/view?usp=sharing"
              type="application/pdf"
              width="1000px"
              height="560px" />
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
