// AdminUrlSubmissions.txt

import { Button, CheckboxField, Flex, TextField } from '@aws-amplify/ui-react';
import PageWrapper from '../components/PageWrapper'
import './AdminUrlSubmissions.css'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { dbClient } from '../main';

interface MyTileProps {
  niceKey: string
  submitterEmail: string
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

function AdminSubmissionsPage() {
  const [filterText, setFilterText] = useState('');
  const [chosenIssueId, setChosenIssueId] = useState('');
  const [justUnreviewed, setJustUnreviewed] = useState(false);
  const [allSubmissions, setAllSubmissions] = useState<UrlSubmission[]>([]);
  const [displaySubmission, setDisplaySubmission] = useState(false);

  const handleFilterTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setFilterText(event.target.value)
  }

  const testMsg = 'Some general claim that goes on and on and on and on and on and on for a while';
  const testComment = 'This is what the submitter wrote about their submission. It might be long or short.';
  function MyTile(props: MyTileProps) {
    const { niceKey, submitterEmail, issueId, issueClaim} = props;

    const handleTileClick = (event: SyntheticEvent<HTMLDivElement>) => {
      event.stopPropagation();
      console.log('Tile clicked:', event);
      setChosenIssueId(issueId)
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
                <MyTile
                  niceKey='123'
                  submitterEmail='info@example.com'
                  issueId='ISSUE#2025-09-15T06:01:26.304Z'
                  issueClaim={testMsg} />
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
                    {testComment}
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

export default AdminSubmissionsPage;
