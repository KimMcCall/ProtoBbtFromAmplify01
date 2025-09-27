// AdminUrlSubmissions.txt

import { Button, CheckboxField, Flex, TextField } from '@aws-amplify/ui-react';
import PageWrapper from '../components/PageWrapper'
import './AdminUrlSubmissions.css'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { dbClient } from '../main';

interface MyTileProps {
  niceKey: string
  submitterEmail: string
  submitterComment: string
  issueId: string
  issueClaim: string
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
  const [chosenUserComment, setChosenUserComment] = useState('');
  const [justUnreviewed, setJustUnreviewed] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<UrlSubmission[]>([]);
  const [displaySubmission, setDisplaySubmission] = useState(false);

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setFilterText(event.target.value)
  }

  function MyTile(props: MyTileProps) {
    const { niceKey, submitterEmail, submitterComment, issueId, issueClaim} = props;

    const handleTileClick = (event: SyntheticEvent<HTMLDivElement>) => {
      event.stopPropagation();
      console.log('Tile clicked:', event);
      setChosenIssueId(issueId);
      setChosenUserComment(submitterComment);
    }

    return(
      <div key={niceKey} className='tileDiv' onClick={handleTileClick}>
        <Flex direction='row'>
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

  function handleDisplaySubmissionButtonClicked(event: SyntheticEvent<HTMLButtonElement>) {
    event.stopPropagation();
    console.log('should display submission w/ issueId:', chosenIssueId);
    setDisplaySubmission(true);
  }

  useEffect(
    () => {
      const fetchData = async () => {
        await dbClient.models.UrlSubmission.list().then((response) => {
          console.log('Fetched UrlSubmissions:', response.data);
          setAllSubmissions(response.data);
        }).catch((error) => {
          console.error('Error fetching UrlSubmissions:', error);
        });
      };
      fetchData();
    },
    []
  );

  const showChooseUri = !displaySubmission;

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
                    onChange={(e) => {setJustUnreviewed(e.target.checked)}}
                  />
                </div>
              </Flex>
              <div className='urlSubmissionListDiv'>
                {
                  allSubmissions.map((submission) => (
                <MyTile
                  key={submission.id}
                  niceKey={submission.id}
                  submitterEmail={submission.submitterEmail}
                  submitterComment={submission.submitterComment}
                  issueId={submission.issueId}
                  issueClaim={submission.issueClaim} />
                  ))
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
            <Button onClick={handleDisplaySubmissionButtonClicked}>Display Submission</Button>
          </div>
        </div>
      )
    }
    {
       displaySubmission &&
      (
        // UI to display if displaySubmission is true
        <p>This is displayed when displaySubmission is true.</p>
      )
    }


    </PageWrapper>
  )
}

export default AdminUrlSubmissionsPage;
