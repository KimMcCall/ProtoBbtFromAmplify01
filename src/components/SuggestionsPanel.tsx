import { useEffect, useState, useMemo } from 'react';
import { Flex } from '@aws-amplify/ui-react';
import SuggestionTile from './SuggestionTile';
import {SubmissionWithDateType as SubmissionType} from '../pages//AdminSubmissionsPage'
import { useAppSelector } from '../app/hooks';
import { dbClient } from '../main';
import { selectUserId } from '../features/userInfo/userInfoSlice';
import './SuggestionsPanel.css';

function SuggestionsPanel() {
  const emptyProps = useMemo<SubmissionType[]>(() => [], []);

  const [foundSubmissions, setFoundSubmissions] = useState<SubmissionType[]>(emptyProps);

  const userId = useAppSelector(selectUserId) || 'fsda;lkjf-sdafhh_BOGUS'

  useEffect(() => {
    const fetchSubmissions = async () => {
      await dbClient.models.Submission.listByUserId({ userId: userId }).then(
      (response) => {
        const submissions = response.data;
        console.log(`found ${submissions.length} submissions for userId: ${userId}`);
        setFoundSubmissions(submissions || emptyProps);
      }
    )
    };

    fetchSubmissions(); // Call the async function
  }, [emptyProps, userId]); 


  return (
    <div className="suggPanel">
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="left"
        wrap="nowrap"
        gap="8px"
      >
        {
        foundSubmissions.map(sub => (
        /*<SuggestionTile suggestionId={sub.id} category={sub.category} content={sub.content} />*/
        <SuggestionTile suggestion={sub} />
      ))}
      </Flex>
    </div>
  );
}

export default SuggestionsPanel;
