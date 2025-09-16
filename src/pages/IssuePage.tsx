import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useState } from "react";
import './IssuePage.css'
import { defaultConUrl, defaultProUrl } from "../utils/constants";

function IssuePage() {
  const [showPro, setShowPro] = useState(true);

  const handleShowContrastingViewClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    setShowPro(!showPro);
  }

  const handleShowCommentsClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    console.log('Should now bring up the comments UI.')
  }

  return (
    <PageWrapper>
      <div>
        {
          showPro ?
        (
          <Flex direction='row'>
            <Flex direction='column'>
              <iframe
                width="1026"
                height="581"
                src={defaultProUrl}
                title="YouTube video player"
                // frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                //referrerpolicy="strict-origin-when-cross-origin"
                //allowfullscreen
                >
              </iframe>
            </Flex>
          </Flex>
        )
        :
        (
          <Flex direction='row'>
            <Flex direction='column'>
              <embed
                src={defaultConUrl}
                type="application/pdf"
                width="832px"
                height="642px" />
            </Flex>
          </Flex>
        )
      }

        <div className="showContrastingViewButtonDiv">
          <Flex>
            <Button onClick={handleShowContrastingViewClick}>
              Show {showPro ? 'Dissenting' : 'Our Preferred'} View
            </Button>
            <Button onClick={handleShowCommentsClick}>
              Show Comments
            </Button>
          </Flex>
        </div>
      </div>
    </PageWrapper>
  );
}

export default IssuePage;
