import { Button, Flex, Tabs, TextAreaField, TextField } from '@aws-amplify/ui-react';
import PageWrapper from '../components/PageWrapper';
import SuggestionsPanel from '../components/SuggestionsPanel';
import { selectUserId } from '../features/userInfo/userInfoSlice';
import { useAppSelector } from '../app/hooks';
import { dbClient } from '../main';
import { useState } from 'react';
import ToastNotifier from '../components/ToastNotifier';

const policyP: React.CSSProperties = {
  fontStyle: 'italic',
  fontSize: '85%',
  width: '800px',
  border: '1px solid gray',
  padding: '4px',
  backgroundColor: '#f0f0f0',
};

function SuggestionsPage() {
  const [siteTitle, setSiteTitle] = useState('');
  const [siteText, setSiteText] = useState('');
  const [topicTitle, setTopicTitle] = useState('');
  const [topicText, setTopicText] = useState('');
  const [shouldShowAcceptanceToast,setShouldShowAcceptanceToast ] = useState(false);
  const [toastMessage, setToastMessage] = useState('Your suggestion has been received');


  const userId =  useAppSelector(selectUserId);

  const handleSiteSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    handleSubmit(event, 'Site Suggestion');
    setSiteTitle('');
    setSiteText('');
  };

  const handleTopicSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    handleSubmit(event, 'Topic Suggestion')
    setTopicTitle('');
    setTopicText('');
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>, category: string) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Handle form data here, e.g., send to an API or update state
    const form: HTMLFormElement = event.currentTarget
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const submittedTitle = formJson.title;
    const convertedTitle = submittedTitle.toString();
    const submittedText = formJson.suggestion;
    const convertedText = submittedText.toString();
    console.log(`length of content: ${convertedText.length}`);
    if (convertedText.length === 0) {
      console.log(`  showing toast and aborting`);
      setToastMessage('Sorry! You need to fill in some content for your suggestion');
      setShouldShowAcceptanceToast(true);
      return;
    }
    const structToCreate = {
      userId: userId,
      category: category,
      title: convertedTitle,
      content: convertedText,
      isRead: false,
      isStarred: false,
      isImportant: false,
      isArchived: false,
      isBanned: false,
      isTrashed: false,
    };
    dbClient.models.Submission.create(structToCreate);
    setToastMessage('Your suggestion has been received');
    setShouldShowAcceptanceToast(true);
  };

  return (
    <PageWrapper>
      <Tabs.Container defaultValue="1">
        <Tabs.List spacing='equal' >
          <Tabs.Item value="1">Suggestion for Site</Tabs.Item>
          <Tabs.Item value="2">Suggest New Topic</Tabs.Item>
          <Tabs.Item value="3">Review/Edit your Suggestions</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="1">
          <div>
            <h2>Suggestion for Site</h2>
            <p>Please share with us any suggestions you have about how to improve this web site.
              Thank you!<br />&nbsp;</p>
            <p  style={policyP}>
              Note: We insist that all postings on this site be respectful and non-abusive.
              Site administrotrs reserve the right to summarily ban anyone who submits
              vulgar, hateful, name-calling, or otherwise abusive content.
            </p>
            <Flex as="form" direction="column" onSubmit={handleSiteSubmit}>
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
              <Button type="submit">Submit Site Suggestion</Button>
            </Flex>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <div>
            <h2>Suggest New Topic</h2>
            <p>Please share with us any suggestions for new topics on which we might fruitfully
              promote a truth-based narrative.
            <br />
            Click <a>here</a>&nbsp;
              if you want to compose a brief essay yourself.</p>
            <p  style={policyP}>
              Note: We insist that all postings on this site be respectful and non-abusive.
              Site administrotrs reserve the right to summarily ban anyone who submits
              vulgar, hateful, name-calling, or otherwise abusive content.
            </p>
            <Flex as="form" direction="column" onSubmit={handleTopicSubmit}>
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
              <Button type="submit">Submit Topic Suggestion</Button>
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
