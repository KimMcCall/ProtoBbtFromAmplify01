import { Button, Flex, Radio, RadioGroupField, TextAreaField, TextField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminIssuesPage.css'
import { ChangeEvent, SetStateAction, SyntheticEvent, useState } from "react";
import { createIssueXP2 } from "../utils/dynamodb_operations";
import ToastNotifier from "../components/ToastNotifier";
import { defaultIssueId, docType_GoogleDoc, docType_Pdf, docType_Unknown, docType_YouTube, PlaceholderForEmptyUrl } from "../utils/constants";
import { selectCurrentUserCanonicalEmail } from "../features/userInfo/userInfoSlice";
import { useAppSelector } from "../app/hooks";

// Claim: There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive.
// Priority: 999000
// ProURL: {ProxyForNoUrl}
// ConURL: {ProxyForNoUrl}
  
/*
const innerHandleSubmit = async (
  event: SyntheticEvent<HTMLFormElement>,
  toastSetter: { (value: SetStateAction<string>): void; (arg0: string): void; },
  toastShower: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
  event.preventDefault(); // Prevent default form submission behavior
  // Handle form data here, e.g., send to an API or update state
  const form: HTMLFormElement = event.currentTarget
  const formData = new FormData(form);
  const formJson = Object.fromEntries(formData.entries());
  const submittedClaim = formJson.claim;
  const convertedClaim = submittedClaim.toString();
  if (convertedClaim.length === 0) {
    toastSetter('Sorry! You need to fill in the "Claim:" field');
    toastShower(true);
    return;
  }
  const submittedPriority = formJson.priority;
  const convertedPriority = submittedPriority.toString();
  const priority = convertedPriority ? Number(convertedPriority) : getRandomIntegerInRange(1, 1000000);
  const submittedProUrl = formJson.proUrl;
  const convertedProUrl = submittedProUrl.toString();
  const submittedConUrl = formJson.conUrl;
  const convertedConUrl = submittedConUrl.toString();
  if (convertedConUrl.length === 0 && convertedProUrl.length ===0) {
    toastSetter('Sorry! You need to fill in at least one URL');
    toastShower(true);
    return;
  }
  const submittedProIsPdf = formJson.proIsPdf;
  let proIsPdf = false;
  let conIsPdf = false;
  if (submittedProIsPdf) {
    const convertedProIsPdf = submittedProIsPdf.toString();
    proIsPdf = convertedProIsPdf === 'on';
  }
  const submittedConIsPdf = formJson.conIsPdf;
  if (submittedConIsPdf) {
    const convertedConIsPdf = submittedConIsPdf.toString();
    conIsPdf = convertedConIsPdf === 'on';
  }

  Structure of what gets created (and returned from create())
authorId: ""
claim: "There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive."
commentId: ""
commentKey: "PRO#"
commentText: ""
commentType: "PRO"
conAuthorId: "denier@example.com"
conIsPdf: true
conUrl: defaultConUrl
createdAt: "2025-09-15T06:01:27.289Z"
createdT: "2025-09-15T06:01:26.304Z"
issueId: "ISSUE#2025-09-15T06:01:26.304Z"
makeAvailable: false
priority: defaultPriority
proAuthorId: defaultProAuthor
proIsPdf: false
proUrl: {ProxyForNoUrl}
updatedAt: "2025-09-15T06:01:27.289Z"
updatedT: "2025-09-15T06:01:26.304Z"
    
    priority: number,
    claim: string,
    proUrl: string,
    conUrl: string,
    proIsPdf: boolean,
    conIsPdf: boolean,
    proAuthorId: string,
    conAuthorId: string,
    makeAvailable: boolean,
  await createIssue(
    priority,
    convertedClaim,
    convertedProUrl,
    convertedConUrl,
    proIsPdf,
    conIsPdf,
    defaultProAuthor,
    defaultConAuthor,
    false, // makeAvailable.  We'll set this later.
  );
  toastSetter('Your issue has been received');
  toastShower(true);
};
*/

function AdminIssuesPage() {
  const [toastMessage, setToastMessage] = useState('Sorry! You need to fill in at least one URL');
  const [shouldShowAcceptanceToast, setShouldShowAcceptanceToast] = useState(false);
  const [issueIdForRetrieval, setIssueIdForRetrival] = useState(defaultIssueId);
  const [proDocTypeChoice, setProDocTypeChoice] = useState(docType_Unknown);
  const [conDocTypeChoice, setConDocTypeChoice] = useState(docType_Unknown);
  const [newIssueProUrl, setNewIssueProUrl] = useState('');
  const [newIssueConUrl, setNewIssueConUrl] = useState('');
  const [newIssueClaim, setNewIssueClaim] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('400000')

  const currentUserEmail = useAppSelector(selectCurrentUserCanonicalEmail)

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


  await createIssueXP2(
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

  return (
    <PageWrapper>
      <div>
        <div className='formRoot'>
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
                      <Radio value={docType_Unknown}>`None of the above</Radio>
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
        <div className='formRoot2'>
          <Flex direction="row">
            <TextField
              className="issueIdInput"
              label='issueId:'
              name='issueId'
              value={issueIdForRetrieval}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setIssueIdForRetrival(e.target.value)}
              direction="row"
              width="500px" />
          </Flex>
        </div>
      </div>
      <ToastNotifier
        message={toastMessage}
        shouldShow={shouldShowAcceptanceToast}
        showF={setShouldShowAcceptanceToast} />
    </PageWrapper>
  );
}

export default AdminIssuesPage;
