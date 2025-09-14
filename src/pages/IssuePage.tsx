import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useState } from "react";
import './IssuePage.css'

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
                src="https://www.youtube.com/embed/H3g_kpQHr4M?si=dBR-FdfIJ1NuXryY"
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
                src="https://drive.google.com/file/d/1CFM6-2h3vrdqx4TVkRZWh7RUTNU3bsMb/preview"
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
