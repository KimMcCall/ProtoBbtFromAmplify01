import { dbClient } from "../main";
import { Button, Flex, TextField } from '@aws-amplify/ui-react';
import PageWrapper from "../components/PageWrapper";
import { filterForUltimateAvailability, sortAndRepairIssues, structurePerIssue } from "../utils/utils";
import { useAppDispatch } from "../app/hooks";
import { setAllIssues, setAvailableIssues, setDisplayBlocks } from "../features/issues/issues";
import './PlayPage01.css';
import { useState } from "react";

const testGet = () => {
  console.log(`DBM: calling RegisteredUser.get() at ${Date.now() % 10000}`);
  dbClient.models.RegisteredUser.get({id: '08f930bf-44fe-419d-8610-c1c685a24f94'})
  .then((response) => {
    const user = response.data;
    // if no match, returns user=null and errors=undefined
    console.log("Found User: ", user);
    console.log('with errors: ', response?.errors)
  });
};

const testSecondaryIndex = () => {
  console.log(`DBM: calling RegisteredUser.listByCanonicalEmail() at ${Date.now() % 10000}`);
  dbClient.models.RegisteredUser.listByCanonicalEmail({
    canonicalEmail: 'mccall.kim@gmail.com',
  })
  .then((response) => {
    const users = response.data; // an array
    if (users.length < 1) {
      return;
    }
    const user = users[0];
    console.log("Found RegisteredUser: ", user); // contains id and everything
    console.log('with errors: ', response?.errors)
  });
}

function PlayPage01() {
  const [emailSubject, setEmailSubject] =  useState('');
  const [emailBody, setEmailBody] =  useState('');
  const [textToBeModerated, setTextToBeModerated] = useState('');
  const [docUrlToBeModerated, setDocUrlToBeModerated] = useState('');

  const dispatch = useAppDispatch();

  const fetchAndCacheIssues = async () => {
    console.log(`DBM: calling IssueP2.list() at ${Date.now() % 10000}`);
    const response = await dbClient.models.IssueP2.list();
    const allIssues = response.data;
    console.log(`Fetched ${allIssues.length} issues`);
    const sortedAndRepairedIssues = sortAndRepairIssues(allIssues);
    console.log(`All ${sortedAndRepairedIssues.length} issues: `, sortedAndRepairedIssues);
    dispatch(setAllIssues(sortedAndRepairedIssues));
    const filteredForAvailable = filterForUltimateAvailability(sortedAndRepairedIssues);
    dispatch(setAvailableIssues(filteredForAvailable));
    // Structure per issue for rendering
    const structured = structurePerIssue(filteredForAvailable);
    dispatch(setDisplayBlocks(structured));
  };

  const buildAndInsertHtml = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.stopPropagation();
    const demoHtml = `
      <div class="demo-content">
        <h3>Sample Generated HTML</h3>
        <p>This is a demonstration of HTML generation at ${new Date().toLocaleString()}</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>
    `;

    const demoArea = document.getElementById('demoArea');
    if (demoArea) {
      demoArea.innerHTML = demoHtml;
    } else {
      console.warn('Demo area not found in DOM');
    }
  };

  async function testSendEmail() {
    const bodyText = emailBody || "This is a test email from truthSquad.";
    console.log(`Calling sendEmail with subject: '${emailSubject}' and body: '${bodyText}'`);
    try {
      const emailArgs = {
        sender: "info@truthSquad.com",
        recipients: ["mccall.kim@gmail.com"],
        subject: emailSubject || "Test Email from truthSquad",
        text: bodyText,
        html: `<strong>${bodyText}</strong>`
      };
      const result = await dbClient.queries.sendEmail(emailArgs);
      console.log("sendEmail result:", result);
      const resultData = result.data;
      console.log(`Email result: ${resultData}`);
    } catch (error) {
      console.error("Function error:", error);
      alert(`Function execution failed: ${error}`);
    }
  }

  async function testModerateGoogleDoc() {
    const docUrl = docUrlToBeModerated || "https://docs.google.com/document/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5";
    console.log(`Calling testPolicyStringOrDoc with doc URL: '${docUrl}'`);
    try {
      const result = await dbClient.queries.testPolicyStringOrDoc({ docUrl });
      console.log("testPolicyStringOrDoc result:", result);
      const resultData = result.data;
      console.log(`Moderation result: ${resultData}`);
    } catch (error) {
      console.error("Function error:", error);
      alert(`Function execution failed: ${error}`);
    }
  }

  async function testModerateString() {
    const text = textToBeModerated || "This is a test string.";
    console.log(`Calling testPolicyStringOrDoc with text: '${text}'`);
    try {
      const result = await dbClient.queries.testPolicyStringOrDoc({ text });
      console.log("testPolicyStringOrDoc result:", result);
      const resultData = result.data;
      console.log(`Moderation result: ${resultData}`);
    } catch (error) {
      console.error("Function error:", error);
      alert(`Function execution failed: ${error}`);
    }
  }

  return (
    <PageWrapper>
      <div className="pp01Root">
        <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
          <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
            <Button onClick={fetchAndCacheIssues}>SA: Fetch Issues</Button>
            <Button onClick={testGet}>Test get()</Button>
            <Button onClick={testSecondaryIndex}>Test Secondary Index()</Button>
          </Flex>
          <Flex className="testEmailRow" direction="row" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
            <TextField
              className="emailTextField"
              label=""
              placeholder="Enter email subject line"
              width={240}
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
            <TextField
              className="emailTextField"
              label=""
              placeholder="Enter email body"
              width={400}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
            <Button className="emailButton" onClick={testSendEmail}>Test Email</Button>
          </Flex>
          <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
            <Flex direction="row" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
              <TextField
                className="moderateTextField"
                label=""
                placeholder="text to be evaluated"
                width={400}
                value={textToBeModerated}
                onChange={(e) => setTextToBeModerated(e.target.value)}
              />
              <Button className="moderateButton" onClick={testModerateString}>Test Email</Button>
            </Flex>
            <Flex direction="row" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
              <TextField
                className="moderateTextField"
                label=""
                placeholder="Enter Google Doc URL"
                width={400}
                value={docUrlToBeModerated}
                onChange={(e) => setDocUrlToBeModerated(e.target.value)}
              />
              <Button className="moderateButton" onClick={testModerateGoogleDoc}>Test Email</Button>
            </Flex>
          </Flex>
          <Flex direction="row" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
            <Button onClick={buildAndInsertHtml}>Build & Show HTML</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <div id='demoArea'></div>
          </Flex>
        </Flex>
      </div>
    </PageWrapper>
  );
}

export default PlayPage01;
