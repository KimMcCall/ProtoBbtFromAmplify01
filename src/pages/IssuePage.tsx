import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect } from "react";
import './IssuePage.css'
import { ProxyForNoUrl } from "../utils/constants";
import { selectDisplayBlockForCurrentIssue } from "../features/issues/issues";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

function IssuePage() {
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const queryStringStance = urlParams.get('stance'); // Should return "pro", "con", or null (which we hope to avoid)
  const explicitlyAskedForPro = queryStringStance === 'pro';
  const shouldShowPro = explicitlyAskedForPro;
  const stance = shouldShowPro ? 'pro' : 'con';
  console.log(`With queryStringStance='${queryStringStance}' we have whatStanceShouldBe: '${stance}'`);

  const showPro = stance === 'pro';
  const showCon = !showPro;

  const handleShowContrastingViewClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    console.log(`At top of handleShowContrastingViewClick: stance: '${stance}'`)
    const newStance = showPro ? 'con' : 'pro';
    const fullNewUrl = `/issue?stance=${newStance}`
    console.log(`Navigating to ${fullNewUrl}`);
    navigate(fullNewUrl, { replace: true})
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
    const commentsUrl = `/comments?stance=${stance}`;
    console.log(`Calling navigate('${commentsUrl}')`)
    navigate(commentsUrl)
  }

  useEffect(() => {
  if (showPro && proIsBlank) {
    navigate('/noProUrl', {replace: true})
  } else if (showCon && conIsBlank) {
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
