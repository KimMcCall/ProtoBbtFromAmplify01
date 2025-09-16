import { Button, CheckboxField, Flex, Radio, RadioGroupField, TextAreaField, TextField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import './AdminIssuesPage.css'
import { ChangeEvent, SetStateAction, SyntheticEvent, useState } from "react";
import { addCommentToIssue, createIssue, getAllRecordsForIssue } from "../utils/dynamodb_operations";
import { getRandomIntegerInRange } from "../utils/utils";
import ToastNotifier from "../components/ToastNotifier";
import { useAppDispatch } from "../app/hooks";
import { IssueType, setIssues } from "../features/issues/issues";
import { defaultClaim, defaultConAuthor, defaultConUrl, defaultIssueId, defaultPriority, defaultProAuthor, defaultProUrl } from "../utils/constants";

// Claim: There is no meaningful sense in which Tyler Robinson is left-wing. To claim that he is is irresponsible and intentionally divisive.
// Priority: 999000
// ProURL: {defaultProUrl}
// ConURL: {defaultConUrl}
  
const innerHandleSubmit = async (
  event: React.SyntheticEvent<HTMLFormElement>,
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

  /*
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
proUrl: {defaultProUrl}
updatedAt: "2025-09-15T06:01:27.289Z"
updatedT: "2025-09-15T06:01:26.304Z"
  */
    
  /*
    priority: number,
    claim: string,
    proUrl: string,
    conUrl: string,
    proIsPdf: boolean,
    conIsPdf: boolean,
    proAuthorId: string,
    conAuthorId: string,
    makeAvailable: boolean,
  */
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

const defaultComment = 'Here\'s a simple comment';
const maxCommentLength = 500;


function AdminIssuesPage() {
  const [toastMessage, setToastMessage] = useState('Sorry! You need to fill in at least one URL');
  const [shouldShowAcceptanceToast, setShouldShowAcceptanceToast] = useState(false);
  const [issueIdForComment, setIssueIdForComment] = useState(defaultIssueId);
  const [proConValue, setProConValue] = useState('pro');
  const [commentText, setCommentText] = useState(defaultComment);
  const [issueIdForRetrieval, setIssueIdForRetrival] = useState(defaultIssueId);

  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    innerHandleSubmit(event, setToastMessage, setShouldShowAcceptanceToast)
  };

  const handleCommentTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    const newText = event.target.value;
    if (newText.length <= maxCommentLength) {
      setCommentText(newText);
    } else {
      alert('You\'ve reached the maximum length of a comment');
    }
  };

  /*
    isPro: boolean,
    copiedIssueId: string,
    copiedClaim: string,
    copiedPriority: number,
    copiedProUrl: string,
    copiedConUrl: string,
    copiedProAuthorId: string,
    copiedConAuthorId: string,
    copiedProIsPdf: boolean,
    copiedConIsPdf: boolean,
    copiedMakeAvailable: boolean,
    commentText: string,
    authorId: string,
  */

  const handleAddCommentButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log('Hit handler');
    console.log(`should now add a comment with:`)
    console.log(`  issueId: ${issueIdForComment}`);
    console.log(`  isPro: ${proConValue === 'pro'}`);
    console.log(`  content: ${commentText}`);

    const isPro = proConValue === 'pro';
    const copiedIssueId = issueIdForComment;
    const copiedClaim = defaultClaim;
    const copiedPriority = defaultPriority;
    const copiedProUrl = defaultProUrl;
    const copiedConUrl = defaultConUrl;
    const copiedProAuthorId = defaultProAuthor;
    const copiedConAuthorId = defaultConAuthor;
    const copiedProIsPdf = false;
    const copiedConIsPdf = true;
    const copiedMakeAvailable = false;
    const authorId = "commentor@example.com";
    addCommentToIssue(
      isPro,
      copiedIssueId,
      copiedClaim,
      copiedPriority,
      copiedProUrl,
      copiedConUrl,
      copiedProAuthorId,
      copiedConAuthorId,
      copiedProIsPdf,
      copiedConIsPdf,
      copiedMakeAvailable,
      commentText,
      authorId
    );
  };

  const handleGetIssuesButtonClick = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    // @ts-expect-error I modified getAllRecordsForIssue to ensure priority !== null
    const allIssues: IssueType[] = await getAllRecordsForIssue(issueIdForRetrieval);
    console.log(`allIssues: ${allIssues}`)
    console.log(`nIssues: ${allIssues.length}`)
    dispatch(setIssues(allIssues));
  }

  const proUrl = defaultProUrl;
  const conUrl = defaultConUrl;

  return (
    <PageWrapper>
      <div>
        <div className='formRoot'>
          <Flex as="form" direction='column' onSubmit={handleSubmit}>
            <Flex className='urlsBlock' direction='column'>
              <Flex direction='row'>
                <div className="textFieldLabel">
                  Claim: 
                </div>
                <TextAreaField label='' name='claim' defaultValue={defaultClaim} cols={40} rows={4}/>
                <div className="textFieldLabel">
                  Priority:
                </div>
                <TextField label='' name='priority' defaultValue={defaultPriority} width='140px'/>
              </Flex>
              <Flex direction='row'>
                <div className="textFieldLabel">
                  Pro URL: 
                </div>
                <TextField label='' name='proUrl' defaultValue={proUrl} width='800px'/>
                <CheckboxField
                  label="isPdf"
                  name="proIsPdf"
                />
              </Flex>
              <Flex>
                <div className="textFieldLabel">
                  Con URL: 
                </div>
                <TextField label='' name='conUrl' defaultValue={conUrl} width='800px'/>
                <CheckboxField
                  label="isPdf"
                  name="conIsPdf"
                />
              </Flex>
            </Flex>
            <Button type="submit" width='200px'>
              Create New Issue
            </Button>
          </Flex>
        </div>
        <div className='formRoot2'>
          <Flex direction='column'>
            <Flex>
              <div className="textFieldLabel">
                issueId: 
              </div>
              <TextField
                className="issueIdInput"
                label=''
                name='issueId'
                value={issueIdForComment}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setIssueIdForComment(e.target.value)}
                direction="row"
                width="500px" />
            </Flex>
            <RadioGroupField
              legend="Pro or Con:"
              name="proConRadioGroup"
              value={proConValue}
              onChange={(e) => setProConValue(e.target.value)}
              direction="row">
              <Radio value="pro">Pro</Radio>
              <Radio value="con">Con</Radio>
            </RadioGroupField>
            <TextAreaField
              label='Comment:'
              name='commentText'
              value={commentText}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleCommentTextChange(e)}
              direction="row"
              rows={5}/>
            <Button onClick={(e) => handleAddCommentButtonClick(e)} width='200px'>
              Add New Comment
            </Button>
          </Flex>
        </div>
        <div className='formRoot2'>
          <Flex direction="row">
            <Button onClick={(e) => handleGetIssuesButtonClick(e)}>
              Get Issues
            </Button>
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
