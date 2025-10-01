import { Button, Flex, Radio, RadioGroupField, TextAreaField, TextField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminIssuesPage.css'
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { createIssue } from "../utils/dynamodb_operations";
import ToastNotifier from "../components/ToastNotifier";
import { docType_GoogleDoc, docType_Pdf, docType_Unknown, docType_YouTube, PlaceholderForEmptyUrl } from "../utils/constants";
import { selectCurrentUserCanonicalEmail } from "../features/userInfo/userInfoSlice";
import { useAppSelector } from "../app/hooks";
import { IssueType, selectAllIssues } from "../features/issues/issues";
import { getLatestRowWithIssueId } from "../utils/utils";
import { dbClient } from "../main";
import { UpdateTemplateCommand } from "@aws-sdk/client-ses";

// Claim: There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive.
// Priority: 999000
// ProURL: {ProxyForNoUrl}
// ConURL: {ProxyForNoUrl}

interface IssueTilePropsType {
  issue: IssueType
  selectionCallback: (e: SyntheticEvent<HTMLDivElement>, issue: IssueType) => void
}

interface IdIssuePairType {
  issueId: string
  issue: IssueType
}

function IssueTile(props: IssueTilePropsType) {
  const { issue, selectionCallback } = props;

  const handleTileClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();
    selectionCallback(event, issue);
  }

  return(
    <div key={issue.issueId} className="issueTileRoot" onClick={handleTileClick}>
      {issue.claim}
    </div>
  )
}

