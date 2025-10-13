// AdminUrlSubmissions.txt

import { Button, CheckboxField, Flex, TextAreaField, TextField } from '@aws-amplify/ui-react';
import PageWrapper from '../components/PageWrapper'
import './AdminUrlSubmissions.css'
import { ChangeEvent, SyntheticEvent, MouseEvent, useEffect, useState } from 'react';
import { dbClient } from '../main';
import { getLatestRowWithIssueId } from '../utils/utils';

interface MyTileProps {
  niceKey: string
  submission: UrlSubmission
}
interface PreviewUiProps {
  submission: UrlSubmission
}

interface UrlSubmission {
  id: string
  issueId: string
  docType: string
  url: string
  stance: string
  submitterId: string
  submitterEmail: string
  submitterComment: string
  issueClaim: string
  reviewed: boolean
  accepted: boolean
  yucky: boolean
  causedBanning: boolean
  lifePhase: string
}

function AdminUrlSubmissionsPage() {
  const [filterText, setFilterText] = useState('');
  const [chosenIssueId, setChosenIssueId] = useState('');
  const [chosenSubmission , setChosenSubmission] = useState<UrlSubmission | null>(null);
  const [chosenUserComment, setChosenUserComment] = useState('');
  const [allSubmissions, setAllSubmissions] = useState<UrlSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<UrlSubmission[]>([]);
  const [justUnreviewed, setJustUnreviewed] = useState(true);
  const [previewSubmission, setPreviewSubmission] = useState(false);
  const [banUser, setBanUser] = useState(false);

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setFilterText(event.target.value)
  }

  function MyTile(props: MyTileProps) {
    // const { niceKey, submitterEmail, submitterComment, issueId, issueClaim} = props;
    const { niceKey, submission } = props;
    const { submitterEmail, submitterComment, issueId, issueClaim, stance} = submission;

    const handleTileClick = (event: SyntheticEvent<HTMLDivElement>) => {
      event.stopPropagation();
      console.log('Tile clicked:', event);
      setChosenSubmission(submission);
      console.log('chosenSubmission.docType: ', chosenSubmission?.docType );
      console.log('submission.docType: ', submission?.docType );
      setChosenIssueId(issueId);
      setChosenUserComment(submitterComment);
    }

    let className = 'tileDiv';
    if (submission.lifePhase === 'Just Received') {
      className = 'tileDiv-new';
    } else if (submission.lifePhase === 'Under Review') {
      className = 'tileDiv-underReview';
    } else if (submission.lifePhase === 'Accepted') {
      className = 'tileDiv-accepted';
    } else if (submission.lifePhase === 'Rejected') {
      className = 'tileDiv-rejected';
    } else if (submission.reviewed) {
      className = 'tileDiv-reviewed';
    }
    // I think there's one more reasonable lifePhase value, namely 'Reviewed' 

    return(
      <div key={niceKey} className={className} onClick={handleTileClick}>
        <Flex direction='row'>
          <div className='tileStanceDiv'>
            {stance}
          </div>
          <div className='tileEmailDiv'>
            {submitterEmail}
          </div>
          <div className='tileClaimDiv'>
            {issueClaim}
          </div>
        </Flex>
      </div>
    )
  }

  function handlePreviewSubmissionButtonClicked(event: SyntheticEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!chosenIssueId) {
      alert('Please select a submission from the list first.');
      return;
    }
    setPreviewSubmission(true);
  }

  useEffect(
    () => {
      const fetchData = async () => {
        console.log(`DBM: calling UrlSubmission.list() at ${Date.now() % 10000}`);
        await dbClient.models.UrlSubmission.list().then((response) => {
          console.log('Fetched UrlSubmissions:', response.data);
          setAndFilterSubmissions(response.data);
        }).catch((error) => {
          console.error('Error fetching UrlSubmissions:', error);
        });
      };
      fetchData();
    }
  );

  const showChooseUri = !previewSubmission;

  const setAndFilterSubmissions = (submissions: UrlSubmission[]) => {
    setAllSubmissions(submissions);
    console.log(`justUnreviewed is: ${justUnreviewed}`);
    console.log(`filterText is: '${filterText}'`);
    console.log(`Total submissions count: ${submissions.length}`);
    // Apply filtering based on justUnreviewed and filterText
    let filtered = submissions;
    if (justUnreviewedVar) {
      filtered = filtered.filter((submission) => !submission.reviewed);
    }
    console.log(`Submissions count after justUnreviewed filter: ${filtered.length}`);
    if (filterText.trim() !== '') {
      const lowerFilterText = filterText.toLowerCase();
      filtered = filtered.filter((submission) =>
        submission.submitterEmail.toLowerCase().includes(lowerFilterText) ||
        submission.issueId.toLowerCase().includes(lowerFilterText) ||
        submission.issueClaim.toLowerCase().includes(lowerFilterText)
      );
    }
    console.log(`Submissions count after filterText filter: ${filtered.length}`);
    setFilteredSubmissions(filtered);
  }

  function handleBanStateChange(event: ChangeEvent<HTMLInputElement>): void {
    event.stopPropagation();
    const shouldBanUser = event.target.checked;
    setBanUser(shouldBanUser);
  }

  let justUnreviewedVar = justUnreviewed;

  function handleJustUnreviewedChange(event: ChangeEvent<HTMLInputElement>): void {
    event.stopPropagation();
    // This would typically update some state variable to track if the justUnreviewed checkbox is checked
    const newJustUnreviewedState = event.target.checked;
    console.log(`Just Unreviewed checkbox changed to: ${newJustUnreviewedState}`);
    console.log(`Calling setJustUnreviewed(${newJustUnreviewedState})`);
    setJustUnreviewed(newJustUnreviewedState);
    justUnreviewedVar = newJustUnreviewedState;
    // Note: React state updates are asynchronous, so justUnreviewed won't reflect the new value immediately after setJustUnreviewed
    // Hence, we use justUnreviewedVar to hold the intended new state for filtering
    console.log(`After call to setJustUnreviewed, justUnreviewed is: ${justUnreviewedVar}`);
    // Re-filter the submissions based on the new state
    setAndFilterSubmissions(allSubmissions);
  }

  function Preview(props: PreviewUiProps) {
    const { submission } = props;

    const handleAcceptSubmission = async (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      if (!submission) return;

      try {
        // First update the submission to mark it as reviewed and accepted
      console.log(`DBM: calling UrlSubmission.update() at ${Date.now() % 10000}`);
      const updatedSubmission = await dbClient.models.UrlSubmission.update({
        id: submission.id,
        reviewed: true,
        accepted: true,
        lifePhase: 'Accepted',
      });
      
      // Next update the Issue to set the proUrl or conUrl based on the stance
      const latestRow = await getLatestRowWithIssueId(submission.issueId);
      const latestCommentKey = latestRow ? latestRow.commentKey : 'NoCommentsYet_8e1f3b3c-2f4e-4f7a-9d5a-1c2e3f4g5h6i';
      console.log('Latest commentKey for issueId', submission.issueId, 'is:', latestCommentKey);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const issueUpdateData: any = {};
      issueUpdateData.updatedT = new Date().toISOString();
      if (submission.stance === 'pro') {
        issueUpdateData.proUrl = submission.url;
        issueUpdateData.proDocType = submission.docType;
        issueUpdateData.proAuthorEmail = submission.submitterEmail;
      } else if (submission.stance === 'con') {
        issueUpdateData.conUrl = submission.url;
        issueUpdateData.conDocType = submission.docType;
        issueUpdateData.conAuthorEmail = submission.submitterEmail;
      }
      const issueUpdateDataWithIssueId = {
        issueId: submission.issueId,
        // I think CoPilot is wrong here:  Required field, but not used in update
        commentKey: latestCommentKey, // Placeholder, should be the latest comment key
        ...issueUpdateData,
      };
      console.log(`DBM: calling IssueP2.update() at ${Date.now() % 10000}`);
      await dbClient.models.IssueP2.update(issueUpdateDataWithIssueId)

      // GATOR: If banUser is true, you would also update the user's status here
      console.log('Submission accepted:', updatedSubmission);
      alert('Submission accepted');
      
      // Reset states
      setPreviewSubmission(false);
      setChosenSubmission(null);
      setBanUser(false);
      setJustUnreviewed(true);
      
      // Refresh the submissions list
      console.log(`DBM: calling UrlSubmission.list() at ${Date.now() % 10000}`);
      const response = await dbClient.models.UrlSubmission.list();
      setAndFilterSubmissions(response.data);
      } catch (error) {
      console.error('Error accepting submission:', error);
      alert('Failed to accept submission');
      }
    }

    async function handleRejectSubmission(event: MouseEvent<HTMLButtonElement>) {
      event.stopPropagation();
      if (!submission) return;

      try {
          // First update the submission to mark it as reviewed and accepted
          console.log(`DBM: calling UrlSubmission.update() at ${Date.now() % 10000}`);
          await dbClient.models.UrlSubmission.update({
            id: submission.id,
            reviewed: true,
            accepted: false,
            causedBanning: banUser,
            lifePhase: 'Rejected',
          });

          // Then, if user is being banned, update the entry in the RegisteredUser table
          if (banUser) {
              console.log(`DBM: calling RegisteredUser.update() at ${Date.now() % 10000}`);
              const result = await dbClient.models.RegisteredUser.update({
                id: submission.submitterId,
                isBanned: true,
              });
              const bannedUser = result.data;
              console.log('User banned:', bannedUser);
            }
        } catch (error) {
          console.error('Error accepting submission:', error);
          alert('Failed to accept submission');
        }
    }

    return (
          <Flex className='previewAndButtonsFlex' direction='column' justifyContent='space-between' gap='0px'>
            <Flex className='previewAndFeedbackFlex' direction='row' justifyContent='space-between' gap='1px'>
              <div className='previewDiv'>

        {
          submission.docType === 'YouTube' && 
          (
                <iframe
                  src={submission.url}
                  width= "850px"
                  height="660px"
                  title='YouTube Video'
                  >
                  </iframe>
          )
        }

        {
          submission.docType === 'GoogleDoc' && 
          (
                <iframe
                  src={submission.url}
                  width= "850px"
                  height="660px"
                  title='Google Document'
                  >
                  </iframe>
          )
        }

        {
          (submission.docType === 'Pdf' || submission.docType === 'PDF') && 
          (
                <embed
                  src={submission.url}
                  type="application/pdf"
                  width="832px"
                  height="642px" />
          )
        }

              </div>
              <Flex className='previewButtonColumn' direction={'column'}>
                <Button onClick={() => {setPreviewSubmission(false); setChosenSubmission(null);}}>Back to List</Button>
                <div className='actionButtonsDiv'>
                  <Button onClick={handleAcceptSubmission}>Accept</Button>
                  <Button onClick={handleRejectSubmission}>Reject</Button>
                  <div className='banCheckboxDiv'>
                    <CheckboxField
                      label='and ban submitter'
                      labelPosition='end'
                      name='markBanned'
                      checked={banUser}
                      onChange={handleBanStateChange}
                    />
                  </div>
                </div>
                <Button>Mark Reviewed</Button>
                <Button>Mark Yucky</Button> 
              </Flex>
            </Flex>
            <Flex className='feedbackFlex' direction='row' justifyContent='space-between' gap='1px'>
              <div className='feedbackDiv'>
                <TextAreaField
                  label=''
                  direction="column"
                  placeholder='Enter feedback here...'
                  rows={3}
                  cols={93}
                />
              </div>
              <div className='adminNotesDiv'>
                <Button>Send Feedback</Button>
              </div>
            </Flex>
          </Flex>
    );
  }

  return (
    <PageWrapper>
     {
       showChooseUri &&
      (
        <div className='adminSubmissionsPageRoot'>
          <h2>Administer Submitted URLs</h2>
          <Flex direction='row'>
            <Flex direction='column'>
              <Flex direction='row'>
                <Flex direction='column'>
                  <div>
                    Filter:
                  </div>
                  <TextField className='filterTextField'
                    label=''
                    direction='column'
                    value={filterText}
                    onChange={handleFilterTextChange}
                    />
                </Flex>
                <div className='justUnreviewedCheckboxDiv'>
                  <CheckboxField
                    label='Just Unreviewed'
                    labelPosition='end'
                    name='justUnreviewed'
                    checked={justUnreviewed}
                    onChange={handleJustUnreviewedChange}
                  />
                </div>
              </Flex>
              <div className='urlSubmissionListDiv'>
                {
                  filteredSubmissions.map((submission) => (
                    <MyTile
                      key={submission.id}
                      niceKey={submission.id}
                      submission={submission}
                      />
                    )
                  )
                }
              </div>
            </Flex>
              <Flex direction='column'>
                <div className='issueIdDiv'>
                  <div>
                    Issue ID:
                  </div>
                  <TextField
                    className='issueIdTextField'
                    label=''
                    direction='column'
                    value={chosenIssueId}
                    readOnly={true}
                  />
                  <div className='submitterCommentDiv'>
                    {chosenUserComment}
                  </div>
                </div>
              </Flex>
          </Flex>
          <div className='displayUiButtonDiv'>
            <Button onClick={handlePreviewSubmissionButtonClicked}>Preview Submission</Button>
          </div>
        </div>
      )
    }
    {
       previewSubmission && chosenSubmission &&
      (
        <div className='adminSubmissionsPageRoot'>
          <Preview submission={chosenSubmission} />
        </div>
      )
    }
    </PageWrapper>
  )
}

export default AdminUrlSubmissionsPage;
