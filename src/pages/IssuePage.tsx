import { Button, Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { SyntheticEvent, useEffect } from "react";
import './IssuePage.css'
import { docType_GoogleDoc, docType_Pdf, docType_YouTube, PlaceholderForEmptyUrl } from "../utils/constants";
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
  const proUrl = block?.proUrl || PlaceholderForEmptyUrl;
  const conUrl = block?.conUrl || PlaceholderForEmptyUrl;
  const proIsBlank = proUrl === PlaceholderForEmptyUrl;
  const conIsBlank = conUrl === PlaceholderForEmptyUrl;
  const proDocType = block?.proDocType;
  const proIsPdf = proDocType === docType_Pdf;
  const proIsYouTubeVideo = proDocType === docType_YouTube;
  const proIsGoogleDoc = proDocType === docType_GoogleDoc;
  const conDocType = block?.conDocType
  const conIsPdf = conDocType === docType_Pdf;
  const conIsYouTubeVideo = conDocType === docType_YouTube;
  const conIsGoogleDoc = conDocType === docType_GoogleDoc;
  /*
  Copiedfrom PlayPage03:

  const showPdfViaIframe = docTypeChoice === 'pdfViaIframe';
  const showPdfViaEmbed = docTypeChoice === 'pdfViaEmbed';
  const showVideo = docTypeChoice === 'youTube';
  const showGoogle = docTypeChoice === docType_GoogleDoc;

  */

  const handleShowCommentsClick = (event: { stopPropagation: () => void; }) =>{
    event.stopPropagation();
    const baseUrl = '/comments';
    const commentsUrl = `${baseUrl}?stance=${stance}`;
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
  
  const handleDoBetterClick = (event: SyntheticEvent<HTMLButtonElement>) =>{
    event.stopPropagation();
    const baseUrl = '/doBetter';
    navigate(`${baseUrl}?stance=${stance}`)
  }

  return (
    <PageWrapper>
      <div>
        <div className="embedDiv">
        {
          showPro && proIsPdf && 
          (
            <embed
              src={proUrl}
              type="application/pdf"
              width="832px"
              height="642px" />
          )
        }
        {
          showPro && proIsYouTubeVideo && 
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
              >
            </iframe>
          )
        }
        {
          showPro && proIsGoogleDoc && 
          (
            <iframe
              src={proUrl}
              width= "850px"
              height="660px"
              >
              </iframe>
              /*
            <iframe
              src="https://docs.google.com/document/d/e/2PACX-1vTg6xAjojulAXh49sfu6l0uwlGq8yGLjIIvN9vLA15sSCTZ_UjsJBPp5R560j1dGdK-gDYp5-LKemLT/pub?embedded=true"
              width= "850px"
              height="660px"
              >
              </iframe>
              */
          )
        }
        {
          showCon && conIsPdf && 
          (
            <embed
              src={conUrl}
              type="application/pdf"
              width="832px"
              height="642px" />
          )
        }
        {
          showCon && conIsYouTubeVideo && 
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
              >
            </iframe>
          )
        }
        {
          showCon && conIsGoogleDoc && 
          (
            <iframe
              src={conUrl}
              width= "850px"
              height="660px"
              >
              </iframe>
          )
        }
        </div>
        <div className="showContrastingViewButtonDiv">
          <Flex>
            <Button onClick={handleShowContrastingViewClick}>
              Show {showPro ? 'Dissenting' : 'Our Preferred'} View
            </Button>
            <Button onClick={handleShowCommentsClick}>
              Show Comments
            </Button>
            <Button onClick={handleDoBetterClick}>
              Let Me Try To Do Better!
            </Button>
          </Flex>
        </div>
      </div>
    </PageWrapper>
  );
}

export default IssuePage;
