import { Flex } from '@aws-amplify/ui-react';
import './SuggestionsPanel.css';
import SuggestionTile from './SuggestionTile';

function SuggestionsPanel() {

  const ids = ["11", "12", "13", "14", "17", "16", ]

  return (
    <div className="suggPanel">
      <Flex
        direction="column"
        justifyContent="space-between"
        alignItems="left"
        wrap="nowrap"
        gap="1rem"
      >
        <SuggestionTile key="1" suggestionId="1" />
        <SuggestionTile key="2" suggestionId="2" />
        <SuggestionTile key="3" suggestionId="3" />{
        ids.map(id => (
        <SuggestionTile key={id} suggestionId={id} />
      ))}
        <SuggestionTile key="4" suggestionId="4" />
        <SuggestionTile key="5" suggestionId="5" />
        <SuggestionTile key="6" suggestionId="6" />
      </Flex>
    </div>
  );
}

export default SuggestionsPanel;
