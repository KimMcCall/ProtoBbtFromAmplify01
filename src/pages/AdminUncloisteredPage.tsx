// AdminUncloisteredPage.tsx

import { Button, Flex, TextField } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { SyntheticEvent, useEffect, useState } from 'react';
import { dbClient } from "../main";
import './AdminUncloisteredPage.css';

type UrlSubmission = {
  issueId: string;
  docType: string;
  url: string;
  stance: string;
  submitterId: string;
  submitterEmail: string;
  submitterComment: string;
  issueClaim: string;
  reviewed: boolean;
  accepted: boolean;
  yucky: boolean;
  causedBanning: boolean;
  lifePhase: string;
  isCloistered: boolean;
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

interface MyTileProps {
  niceKey: string
  submission: UrlSubmission
}

let uncloisteredUrlSubmissions: UrlSubmission[] = []; // Initialize as empty array

function AdminUncloisteredPage() {
  const [chosenUncloisteredUrl, setChosenUncloisteredUrl] = useState<string>('');
  const [cloisteredUrl, setCloisteredUrl] = useState<string>('');
  const [chosenSubmissionId, setChosenSubmissionId] = useState<string>('');


  function MyTile(props: MyTileProps) {
    const { niceKey, submission } = props;

    const handleTileClick = (event: SyntheticEvent<HTMLDivElement>) => {
      event.stopPropagation();
      setChosenUncloisteredUrl(submission.url);
      setCloisteredUrl(''); // Clear cloistered URL field when a new uncloistered URL is chosen
      setChosenSubmissionId(submission.id);
    }

    const tileText = `${submission.stance} xxxx ${submission.issueClaim}`;

    return (
      <div key={niceKey} className="myTile" onClick={handleTileClick}>
        {tileText}
      </div>
    );
  }


  const handleSubmitCloisteredUrlClick = (event: SyntheticEvent<HTMLButtonElement>): void => {
    // Prevent default button behavior
    event.preventDefault();

    try {
      // Basic URL validation
      if (!cloisteredUrl) {
        console.error('Please enter a Cloistered URL');
        alert('Please enter a Cloistered URL');
        return;
      }

      // TODO: Add API call to save cloistered URL
      console.log('Submitting cloistered URL:', cloisteredUrl);
      dbClient.models.UrlSubmission.update({
        id: chosenSubmissionId,
        url: cloisteredUrl,
        isCloistered: true,
      });
      // Clear input fields after submission
      setChosenUncloisteredUrl('');
      setCloisteredUrl('');
      setChosenSubmissionId('');
      alert('Cloistered URL submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting cloistered URL:', error);
    }
  };

  useEffect(() => {
    const doFetchAndSort = async () => {
      // TODO: Fetch existing cloistered URLs on component mount
      const response = await dbClient.models.UrlSubmission.list();
      const allSubmissions = response?.data || [];
      console.log(`Fetched ${allSubmissions.length} total submissions from the database.`);
      uncloisteredUrlSubmissions = allSubmissions.filter((item) =>
         !item.isCloistered && item.docType === 'GoogleDoc');
      uncloisteredUrlSubmissions.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
      console.log(`Filtered to ${uncloisteredUrlSubmissions.length} uncloistered GoogleDoc submissions.`);
      // Force a re-render by updating state (if needed)
      setChosenSubmissionId('bogus'); // This is just to trigger a re-render; consider using a better state management approach
    };
    doFetchAndSort();
  }, []);

  return (
    <PageWrapper>
      <div>
        <Flex direction="column" justifyContent="center" alignItems="center" gap="1rem" wrap="wrap">
          <h2>Admin Uncloistered Page</h2>
          <div className="adminUncloisteredListDiv">
            {
            uncloisteredUrlSubmissions.map(sub => (
              <MyTile
                key={sub.id}
                niceKey={sub.id}
                submission={sub}
              />
          ))}
          </div>
          <div className="adminUncloisteredUrlsDiv">
            <TextField
              label='Uncloistered URL:'
              value={chosenUncloisteredUrl}
              readOnly
            />
          </div>
          <div className="adminCloisteredUrlsDiv">
            <TextField
              label='Cloistered URL:'
              value={cloisteredUrl}
              onChange={(e) => setCloisteredUrl(e.target.value)}
            /> {/* TextField for cloistered URL input */}
          </div>
          <div className="adminCloisteredButtonsDiv">
            {/* Action buttons for cloistered URL */}
            <Button onClick={handleSubmitCloisteredUrlClick}>Submit</Button>
          </div>
        </Flex>
        {/* Add your admin uncloistered page content here */}
      </div>
    </PageWrapper>
  );
}

export default AdminUncloisteredPage;
