import { Button, Flex, Tabs, TextAreaField, TextField } from '@aws-amplify/ui-react';
import PageWrapper from '../components/PageWrapper';
import SuggestionsPanel from '../components/SuggestionsPanel';
import { clearCurrentUserInfo, selectCurrentUserId } from '../features/userInfo/userInfoSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { dbClient } from '../main';
import { SyntheticEvent, useState } from 'react';
import ToastNotifier from '../components/ToastNotifier';
import { checkForPermissionToSubmitText, tallySubmission } from '../utils/utils';
import './SuggestionsPage.css'
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function SuggestionsPage() {
  const [siteTitle, setSiteTitle] = useState('');
  const [siteText, setSiteText] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [topicText, setTopicText] = useState('');
  const [shouldShowAcceptanceToast,setShouldShowAcceptanceToast ] = useState(false);
  const [toastMessage, setToastMessage] = useState('Your suggestion has been received');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUserId =  useAppSelector(selectCurrentUserId);

  const handleSiteSubmitControlled = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default form submission behavior (which might not matter, now that we're controlled)
    const activity = 'Making Site Suggestion';
    const permissionQResult = await checkForPermissionToSubmitText(activity, currentUserId, siteText);
    if (!permissionQResult.granted){
      if (permissionQResult.explanation.includes('policy conformance check failed')) {
        await signOut();
        dispatch(clearCurrentUserInfo());
        navigate('/banned');
      }
      return;
    }
    await handleSubmitControlled('Site Suggestion', siteTitle, siteText);
    setSiteTitle('');
    setSiteText('');
  };

  const handleTopicSubmitControlled = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default form submission behavior (which might not matter, now that we're controlled)
    const activity = 'Suggesting Topic';
    const permissionQResult = await checkForPermissionToSubmitText(activity, currentUserId, topicText);
    if (!permissionQResult.granted){
      if (permissionQResult.explanation.includes('policy conformance check failed')) {
        await signOut();
        dispatch(clearCurrentUserInfo());
        navigate('/banned');
      }
      return;
    }
    await handleSubmitControlled('Topic Suggestion', topicTitle, topicText);
    setTopicTitle('');
    setTopicText('');
  };

  const handleSubmitControlled = async (category: string, title: string, text: string) => {
    const structToCreate = {
      userId: currentUserId,
      category: category,
      title: title,
      content: text,
      isRead: false,
      isStarred: false,
      isImportant: false,
      isArchived: false,
      isBanned: false,
      isTrashed: false,
    };
    console.log(`DBM: calling Submission.create() at ${Date.now() % 10000}`);
    await dbClient.models.Submission.create(structToCreate);
    setToastMessage('Your suggestion has been received');
    setShouldShowAcceptanceToast(true);
    tallySubmission(currentUserId);
  }

  return (
    <PageWrapper>
      <Tabs.Container defaultValue="1">
        <Tabs.List justifyContent="space-around">
          <Tabs.Item value="1">Suggestion for Site</Tabs.Item>
          <Tabs.Item value="2">Suggest New Topic</Tabs.Item>
          <Tabs.Item value="3">Review/Edit your Suggestions</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel className='suggestionPanel' value="1">
          <div>
            <h2>Suggestion for Site</h2>
            <p>Please share with us any suggestions you have about how to improve this web site.
              Thank you!<br />&nbsp;</p>
            <p className='policyP'>
              Note: We insist that all postings on or to this site be respectful and non-abusive.
              Site administrators reserve the right to summarily ban anyone who submits
              vulgar, hateful, name-calling, or otherwise abusive content.
              See our <a href="/policy">Non-abuse Policy</a>.
            </p>
            <Flex direction="column">
              <TextField
                label='Title (optional):'
                name='title'
                value={siteTitle}
                onChange={(e) => {
                  setSiteTitle(e.target.value);
                }}
              />
              <TextAreaField 
                label=''
                name="suggestion"
                value={siteText}
                onChange={(e) => {
                  setSiteText(e.target.value);
                }}
                rows={13} cols={120} />
              <Button onClick={handleSiteSubmitControlled}>Submit Site Suggestion</Button>
            </Flex>
          </div>
        </Tabs.Panel>
        <Tabs.Panel className='suggestionPanel' value="2">
          <div>
            <h2>Suggest New Topic</h2>
            <p>Please share with us any suggestions for new topics on which we might fruitfully
              promote a truth-based narrative.</p>
            <br />
            <p className='policyP'>
              Note: We insist that all postings on or to this site be respectful and non-abusive.
              Site administrators reserve the right to summarily ban anyone who submits
              vulgar, hateful, name-calling, or otherwise abusive content.
              See our <a href="/policy">Non-abuse Policy</a>.
            </p>
            <Flex direction="column">
              <TextField
                label='Title (optional):'
                name='title'
                value={topicTitle}
                onChange={(e) => {
                  setTopicTitle(e.target.value);
                }}
              />
              <TextAreaField
                label=''
                name="suggestion"
                value={topicText}
                onChange={(e) => {
                  setTopicText(e.target.value);
                }}
                rows={13} cols={120} />
              <Button onClick={handleTopicSubmitControlled}>Submit Topic Suggestion</Button>
            </Flex>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="3">
          <div>
            <h2>Review/Edit/Delete your Suggestions</h2>
            <SuggestionsPanel />
          </div>
        </Tabs.Panel>
      </Tabs.Container>
      
      <ToastNotifier
        message={toastMessage}
        shouldShow={shouldShowAcceptanceToast}
        showF={setShouldShowAcceptanceToast} />

    </PageWrapper>
  );
}

export default SuggestionsPage;
