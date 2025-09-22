// import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, SyntheticEvent, useState } from 'react';
import { getAllIssueRecordsXP2 } from '../utils/dynamodb_operations';
// import { useAppDispatch } from '../app/hooks';
import { setCurrentIssueId, IssueTypeXP2, setIssuesXP2, IssueBlockForRenderingTypeXP2, setDisplayBlocksXP2 } from '../features/issues/issues';
import './HomePage.css'
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { sortAndRepairIssuesXP2, structurePerIssueXP2 } from "../utils/utils";

interface ClaimCardProps {
  struct: IssueBlockForRenderingTypeXP2;
}

function ClaimCard(props: ClaimCardProps) {
  const { struct } = props;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCardClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log(`Now saving state and navigating to the IssuePage`)
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

/*
const basicStruct: IssueBlockForRenderingType = {
  issueId: '',
  claim: '',
  proUrl: '',
  conUrl: '',
  proIsPdf: true,
  conIsPdf: true,
  proComments: [{
    commentKey: 'lksffksdll',
    authorEmail: '',
    time: '',
    text: 'PRO commentText'}],
  conComments: [{
    commentKey: 'afl;dskr0r',
    authorEmail: '',
    time: '',
    text: 'CON commentText'}],
}
*/

const basicStructXP2: IssueBlockForRenderingTypeXP2 = {
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

// const arryOfStucts = [basicStruct];
const arryOfStuctsXP2 = [basicStructXP2];

function HomePage() {
  // const [structuredForRendering, setStructuredForRendering] = useState(arryOfStucts);
  const [structuredForRenderingXP2, setStructuredForRenderingXP2] = useState(arryOfStuctsXP2);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    /*
    const fetchIssues = async () => {
      await getAllIssueRecords().then(
      (result) => {
        // GATOR: figure out how to avoid this error
        / ts-expect-error This is, indeed, a type mismatch, but I'm hoping it'll be OK
        const iterable: Iterable<IssueType> = result.values();
        const issues = Array.from(iterable);
        const sortedAndRepairedIssues = sortAndRepairIssues(issues);
        console.log(`# repairedIssues: ${sortedAndRepairedIssues.length}`)
        dispatch(setIssues(sortedAndRepairedIssues));
        const structured = structurePerIssue(sortedAndRepairedIssues);
        console.log(`# structured: ${structured.length}`)
        console.log(structured);
        setStructuredForRendering(structured);
        dispatch(setDisplayBlocks(structured));
      }
    )
    };
    */
    const fetchIssuesXP2 = async () => {
      await getAllIssueRecordsXP2().then(
      (result) => {
        const iterable: Iterable<IssueTypeXP2> = result.values();
        const issues = Array.from(iterable);
        const sortedAndRepairedIssues = sortAndRepairIssuesXP2(issues);
        console.log(`# sortedAndRepairedIssues: ${sortedAndRepairedIssues.length}`)
        dispatch(setIssuesXP2(sortedAndRepairedIssues));
        const structured = structurePerIssueXP2(sortedAndRepairedIssues);
        console.log(`# structured: ${structured.length}`)
        console.log(structured);
        setStructuredForRenderingXP2(structured);
        dispatch(setDisplayBlocksXP2(structured));
      }
    )
    };

    // await fetchIssues(); // Call the async function
    fetchIssuesXP2(); // Call the async function

  }, [dispatch]);


  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
      {
      structuredForRenderingXP2.map(struct => (
      <ClaimCard key={struct.issueId} struct={struct} />
    ))}
      </Flex>
    </PageWrapper>
  );

  /*
  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
        <h1>My Glorious App</h1>
        <div>
          You're on the Home Page.
        </div>
        <div>
          <button onClick={() => {handleButtonClick("/sketch")}}>Go to Sketch page</button>
        </div>
        loading &&  <div>Loading user info...</div>
      </Flex>
    </PageWrapper>
  );
  */
}

export default HomePage;
