// import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, SyntheticEvent, useState } from 'react';
import { getAllIssueRecords } from '../utils/dynamodb_operations';
// import { useAppDispatch } from '../app/hooks';
import { setCurrentIssueId, IssueType, setIssues, IssueBlockForRenderingType, setDisplayBlocks } from '../features/issues/issues';
import './HomePage.css'
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { sortAndRepairIssues, structurePerIssue } from "../utils/utils";

interface ClaimCardProps {
  struct: IssueBlockForRenderingType;
}

function ClaimCard(props: ClaimCardProps) {
  const { struct } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCardClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dispatch(setCurrentIssueId(struct.issueId));
    navigate('/issue?stance=pro');
  }

  const claim = struct.claim;
  const key = struct.issueId;

  return (
    <div key={key} className='claimCardRoot' onClick={handleCardClick}>
      {claim}
    </div>
  )
}

const basicStruct: IssueBlockForRenderingType = {
  issueId: '',
  claim: '',
  proUrl: '',
  conUrl: '',
  proDocType: '',
  conDocType: '',
  comments: [{
    commentKey: '',
    commentAuthorEmail: '',
    time: '',
    text: ''}],
}

const arryOfStucts = [basicStruct];

function HomePage() {
  const [structuredForRendering, setStructuredForRendering] = useState(arryOfStucts);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const fetchIssues = async () => {
      console.log('At top of fetchIssues() in HomePage useEffect()');
      await getAllIssueRecords().then(
      (result) => {
        const iterable: Iterable<IssueType> = result.values();
        const allIssues = Array.from(iterable);
        const sortedAndRepairedIssues = sortAndRepairIssues(allIssues);
        dispatch(setIssues(sortedAndRepairedIssues));
        const structured = structurePerIssue(sortedAndRepairedIssues);
        setStructuredForRendering(structured);
        dispatch(setDisplayBlocks(structured));
      }
    )
    };

    fetchIssues(); // Call the async function

  }, [dispatch]);


  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
        {
          structuredForRendering.map(struct => (
            <ClaimCard key={struct.issueId} struct={struct} />
          )
        )
        }
      </Flex>
    </PageWrapper>
  );
}

export default HomePage;
