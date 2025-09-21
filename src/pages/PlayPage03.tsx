// PlayPage03.tsx

import { Flex, Radio, RadioGroupField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { ChangeEvent, useState } from "react";
import './PlayPage03.css';

function PlayPage03() {

  const [docTypeChoice, seDocTypeChoice] = useState('pdfViaIframe');

  const handleDoocTypeRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const choice = event.target.value;
    console.log(`docType choice: '${choice}'.`)
    seDocTypeChoice(choice)
  }

  const showPdfViaIframe = docTypeChoice === 'pdfViaIframe';
  const showPdfViaEmbed = docTypeChoice === 'pdfViaEmbed';
  const showVideo = docTypeChoice === 'youTube';
  const showGoogle = docTypeChoice === 'googleDoc';

  console.log(`At page loading time, docTypeChoice: '${docTypeChoice}'`)

  return (
    <PageWrapper>
      <div className="play2Root">
        <Flex direction='column'>
          <Flex direction="row">
            <div>
              Pick One:
            </div>
            <div className="play2RadioDiv">
              <RadioGroupField
                className="docTypeButtons"
                legend=""
                name="activityChoice"
                direction="row"
                value={docTypeChoice}
                onChange={handleDoocTypeRadioButtonChange}
              >
                <div className="docTypeButtonDiv">
                  <Radio value="pdfViaIframe">&nbsp;Pdf via Iframe</Radio>
                </div>
                <div className="docTypeButtonDiv">
                  <Radio value="pdfViaEmbed">&nbsp;Pdf via Embe</Radio>
                </div>
                <div className="docTypeButtonDiv">
                  <Radio value="youTube">&nbsp;YouTube Video</Radio>
                </div>
                <div className="docTypeButtonDiv">
                  <Radio value="googleDoc">&nbsp;Google Doc</Radio>
                </div>
              </RadioGroupField>
            </div>
          </Flex>
        {
          showVideo &&
          (
            <iframe
              width="1026"
              height="581"
              src='https://www.youtube.com/embed/H3g_kpQHr4M?si=dBR-FdfIJ1NuXryY'
              title="YouTube video player"
              // frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              //referrerpolicy="strict-origin-when-cross-origin"
              //allowfullscreen
              >
          </iframe>
          )
        }
        {
          showGoogle &&
          (
            // UI to display if showOtherFieldsUi is true
            <p>We haven't yet implemented showing Gooogle docs here.</p>
          )
        }
        {
          showPdfViaEmbed &&
          (
            <embed
              src={'https://drive.google.com/file/d/1yUPJuEEeTwLZbzqSzDU0RK-oZ9Nm-I7m/preview'}
              type="application/pdf"
              width="832px"
              height="642px" />
          )
        }
        {
          showPdfViaIframe &&
          (
            <iframe
              src='https://drive.google.com/file/d/1yUPJuEEeTwLZbzqSzDU0RK-oZ9Nm-I7m/preview'
              width="836"
              height="640"
              allow="autoplay" />
          )
        }
        </Flex>
      </div>
    </PageWrapper>
  );
}

export default PlayPage03;
