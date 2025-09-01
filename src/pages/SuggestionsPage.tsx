import { Tabs } from '@aws-amplify/ui-react';
import BannerBox from "../components/BannerBox.";

const policyP: React.CSSProperties = {
  fontStyle: 'italic',
  fontSize: '85%',
  width: '800px',
  border: '1px solid gray',
  padding: '4px',
  backgroundColor: '#f0f0f0',
};

function SuggestionsPage() {
  return (
    <main>
      <BannerBox />
      <h1>Send Us a Suggestion</h1>
      <Tabs.Container defaultValue="1">
        <Tabs.List spacing='equal' >
          <Tabs.Item value="1">Suggestion for Site</Tabs.Item>
          <Tabs.Item value="2">Suggest New Topic</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="1">
          <div>
            <h2>Suggestion for Site</h2>
            <p>Please share with us any suggestions you have about how to improve this web site.
              Thank you!</p>
            <p  style={policyP}>
              Note: We insist that all postings on this site be respectful and non-abusive.
              Site administrotrs reserve the right to summarily ban anyone who submits
              vulgar, hateful, name-calling, or otherwise abusive content.
            </p>
            <form>
              <label>
                Your Suggestion:
                <br />
                <textarea name="suggestion" rows={16} cols={120} />
              </label>
              <br />
              <button type="submit">Submit Site Suggestion</button>
            </form>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="2">
          <div>
            <h2>Suggest New Topic</h2>
            <p>Please share with us any suggestions for new topics on which we might fruitfully
              promote a truth-based narrative. Click <a>here</a>&nbsp;
              if you want to compose a brief essay yourself.</p>
            <p  style={policyP}>
              Note: We insist that all postings on this site be respectful and non-abusive.
              Site administrotrs reserve the right to summarily ban anyone who submits
              vulgar, hateful, name-calling, or otherwise abusive content.
            </p>
            <form>
              <label>
                Topic Suggestion:
                <br />
                <textarea name="topic" rows={16} cols={120} />
              </label>
              <br />
              <button type="submit">Submit Topic Suggestion</button>
            </form>
          </div>
        </Tabs.Panel>
      </Tabs.Container>
    </main>
  );
}

export default SuggestionsPage;
