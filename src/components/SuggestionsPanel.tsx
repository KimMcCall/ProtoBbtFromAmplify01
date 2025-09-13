import { useEffect, useState, useMemo } from 'react';
import { Flex } from '@aws-amplify/ui-react';
import SubmissionEditor from './SubmissionEditor';
import SuggestionTile from './SuggestionTile';
import {SubmissionWithDateType as SubmissionType} from '../pages//AdminSubmissionsPage'
import { useAppSelector } from '../app/hooks';
import { dbClient } from '../main';
import { selectUserId } from '../features/userInfo/userInfoSlice';
import './SuggestionsPanel.css';

function SuggestionsPanel() {
  const emptyProps = useMemo<SubmissionType[]>(() => [], []);

  const [showEditor, setShowEditor] = useState(false);
  const [foundSubmissions, setFoundSubmissions] = useState<SubmissionType[]>(emptyProps);
  const [chosenSuggestion, setChosenSuggestion] = useState<SubmissionType>();

  const primitiveSuggestion = {
    id: '',
    userId: '',
    // sender: string;
    category: '',
    title: '',
    content: '',
    createdAt: '',
    isRead: false,
    isImportant: false,
    isStarred: false,
    isArchived: false,
    isBanned: false,
    isTrashed: false,

  };

  const userId = useAppSelector(selectUserId) || 'fsda;lkjf-sdafhh_BOGUS';

  useEffect(() => {
    const fetchSubmissions = async () => {
      await dbClient.models.Submission.listByUserId({ userId: userId }).then(
      (response) => {
        const submissions = response.data;
        // console.log(`found ${submissions.length} submissions for userId: ${userId}`);
        setFoundSubmissions(submissions || emptyProps);
      }
    )
    };

    fetchSubmissions(); // Call the async function
  }, [emptyProps, userId]);

  const setSelectionCallback = (submission: SubmissionType) => {
    setChosenSuggestion(submission);
  };

  const submissionToUse = chosenSuggestion || primitiveSuggestion;

  return (
    <div>
      { showEditor ?
        (
          <SubmissionEditor submission={submissionToUse} editorShowOrHide={setShowEditor}/>
        )
        :
        (
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
              <SuggestionTile suggestion={sub} submissionSetter={setSelectionCallback} editorSetter={setShowEditor} />
            ))}
            </Flex>
          </div>
        )
    }

      
    </div>
  );
}

export default SuggestionsPanel;
