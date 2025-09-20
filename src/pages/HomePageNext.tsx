// import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, SyntheticEvent, useState } from 'react';
import { getAllIssueRecords } from '../utils/dynamodb_operations';
// import { useAppDispatch } from '../app/hooks';
import { IssueType, IssueBlockForRenderingType, setDisplayBlocks, setCurrentIssueId, setIssues } from '../features/issues/issues';
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
const arryOfStucts = [basicStruct];

function HomePageNext() {
  const [structuredForRendering, setStructuredForRendering] = useState(arryOfStucts);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const fetchIssues = async () => {
      await getAllIssueRecords().then(
      (result) => {
        // GATOR: figure out how to avoid this error
        // @ts-expect-error This is, indeed, a type mismatch, but I'm hoping it'll be OK
        const iterable: Iterable<IssueType> = result.values();
        const issues = Array.from(iterable);
        const sortedAndRepairedIssus = sortAndRepairIssues(issues);
        console.log(`# repairedIssues: ${sortedAndRepairedIssus.length}`)
        dispatch(setIssues(sortedAndRepairedIssus));
        const structured = structurePerIssue(sortedAndRepairedIssus);
        console.log(`# structured: ${structured.length}`)
        console.log(structured);
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

export default HomePageNext;
