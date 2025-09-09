import { Flex } from '@aws-amplify/ui-react';
import './SuggestionsPanel.css';
import SuggestionTile from './SuggestionTile';
import { useAppSelector } from '../app/hooks';
import { dbClient } from '../main';
import { selectUserId } from '../features/userInfo/userInfoSlice';
import { useEffect, useState, useMemo } from 'react';

type PropsToPropogateType = {
  id: string
  category: string
  content: string
}

function SuggestionsPanel() {
  const emptyProps = useMemo<PropsToPropogateType[]>(() => [], []);

  const [foundSubmissions, setFoundSubmissions] = useState<PropsToPropogateType[]>(emptyProps);

  const userId = useAppSelector(selectUserId) || 'fsda;lkjf-sdafhh_BOGUS'

  useEffect(() => {
    const fetchSubmissions = async () => {
      await dbClient.models.Submission.listByUserId({ userId: userId }).then(
      (response) => {
        const submissions = response.data;
        console.log(`found ${submissions.length} submissions for userId: ${userId}`);
        const prunedSubmissions: PropsToPropogateType[] = submissions.map((sub) => {
          return {
            id: sub.id,
            category: sub.category,
            content: sub.content,
          };
        })
        setFoundSubmissions(prunedSubmissions || emptyProps);
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
        gap="1rem"
      >
        {
        foundSubmissions.map(sub => (
        <SuggestionTile key={sub.id} suggestionId={sub.id} category={sub.category} content={sub.content} />
      ))}
      </Flex>
    </div>
  );
}

export default SuggestionsPanel;
