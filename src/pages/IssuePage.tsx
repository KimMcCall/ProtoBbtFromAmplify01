import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useState } from "react";
import './IssuePage.css'
import { defaultConIsPdf, defaultConUrl, defaultProIsPdf, defaultProUrl } from "../utils/constants";
import { selectDisplayBlockForCurrentIssue, setProOrCon } from "../features/issues/issues";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

function IssuePage() {
  const [showPro, setShowPro] = useState(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleShowContrastingViewClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    setShowPro(!showPro);
  }

  const block = useAppSelector(selectDisplayBlockForCurrentIssue);
  const proUrl = block?.proUrl || defaultProUrl;
  const conUrl = block?.conUrl || defaultConUrl;
  const proIsPdf = proUrl === defaultProUrl ? defaultProIsPdf : block?.proIsPdf;
  const conIsPdf = conUrl === defaultConUrl ? defaultConIsPdf : block?.proIsPdf;

  const handleShowCommentsClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    const proOrCon = showPro ? 'pro' : 'con';
    dispatch(setProOrCon(proOrCon))
    navigate('/comments')
  }

  return (
    <PageWrapper>
      <div>
        {
          showPro ?
        (
          <Flex direction='row'>
            <Flex direction='column'>
              {
                proIsPdf ?
                (
                  <embed
                    src={proUrl}
                    type="application/pdf"
                    width="832px"
                    height="642px" />
                )
                :
                (
                  <iframe
                    width="1026"
                    height="581"
                    src={proUrl}
                    title="YouTube video player"
                    // frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    //referrerpolicy="strict-origin-when-cross-origin"
                    //allowfullscreen
                    />
                )
              }
            </Flex>
          </Flex>
        )
        :
        (
          <Flex direction='row'>
            <Flex direction='column'>
              {
                conIsPdf ?
                (
                  <embed
                    src={conUrl}
                    type="application/pdf"
                    width="832px"
                    height="642px" />
                )
                :
                (
                  <iframe
                    width="1026"
                    height="581"
                    src={conUrl}
                    title="YouTube video player"
                    // frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    //referrerpolicy="strict-origin-when-cross-origin"
                    //allowfullscreen
                    />
                )
              }
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