function AdminIssuesPage() {
  const [toastMessage, setToastMessage] = useState('Sorry! You need to fill in at least one URL');
  const [shouldShowAcceptanceToast, setShouldShowAcceptanceToast] = useState(false);
  const [proDocTypeChoice, setProDocTypeChoice] = useState(docType_Unknown);
  const [conDocTypeChoice, setConDocTypeChoice] = useState(docType_Unknown);
  const [newIssueProUrl, setNewIssueProUrl] = useState('');
  const [newIssueConUrl, setNewIssueConUrl] = useState('');
  const [newIssueClaim, setNewIssueClaim] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('400000')
  const [activityChoice, setActivityChoice] = useState('manageOtherFields');
  const [issueIdText, setIssueIdText] = useState('');
  const [claimText, setClaimText] = useState('');
  const [originalClaimText, setOriginalClaimText] = useState('');
  const [priorityText, setPriorityText] = useState('');
  const [originalPriorityText, setOriginalPriorityText] = useState('');
  const [availabilityChoice, setAvailabilityChoice] = useState('noChoiceYet');
  const [originalAvailabilityChoice, setOriginalAvailabilityChoice] = useState('noChoiceYet');

  const currentUserEmail = useAppSelector(selectCurrentUserCanonicalEmail)
  const allIssues: IssueType[] = useAppSelector(selectAllIssues);
  const issueMap = new Map();
  allIssues.forEach((issue) => issueMap.set(issue.issueId, issue))
  let idIssuePairs: IdIssuePairType[] = [];
  issueMap.forEach((value, key) => {
    const issueId = key;
    const issue = value;
    const struct = { issueId: issueId, issue: issue };
    idIssuePairs = idIssuePairs.concat(struct);
  });

  const handleNewIssueSubmission = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const priority = Number(newIssuePriority);
    const claim = newIssueClaim;
    if (!claim) {
      setToastMessage('You need to type a claim into the "Claim:" box');
      setShouldShowAcceptanceToast(true);
      return;
    }
    // GATOR: guard against setting a pro/conDocType when ther's no pro/conUrl
    const profferedProUrl = newIssueProUrl;
    const profferedConUrl = newIssueConUrl;
    const proUrl = profferedProUrl || PlaceholderForEmptyUrl;
    const conUrl = profferedConUrl || PlaceholderForEmptyUrl;
    const proDocType = proDocTypeChoice;
    const conDocType = conDocTypeChoice;
    const proAuthorEmail = '';
    const conAuthorEmail = '';
    const commentAuthorEmail = currentUserEmail;


    await createIssue(
      priority,
      claim,
      proUrl,
      conUrl,
      proDocType,
      conDocType,
      proAuthorEmail,
      conAuthorEmail,
      commentAuthorEmail,
    );
    setToastMessage('Your issue has been received');
    setShouldShowAcceptanceToast(true);
  };

  const handleClaimChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    setNewIssueClaim(event.target.value);
  }

  const handlePriorityChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setNewIssuePriority(event.target.value);
  }

  const handleProUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setNewIssueProUrl(event.target.value);
  }

  const handleConUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setNewIssueConUrl(event.target.value);
  }

  const handleProDocTpeChoiceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const choice = event.target.value;
    console.log(`Changing proDocTypeChoice to '${choice}'`)
    setProDocTypeChoice(choice);
  }

  const handleConDocTpeChoiceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const choice = event.target.value;
    setConDocTypeChoice(choice);
  }

  const handleActivityRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const choice = event.target.value;
    console.log(`activity choice: '${choice}.`)
    setActivityChoice(choice)
  }

  const handleIssueUrlsTileClick = (issue: IssueType) => {
    setIssueIdText(issue.issueId);
  }

  const handleIssueOtherFieldsTileClick = (issue: IssueType) => {
    setIssueIdText(issue.issueId);
    setClaimText(issue.claim)
    setOriginalClaimText(issue.claim);
    setPriorityText(issue.priority.toString());
    setOriginalPriorityText(issue.priority.toString());
    const availability = issue.isAvailable ? 'available' : 'unavailable';
    setAvailabilityChoice(availability);
    setOriginalAvailabilityChoice(availability);
  }

  const handleAvailabilityRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const choice = event.target.value;
    console.log(`availabillity choice: '${choice}'.`)
    setAvailabilityChoice(choice)
  }

  const handleOtherFieldsClearButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIssueIdText('');
    setClaimText('');
    setOriginalClaimText('');
    setPriorityText('');
    setOriginalPriorityText('');
    setAvailabilityChoice('noChoiceYet');
    setOriginalAvailabilityChoice('noChoiceYet'); 
  }
  
    const handleOtherFieldsSubmitButtonClick = async (event: SyntheticEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      console.log("Should now update the DB if anything changed")
      const issueId = issueIdText;
      if (!issueId) {
        alert('You can\'t submit without selecting an issue');
        return;
      }
  
      const availabilityChanged = availabilityChoice !== originalAvailabilityChoice;
      const claimChanged = claimText !== originalClaimText;
      const priorityChanged = priorityText !== originalPriorityText;
      const somethingChanged = availabilityChanged || claimChanged || priorityChanged;
      if (!somethingChanged) {
        alert('You haven\'t changed anything');
        return;
      }
  
      const haveClaim = claimText.length > 0;
      if (!haveClaim) {
        alert('You can\'t clear the claim. If you want to delete the issue, use the Delete button on the main Issues page');
        return;
      }
      const havePriorityString = priorityText.length > 0;
      if (!havePriorityString) {
        alert('You can\'t clear the priority. You must have a priority number');
        return;
      }
      const priorityAsInt = havePriorityString ?  parseInt(priorityText): -1;
      const shouldBeAvailable = availabilityChoice === 'available';
      const latestRow: IssueType = await getLatestRowWithIssueId(issueId);
      if (!latestRow) {
        alert("big screwup. getLatestRowWithIssueId() didn't return a row")
        throw new Error("big screwup. getLatestRowWithIssueId() didn't return a rpw");
      }
  
      const commentKey = latestRow.commentKey;
      let myUpdate =  {
        issueId: issueId,
        commentKey: commentKey,
        updatedT: new Date().toISOString(),
      };
      if (availabilityChanged) {
        const addition = { isAvailable: shouldBeAvailable};
        myUpdate = { ...myUpdate, ...addition }
      }
      if (claimChanged) {
        const addition = {claim: claimText};
        myUpdate = { ...myUpdate, ...addition }
      }
      if (priorityChanged) {
        const addition = { priority: priorityAsInt};
        myUpdate = { ...myUpdate, ...addition}
      }
  
      await dbClient.models.IssueP2.update(myUpdate).then(
            (response) => {
              // @ts-expect-error It will not be undefined if the .update() succeeded!
              const modifiedIssue: IssueType = response.data;
              const { issueId, commentKey } = modifiedIssue;
              // dispatch(setDesignatedUserId(id));
              console.log(`back from update({issueId: ${issueId}, commentKey: ${commentKey}})`);
              alert('Still need to modify Redux representation of issues');
              setToastMessage('Your update has been received');
              setShouldShowAcceptanceToast(true);
              setIssueIdText('');
              setClaimText('');
              setOriginalClaimText('');
              setPriorityText('');
              setOriginalPriorityText('');
              setAvailabilityChoice('noChoiceYet');
              setOriginalAvailabilityChoice('noChoiceYet');
            }
          );
    }

  const showNewIssueUi = activityChoice === 'createNewIssue';
  const showUrlsUi = activityChoice === 'manageUrls';
  const showOtherFieldsUi = activityChoice === 'manageOtherFields';

  return (
    <PageWrapper>
      <div>
        <div className="activityRadioButtonsDiv">
          <RadioGroupField
            legend="What do you want to do?"
            name="activityChoice"
            direction="row"
            value={activityChoice}
            onChange={handleActivityRadioButtonChange}
          >
            <div className="activityButtonsDiv">
              <Radio value="createNewIssue">&nbsp;Create a New Issue</Radio>
            </div>
            <div className="activityButtonsDiv">
              <Radio value="manageUrls">&nbsp;Manage pro/con URLs</Radio>
            </div>
            <div className="activityButtonsDiv">
              <Radio value="manageOtherFields">&nbsp;Manage other Issue properties</Radio>
            </div>
          </RadioGroupField>
        </div>
        {
          showUrlsUi &&
          (
            <Flex direction="column" className="otherFieldsFormDiv">
              <Flex direction="row">
                <div className="issueScrollDiv">{
                  idIssuePairs.map(pair => (
                    <IssueTile
                      key={pair.issueId}
                      issue={pair.issue}
                      selectionCallback={(event: SyntheticEvent<HTMLDivElement>) => {
                        event.stopPropagation();
                        handleIssueUrlsTileClick(pair.issue)
                      }} />
                    ))}
                </div>
                <Flex direction="column" gap="0px">
                  <div className="chosenIssueLabel">
                    chosen Issue ID:
                  </div>
                  <div className="chosenIssue">
                    <TextField
                      label=""
                      name=""
                      width="240px"
                      value={issueIdText}
                      readOnly
                      />
                </div>
                </Flex>
              </Flex>
              <Flex direction='row'>
                <div className="textFieldLabel">
                  Pro URL: 
                </div>
                <Flex direction="column">
                  <TextField label='' name='proUrl' value={newIssueProUrl} width='800px' onChange={handleProUrlChange}/>
                  <Flex direction={"row"}>
                    <RadioGroupField
                      legend="What kind of document?"
                      name="proDocTypeChoice"
                      direction="row"
                      value={proDocTypeChoice}
                      onChange={handleProDocTpeChoiceChange}
                    >
                      <Radio value={docType_YouTube}>YouTube Video</Radio>
                      <Radio value={docType_GoogleDoc}>Google Doc</Radio>
                      <Radio value={docType_Pdf}>Pdf</Radio>
                      <Radio value={docType_Unknown}>None of the above</Radio>
                    </RadioGroupField>
                  </Flex>
                </Flex>
              </Flex>
              <Flex>
                <div className="textFieldLabel">
                  Con URL: 
                </div>
                <Flex direction="column">
                  <TextField label='' name='conUrl' value={newIssueConUrl} width='800px' onChange={handleConUrlChange}/>
                  <RadioGroupField
                    legend="What kind of document?"
                    name="conDocTypeChoice"
                    direction="row"
                    value={conDocTypeChoice}
                    onChange={handleConDocTpeChoiceChange}
                  >
                    <Radio value={docType_YouTube}>YouTube Video</Radio>
                    <Radio value={docType_GoogleDoc}>Google Doc</Radio>
                    <Radio value={docType_Pdf}>Pdf</Radio>
                    <Radio value={docType_Unknown}>None of the above</Radio>
                  </RadioGroupField>
                </Flex>
              </Flex>
              <Flex direction="row">
                <div className="otherFieldsFormButtonsDiv">
                  <Button className="otherFieldsFormButton" onClick={handleOtherFieldsClearButtonClick}>
                    Clear
                  </Button>
                  <Button className="otherFieldsFormButton" onClick={handleOtherFieldsSubmitButtonClick}>
                    Submit
                  </Button>
                </div>
              </Flex>

              <div>

              </div>
            </Flex>
          )
        }
        {
          showNewIssueUi && 
          (
          <div className='otherFieldsFormRoot'>
            {/*<Flex as="form" direction='column' onSubmit={handleSubmit}>*/}
            <Flex direction='column'>
              <Flex className='urlsBlock' direction='column'>
                <Flex direction='row'>
                  <div className="textFieldLabel">
                    Claim: 
                  </div>
                  <TextAreaField
                    label=''
                    name='claim'
                    value={newIssueClaim} cols={50} rows={8}
                    onChange={handleClaimChange}
                    />
                  <div className="textFieldLabel">
                    Priority:
                  </div>
                  <TextField label='' name='priority' value={newIssuePriority} onChange={handlePriorityChange} width='140px'/>
                </Flex>
                <Flex direction='row'>
                  <div className="textFieldLabel">
                    Pro URL: 
                  </div>
                  <Flex direction="column">
                    <TextField label='' name='proUrl' value={newIssueProUrl} width='800px' onChange={handleProUrlChange}/>
                    <Flex direction={"row"}>
                      <RadioGroupField
                        legend="What kind of document?"
                        name="proDocTypeChoice"
                        direction="row"
                        value={proDocTypeChoice}
                        onChange={handleProDocTpeChoiceChange}
                      >
                        <Radio value={docType_YouTube}>YouTube Video</Radio>
                        <Radio value={docType_GoogleDoc}>Google Doc</Radio>
                        <Radio value={docType_Pdf}>Pdf</Radio>
                        <Radio value={docType_Unknown}>None of the above</Radio>
                      </RadioGroupField>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex>
                  <div className="textFieldLabel">
                    Con URL: 
                  </div>
                  <Flex direction="column">
                    <TextField label='' name='conUrl' value={newIssueConUrl} width='800px' onChange={handleConUrlChange}/>
                    <RadioGroupField
                      legend="What kind of document?"
                      name="conDocTypeChoice"
                      direction="row"
                      value={conDocTypeChoice}
                      onChange={handleConDocTpeChoiceChange}
                    >
                      <Radio value={docType_YouTube}>YouTube Video</Radio>
                      <Radio value={docType_GoogleDoc}>Google Doc</Radio>
                      <Radio value={docType_Pdf}>Pdf</Radio>
                      <Radio value={docType_Unknown}>None of the above</Radio>
                    </RadioGroupField>
                  </Flex>
                </Flex>
              </Flex>
              <Button width='200px' onClick={handleNewIssueSubmission}>
                Create New Issue
              </Button>
            </Flex>
          </div>
          )
        }
        {
          showOtherFieldsUi &&
          (
            <Flex direction="column" className="otherFieldsFormDiv">
              <Flex direction="row">
                <div className="issueScrollDiv">{
                  idIssuePairs.map(pair => (
                    <IssueTile
                      key={pair.issueId}
                      issue={pair.issue}
                      selectionCallback={(event: SyntheticEvent<HTMLDivElement>) => {
                        event.stopPropagation();
                        handleIssueOtherFieldsTileClick(pair.issue)
                      }} />
                    ))}
                </div>
                <Flex direction="column" gap="0px">
                  <div className="chosenIssueLabel">
                    chosen Issue ID:
                  </div>
                  <div className="chosenIssue">
                    <TextField
                      label=""
                      name=""
                      width="240px"
                      value={issueIdText}
                      readOnly
                      />
                </div>
                </Flex>
              </Flex>
              <Flex direction="row">
                <div className="claimLabelDiv">
                  claim:
                </div>
                <div className="claimDiv">
                  <TextField
                    label=""
                    name=""
                    value={claimText}
                    onChange={(e) => setClaimText(e.target.value)}
                    />
                </div>
              </Flex>
              <Flex direction="row">
                <div className="priorityLabelDiv">
                  priority:
                </div>
                <div className="priorityDiv">
                  <TextField
                    label=""
                    name=""
                    value={priorityText}
                    onChange={(e) => setPriorityText(e.target.value)}
                    />
                </div>
              </Flex>
              <Flex direction="row">
                <div className="availabilityLabel">
                  Availability:
                </div>
                <RadioGroupField
                  className="availabilityButtons"
                  legend=""
                  name="activityChoice"
                  direction="row"
                  value={availabilityChoice}
                  onChange={handleAvailabilityRadioButtonChange}
                >
                  <div className="availabilityButtonDiv">
                    <Radio value="available">&nbsp;Make Available</Radio>
                  </div>
                  <div className="availabilityButtonDiv">
                    <Radio value="unavailable">&nbsp;Make Unavailable</Radio>
                  </div>
                </RadioGroupField>
                <div className="otherFieldsFormButtonsDiv">
                  <Button className="otherFieldsFormButton" onClick={handleOtherFieldsClearButtonClick}>
                    Clear
                  </Button>
                  <Button className="otherFieldsFormButton" onClick={handleOtherFieldsSubmitButtonClick}>
                    Submit
                  </Button>
                </div>
              </Flex>

              <div>

              </div>
            </Flex>
          )
        }
      </div>
      <ToastNotifier
        message={toastMessage}
        shouldShow={shouldShowAcceptanceToast}
        showF={setShouldShowAcceptanceToast} />
    </PageWrapper>
  );
}

export default AdminIssuesPage;
