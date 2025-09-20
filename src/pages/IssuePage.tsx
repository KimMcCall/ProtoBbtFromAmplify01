import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, useState } from "react";
import './IssuePage.css'
import { ProxyForNoUrl } from "../utils/constants";
import { selectDisplayBlockForCurrentIssue, setProOrCon } from "../features/issues/issues";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

function IssuePage() {
  const [showPro, setShowPro] = useState(true);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const urlParams = new URLSearchParams(window.location.search);
  const queryStringPro = urlParams.get('pro'); // Should return "no", "yes", or null
  const explicitlyAskedForCon = queryStringPro ==='no';
  const shouldShowPro = showPro || !explicitlyAskedForCon;
  const shouldShowCon = !shouldShowPro
  console.log(`With queryStringPro='${queryStringPro}' and showPro: ${showPro}, we have shouldShowPro: ${shouldShowPro}`);
  /*
  if (shouldShowPro !== showPro) {
    setShowPro(shouldShowPro);
  }
  */
  if (shouldShowCon) {
    navigate(`/issue?pro=no`);
  } else {
    navigate(`/issue?pro=yes`);
  }

  const handleShowContrastingViewClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    console.log(`BEFORE: showPro: ${showPro}`)
    setShowPro(!showPro);
  }

  const block = useAppSelector(selectDisplayBlockForCurrentIssue);
  const proUrl = block?.proUrl || ProxyForNoUrl;
  const conUrl = block?.conUrl || ProxyForNoUrl;
  const proIsBlank = proUrl === ProxyForNoUrl;
  const conIsBlank = conUrl === ProxyForNoUrl;
  const proIsPdf = proIsBlank ? false : block?.proIsPdf;
  const conIsPdf = conIsBlank ? false : block?.proIsPdf;

  const handleShowCommentsClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    const proOrCon = showPro ? 'pro' : 'con';
    dispatch(setProOrCon(proOrCon))
    navigate('/comments')
  }

  useEffect(() => {
  if (showPro && proIsBlank) {
    navigate('/noProUrl', {replace: true})
  } else if (!showPro && conIsBlank) {
    navigate('/noConUrl', {replace: true})
  }
  })

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
