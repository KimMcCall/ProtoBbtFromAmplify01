// DoBetterPage.tsx

import PageWrapper from '../components/PageWrapper';
import './DoBetterPage.css'

function DoBetterPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryStringStance = urlParams.get('stance'); // Should return "pro", "con", or null (which we hope to avoid)
  const explicitlyAskedForPro = queryStringStance === 'pro';
  const shouldShowPro = explicitlyAskedForPro;
  const stance = shouldShowPro ? 'pro' : 'con';
  console.log(`With queryStringStance='${queryStringStance}' we have whatStanceShouldBe: '${stance}'`);


  return (
    <PageWrapper>
      <div className="doBetterPage">
        <h2>Let's Do Better</h2>
        <div className="doBetterIntroText">
          <p>
            This page explains how you can help us do better by creating a YouTube Video, Google Doc, or PDF document to support your</p>
          <p>point of view on the issue at hand. Whether you agree with the claim made on the 'Issues' page (the "Pro" side)</p>
          <p>or you disagree with it (the "Con" side), we welcome and invite your contribution.</p>
        </div>
        <div>
        <h3>What We’re Looking For</h3>
        <p>We are looking for well-reasoned and respectful presentations that clearly articulate your perspective on the issue.</p>
        <p>Your contribution should aim to inform and persuade others by providing evidence, examples, and logical arguments.</p>
        <p>We value clarity, coherence, and a balanced approach to discussing the topic.</p>
        </div>
        <div>
          We support three kinds of documents:
          <ul>
            <li>YouTube videos</li>
            <li>Google Docs</li>
            <li>PDF documents</li>
          </ul>
        </div>
        <div>
          We strongly prefer YouTube videos or Google Docs, but we will accept PDF documents if that is your only option.
        </div>
        <div>
        <h3>Why Your Contribution Matters</h3>
        <p>Your perspective is valuable, and by sharing it through a well-crafted video or document, you can help others understand</p>
        <p>the nuances of the issue. While we have our own (perhaps very stongly held) views, we believe that a diversity of viewpoints leads to a richer and more informed discussion.</p>
        <p>By contributing, especially to the 
          Con" side, you help us present a balanced view of the topic.</p>
        </div>
        <div className="doBetterSpacerDiv">
        </div>
      <div className="doBetterMainText">
        <h3>How to Contribute</h3>
        <p>To contribute, please create a video or PDF document that clearly presents your perspective on the issue.</p>
        <p>Make sure to provide evidence and reasoning to support your claims. Once you have created your content,</p>
        <p>you can submit it through our submission form, which can be found by clicking the button below.</p>  
      </div>
      </div>
    </PageWrapper>
  );
}

export default DoBetterPage;
