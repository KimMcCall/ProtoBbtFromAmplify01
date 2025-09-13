// PlayPage03.tsx
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";

function PlayPage03() {
  return (
    <PageWrapper>
      <Flex direction='row'>
        <Flex direction='column'>
          <div>
            Here's some stuff above the video
          </div>
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
          <div>
            Here's some stuff below the video
          </div>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage03;
