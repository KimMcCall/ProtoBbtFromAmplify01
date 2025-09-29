// DoBetterPage.tsx

import { Button, Flex, Radio, RadioGroupField, TextAreaField, TextField } from '@aws-amplify/ui-react';
import PageWrapper from '../components/PageWrapper';
import './DoBetterPage.css'
import { ChangeEvent, useState } from 'react';
import { dbClient } from '../main';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUserCanonicalEmail, selectCurrentUserId } from '../features/userInfo/userInfoSlice';
import { selectCurrentIssue } from '../features/issues/issues';
import { checkForPermissionOnGoogleDoc } from '../utils/utils';

function DoBetterPage() {
  const [instructionsUiChoice, setInstructionsUiChoice] = useState('NoChoice');
  const [specifiedUrl, setSpecifiedUrl] = useState('');
  const [explanationText, setExplanationText] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const queryStringStance = urlParams.get('stance'); // Should return "pro", "con", or null (which we hope to avoid)
  const explicitlyAskedForPro = queryStringStance === 'pro';
  const shouldShowPro = explicitlyAskedForPro;
  const stance = shouldShowPro ? 'pro' : 'con';
  console.log(`With queryStringStance='${queryStringStance}' we have whatStanceShouldBe: '${stance}'`);

  const showYouTubeUi = instructionsUiChoice === 'YouTube';
  const showGoogleDocUi = instructionsUiChoice === 'GoogleDoc';
  const showPdfUi = instructionsUiChoice === 'PDF';
  const showIntro = !showYouTubeUi && !showGoogleDocUi && !showPdfUi;

  const currentUserId = useAppSelector(selectCurrentUserId);
  const currentUserEmail = useAppSelector(selectCurrentUserCanonicalEmail);
  const currentIssue = useAppSelector(selectCurrentIssue);
``
  console.log(`In DoBetterPage, currentUserId is ${currentUserId}, currentUserEmail is ${currentUserEmail}, currentIssueId is ${currentIssue}`);

  function handleInstructionsUiChange(event: ChangeEvent<HTMLInputElement>): void {
    event.stopPropagation();
    const choice = event.target.value;
      
      console.log(`In handleInstructionsUiChange, choice is now: ${choice}`);
      setInstructionsUiChoice(choice);
    }

  function handleExplanationChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setExplanationText(event.target.value);
  }

  function handleUrlChange(event: ChangeEvent<HTMLInputElement>): void {
    setSpecifiedUrl(event.target.value);
  }

  function handleClear(): void {
    setSpecifiedUrl('');
  }

  function handleReturnToIntro(): void {
    setInstructionsUiChoice('NoChoice');
    setSpecifiedUrl('');
  }

  async function handleSubmit(): Promise<void> {
    if (!specifiedUrl) {
      alert('Please enter a URL before submitting');
      return;
    }

    // Basic URL validation
    try {
      new URL(specifiedUrl);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    // YouTube URL validation
    if (showYouTubeUi && !specifiedUrl.includes('youtube.com') && !specifiedUrl.includes('youtu.be')) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    // Google Doc URL validation
    if (showGoogleDocUi && !specifiedUrl.includes('docs.google.com')) {
      alert('Please enter a valid Google Doc URL');
      return;
    }

    let permissionQResult = { granted: true, explanation: '' };

    if (showGoogleDocUi) {
      permissionQResult = await checkForPermissionOnGoogleDoc(currentUserId, specifiedUrl);
      if (!permissionQResult.granted) {
        alert(`Google Doc permission denied: ${permissionQResult.explanation}`);
        return;
      }
    }

    // PDF File URL validation
    // if (showPdfUi && !specifiedUrl.includes('.pdf')) {
    if (showPdfUi && !specifiedUrl.includes('docs.google.com/document')) {
      alert('For now, we only accept PDF files that have been uploaded to Google Docs');
      return;
    }
    

    console.log('Submitting URL:', specifiedUrl);
    const docType = showYouTubeUi ? 'YouTube' : showGoogleDocUi ? 'GoogleDoc' : 'Pdf';
    // Submit the URL to the database
    await dbClient.models.UrlSubmission.create({
      issueId: currentIssue?.issueId || 'NoIssueId_8e2f3c1e-2d3b-4f7a-9f4e-1c2d3e4f5a6b',
      issueClaim: currentIssue?.claim || 'NoClaim_9f8e7d6c-5b4a-3c2d-1e0f-9a8b7c6d5e4f',
      submitterEmail: currentUserEmail,
      submitterId: currentUserId,
      docType: docType,
      url: specifiedUrl,
      stance: stance,
      submitterComment: explanationText || 'NoComment_b8d50a00-4b4e-4a36-be4c-b7e1cecd5cc1',
      reviewed: false,
      accepted: false,
      yucky: false,
      causedBanning: false,
      lifePhase: 'Just Received',
      isCloistered: false,
    });
    alert('Thank you for your submission!');
    handleReturnToIntro();
  }

  return (
    <PageWrapper>
      <div className="doBetterPage">
      {
        showIntro ?
      (
        <div>
          <h2>Let's Do Better</h2>
          <div className="doBetterIntroText">
            <div className='doBetterTextDiv'>
              This page explains how you can help us do better by creating a YouTube Video, Google Doc, or PDF document to support your</div>
            <div className='doBetterTextDiv'>point of view on the issue at hand. Whether you agree with the claim made on the 'Issues' page (the "Pro" side)</div>
            <div className='doBetterTextDiv'>or you disagree with it (the "Con" side), we welcome and invite your contribution.</div>
          </div>
          <div>
          <h3>What We’re Looking For</h3>
          <div className='doBetterTextDiv'>We are looking for well-reasoned and respectful presentations that clearly articulate your perspective on the issue.</div>
          <div className='doBetterTextDiv'>Your contribution should aim to inform and persuade others by providing evidence, examples, and logical arguments.</div>
          <div className='doBetterTextDiv'>We value clarity, coherence, and a balanced approach to discussing the topic.</div>
          </div>
          <div>
            We strongly prefer YouTube videos or Google Docs, but we will accept PDF documents if that is your only option.
          </div>
          <div>
          <h3>Why Your Contribution Matters</h3>
          <div className='doBetterTextDiv'>Your perspective is valuable, and by sharing it through a well-crafted video or document, you can help others understand</div>
          <div className='doBetterTextDiv'>the nuances of the issue. While we have our own (perhaps very stongly held) views, we believe that a diversity of viewpoints leads to a richer and more informed discussion.</div>
          <div className='doBetterTextDiv'>By contributing, especially to the "Con" side, you help us present a balanced view of the topic.</div>
          </div>
          <div className="doBetterSpacerDiv">
          </div>
          <div className="doBetterMainText">
            <h3>How to Contribute</h3>
            <div className='doBetterTextDiv'>To contribute, please create a video or PDF document that clearly presents your perspective on the issue.</div>
            <div className='doBetterTextDiv'>Make sure to provide evidence and reasoning to support your claims. Once you have created your content,</div>
            <div className='doBetterTextDiv'>you can submit it through our submission form, which can be found by clicking the button below.</div>
          </div>
        </div>
      ) : null
    }
      {
        showGoogleDocUi ?
      (
        <div>
          <h2>Let's Do Better</h2>
          <div className="doBetterIntroText">
            <div className='doBetterTextDiv'>
              This page should explain how to create a Google Doc and prepare it for sharing with us</div>
            <div className='doBetterTextDiv'>
              It should also contain a textfield for the appropriate URL and buttons to Submit, Clear, and Return to Intro</div>
            <div className='doBetterUrlAndButtonsDiv'>
              <TextAreaField
                label="Explanation:"
                value={explanationText}
                onChange={handleExplanationChange}
                rows={7}
                placeholder="Please provide a brief explanation of why you believe this document does a better job than the current one...."
              />
              <TextField label="Google Doc URL" value={specifiedUrl} onChange={handleUrlChange} />
              <Flex className='doBetterButtonsRow' gap="1rem">
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleClear}>Clear</Button>
                <Button onClick={handleReturnToIntro}>Return to Intro</Button>
              </Flex>
            </div>
          </div>
        </div>
      ) : null
    }
      {
        showYouTubeUi ?
      (
        <div>
          <h2>Let's Do Better</h2>
          <div className="doBetterIntroText">
            <div className='doBetterTextDiv'>
              This page should explain how to create a YouTube Video and prepare it for sharing with us</div>
            <div className='doBetterTextDiv'>
              It should also contain a textfield for the appropriate URL and buttons to Submit, Clear, and Return to Intro</div>
            <div className='doBetterTextDiv'>
              YouTube videos should be uploaded to YouTube (or later marked) as "Unlisted" (not "Private")
              so we can view them but they won't be publicly searchable.
              You can mark a video as "Unlisted" in the video's "Visibility" settings on YouTube.
              In your YouTube channel, select the checkbox next to the video you want to share.
              In the actions bar that appears at the top, click Edit and select "Unlisted".
              In the menu that appears, select "Visibility" and then in the dropdown select "Unlisted".
              Finally, click "Update videos" button near the top right to apply the changes.
              Confirm in the ensuing dialog by checking the checkbox and clicking "Update videos".
              Here are some instructions for getting the URL we want</div>
            <div className='doBetterTextDiv'>
              Navigate to the YouTube video: Open the specific YouTube video you want to embed in your web browser.</div>
            <div className='doBetterTextDiv'>
              Access the Share options: Below the video player, locate and click the "Share" button.</div>
            <div className='doBetterTextDiv'>
              Select the Embed icon (a white disk with '$lt;' and '$gt;' symbols): In the popup window that appears.</div>
            <div className='doBetterTextDiv'>
              This will bring up another pop-up that will display an HTML code snippet. .
              </div>
            <div className='doBetterTextDiv'>
              In the code, find the string (starting with 'https://www.youtube.com/') that contains the video URL. This is the we need. Copy this URL and paste it into the text field below.
              </div>
          </div>
          <div className='doBetterTextDiv'>
            Here's an example: https://www.youtube.com/embed/9n8j2rtRebY?si=ayEiRzDRD4uiEkiu
          </div>
          <div className='doBetterUrlAndButtonsDiv'>
            <TextField label="YouTube Video URL:" value={specifiedUrl} onChange={handleUrlChange} />
            <Flex className='doBetterButtonsRow' gap="1rem">
              <Button onClick={handleSubmit}>Submit</Button>
              <Button onClick={handleClear}>Clear</Button>
              <Button onClick={handleReturnToIntro}>Return to Intro</Button>
            </Flex>
          </div>
        </div>
      ) : null
    }
      {
        showPdfUi ?
      (
        <div>
          <h2>Let's Do Better</h2>
          <div className="doBetterIntroText">
            <div className='doBetterTextDiv'>
              This page should explain how to create a PDF document and prepare it for sharing with us</div>
            <div className='doBetterTextDiv'>
              It should also contain a textfield for the appropriate URL and buttons to Submit, Clear, and Return to Intro</div>
            <div className='doBetterUrlAndButtonsDiv'>
              <TextField label="PDF File URL:" value={specifiedUrl} onChange={handleUrlChange} />
              <Flex className='doBetterButtonsRow' gap="1rem">
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleClear}>Clear</Button>
                <Button onClick={handleReturnToIntro}>Return to Intro</Button>
              </Flex>
            </div>
          </div>
        </div>
      ) : null
    }
        <div className='doBetterRadioGroupDiv'>
          <RadioGroupField
            legend="Choose a doc type:"
            name="docTypeGroup"
            direction="row"
            value={instructionsUiChoice}
            onChange={handleInstructionsUiChange}>
            <div className='doBetterRadioDiv'>
              <Radio value="YouTube">&nbsp;YouTube Video</Radio>
            </div>
            <div className='doBetterRadioDiv'>
              <Radio value="GoogleDoc">&nbsp;Google Doc</Radio>
            </div>
            <div className='doBetterRadioDiv'>
              <Radio value="PDF">&nbsp;PDF Document</Radio>
            </div>
            <div className='doBetterRadioDiv'>
              <Radio value="NoChoice">&nbsp;Review Intro</Radio>
            </div>
          </RadioGroupField>
        </div>
      </div>
    </PageWrapper>
  );
}

export default DoBetterPage;
