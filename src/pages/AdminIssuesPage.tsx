import { Button, Flex, Radio, RadioGroupField, TextAreaField, TextField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminIssuesPage.css'
import { ChangeEvent, SetStateAction, SyntheticEvent, useState } from "react";
import { createIssue } from "../utils/dynamodb_operations";
import ToastNotifier from "../components/ToastNotifier";
import { docType_GoogleDoc, docType_Pdf, docType_Unknown, docType_YouTube, PlaceholderForEmptyUrl } from "../utils/constants";
import { selectCurrentUserCanonicalEmail } from "../features/userInfo/userInfoSlice";
import { useAppSelector } from "../app/hooks";
import { IssueType, selectAllIssues } from "../features/issues/issues";
import { getLatestRowWithIssueId } from "../utils/utils";
import { dbClient } from "../main";

// Claim: There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive.
// Priority: 999000
// ProURL: {ProxyForNoUrl}
// ConURL: {ProxyForNoUrl}

interface ImageTilePropsType {
  issueId: string
  claim: string
  selectionCallback: (e: SyntheticEvent<HTMLDivElement>, issueId: string) => void
}

interface IdClaimPairType {
  issueId: string
  claim: string
}

function IssueTile(props: ImageTilePropsType) {
  const { issueId, claim, selectionCallback } = props;

  const handleTileClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();
    selectionCallback(event, issueId);
  }

  return(
    <div key={issueId} className="issueTileRoot" onClick={handleTileClick}>
      {claim}
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
  const [priorityText, setPriorityText] = useState('');
  const [availabilityChoice, setAvailabilityChoice] = useState('noChoiceYet');

  const currentUserEmail = useAppSelector(selectCurrentUserCanonicalEmail)
  const allIssues: IssueType[] = useAppSelector(selectAllIssues);
  const issueMap = new Map();
  allIssues.forEach((issue) => issueMap.set(issue.issueId, issue.claim))
  let idClaimPairs: IdClaimPairType[] = [];
  issueMap.forEach((value, key) => {
    const issueId = key;
    const claim = value;
    const struct = { issueId: issueId, claim: claim };
    idClaimPairs = idClaimPairs.concat(struct);
  });
  console.log(`# idClaimPairs: ${idClaimPairs.length}`)
  console.log(idClaimPairs);

  const handleControlledNewIssueSubmission = (event: SyntheticEvent<HTMLButtonElement>) => {
    handleControlledNewIssueSubmission2(event, setToastMessage, setShouldShowAcceptanceToast)
  };

const handleControlledNewIssueSubmission2 = async (
    event: SyntheticEvent<HTMLButtonElement>,
    toastSetter: { (value: SetStateAction<string>): void; (arg0: string): void; },
    toastShower: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  event.stopPropagation();
  const priority = Number(newIssuePriority);
  const claim = newIssueClaim;
  if (!claim) {
    alert('You need to type a claim into the "Claim:" box');
    toastSetter('You need to type a claim into the "Claim:" box');
    toastShower(true);
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
  toastSetter('Your issue has been received');
  toastShower(true);
}

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

  const handleIssueTileClick = (event: SyntheticEvent<HTMLDivElement>, issueId: string) => {
    event.stopPropagation();
    setIssueIdText(issueId);
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
    setPriorityText('');
    setAvailabilityChoice('noChoiceYet')
  }
  
    const handleOtherFieldsSubmitButtonClick = async (event: SyntheticEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      console.log("Should now update the DB")
      const issueId = issueIdText;
      if (!issueId) {
        alert('You can\'t submit without selecting an issue');
        return;
      }
  
      const availability = availabilityChoice; // 'available', 'unavailable', or 'noChoiceYet'
      if (availability === 'noChoiceYet') {
        alert('You have to choose either "Make Available" or "Make Unavailable"');
        return;
      }
  
      const claim = claimText;
      const priorityString = priorityText;
      const haveClaim = claim.length > 0;
      const havePriorityString = priorityString.length > 0;
      const priority = havePriorityString ?  parseInt(priorityString): -1;
      const shouldBeAvailable = availability === 'available';
      const latestRow: IssueType = await getLatestRowWithIssueId(issueId);
      if (!latestRow) {
        alert("big screwup. getLatestRowWithIssueId() didn't return a row")
        throw new Error("big screwup. getLatestRowWithIssueId() didn't return a rpw");
      }
  
      const commentKey = latestRow.commentKey;
      let myUpdate =  {
        issueId: issueId,
        commentKey: commentKey,
        isAvailable: shouldBeAvailable,
      };
      if (haveClaim) {
        const addition = {claim: claim};
        myUpdate = { ...myUpdate, ...addition }
      }
      if (havePriorityString) {
        const addition = { priority: priority};
        myUpdate = { ...myUpdate, ...addition}
      }
  
      await dbClient.models.IssueP2.update(myUpdate).then(
            (response) => {
              // @ts-expect-error It will not be undefined if the .update() succeeded!
              const modifiedIssue: IssueType = response.data;
              const { issueId, commentKey } = modifiedIssue;
              // dispatch(setDesignatedUserId(id));
              console.log(`back from update({issueId: ${issueId}, commentKey: ${commentKey}})`);
            }
          );
    }

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
              <Radio value="manageUrls">Manage pro/con URLs</Radio>
            </div>
            <div className="activityButtonsDiv">
              <Radio value="manageOtherFields">Manage other Issue properties</Radio>
            </div>
          </RadioGroupField>
        </div>
        {
          showUrlsUi &&
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
                    <Flex direction={"rpw"}>
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
              <Button width='200px' onClick={handleControlledNewIssueSubmission}>
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
                  idClaimPairs.map(pair => (
                    <IssueTile
                      key={pair.issueId}
                      issueId={pair.issueId}
                      claim={pair.claim}
                      selectionCallback={handleIssueTileClick} />
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
