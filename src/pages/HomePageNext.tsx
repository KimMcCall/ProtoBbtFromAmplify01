// import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, SyntheticEvent, useState } from 'react';
import { getAllIssueRecords } from '../utils/dynamodb_operations';
// import { useAppDispatch } from '../app/hooks';
import { IssueType, CommentBlockType, IssueBlockForRenderingType } from '../features/issues/issues';
import './HomePage.css'

const sortByUpdateT = (issues: IssueType[]) => {
  const retVal = issues.sort((a, b) => {
    const aUpdatedT = a.updatedT;
    const bUpdatedT = b.updatedT;
    if (aUpdatedT < bUpdatedT) { return -1; }
    else if (aUpdatedT === bUpdatedT) { return 0; }
    else { return 1; }
  })
  return retVal;
}

const sortByIssueId = (issues: IssueType[]) => {
  const retVal = issues.sort((a, b) => {
    const aIssueId = a.issueId;
    const bIssueId = b.issueId;
    if (aIssueId < bIssueId) { return -1; }
    else if (aIssueId === bIssueId) { return 0; }
    else { return 1; }
  })
  return retVal;
}

const sortByIncreasingPriority = (issues: IssueType[]) => {
  const retVal = issues.sort((a, b) => {
    const aPriority = a.priority;
    const bPriority = b.priority;
    if (aPriority > bPriority) { return -1; }
    else if (aPriority === bPriority) { return 0; }
    else { return 1; }
  })
  return retVal;
}

const createRenderingStuctForIssueId = (issueId: string, issues: IssueType[]) => {
  const issuesForThisId = issues.filter((issue) => issue.issueId === issueId);
  let claim = '';
  let proComments: CommentBlockType[] = [];
  let conComments: CommentBlockType[] = [];

  issuesForThisId.forEach((issue) => {
    claim = issue.claim;
    const isEmpty = issue.commentText.length <= 0;
    if (isEmpty) {
      return;
    }
    const commentStruct: CommentBlockType = {
      commentKey: issue.commentKey,
      text: issue.commentText,
    };
    const proOrCon = issue.commentType;
    if (proOrCon === 'PRO') {
      proComments = proComments.concat(commentStruct);
    } else {
      conComments = conComments.concat(commentStruct);
    }
  });
  const retVal: IssueBlockForRenderingType = {
    issueId: issueId,
    claim: claim,
    proComments: proComments,
    conComments: conComments,
  }
  return retVal;
}

const structurePerIssue = (listOfIssues: IssueType[]) => {
  const mySet = new Set();
  listOfIssues.forEach((issue) => { mySet.add(issue.issueId)});
  let myStructs: IssueBlockForRenderingType[]  = [];
  // @ts-expect-error I only put strings into the Set, so that's all I'll get out
  mySet.forEach((issueId: string) => {
    const struct: IssueBlockForRenderingType = createRenderingStuctForIssueId(issueId, listOfIssues)
    myStructs = myStructs.concat(struct);
  });
  return myStructs;
}

/*


const SuggestionTile: React.FC<ClaimCardProps> = (props)  => {
  const { struct } = props;

*/

interface ClaimCardProps {
  struct: IssueBlockForRenderingType;
}

function ClaimCard(props: ClaimCardProps) {
  const { struct } = props;

  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const handleCardClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log(`Should now save state for comments and navigate to the IssuePage`)
    // navigate(`/issue`); // GATOR: possibly add queryString to URL
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
  proComments: [{commentKey: 'lksffksdll', text: 'PRO commentText'}],
  conComments: [{commentKey: 'afl;dskr0r', text: 'CON commentText'}],
}
const arryOfStucts = [basicStruct];

function HomePageNext() {
  const [structuredForRendering, setStructuredForRendering] = useState(arryOfStucts);
  
  useEffect(() => {
    const fetchIssues = async () => {
      await getAllIssueRecords().then(
      (result) => {
        // GATOR: figure out how to avoid this error
        // @ts-expect-error This is, indeed, a type mismatch, but I'm hoping it'll be OK
        const iterable: Iterable<IssueType> = result.values();
        const issues = Array.from(iterable);
        console.log(`# issues: ${issues.length}`);
        // GATOR: make this work
        // dispatch(setIssues(issues));
        const sortedByUpdate = sortByUpdateT(issues);
        const sortedByIssueId = sortByIssueId(sortedByUpdate);
        const sortedByPriority = sortByIncreasingPriority(sortedByIssueId);
        const structured = structurePerIssue(sortedByPriority);
        console.log(`# structured: ${structured.length}`)
        console.log(structured);
        // GATOR: in issueSlice, make a place to store this
        setStructuredForRendering(structured);
      }
    )
    };

    fetchIssues(); // Call the async function
  }, []);


  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
      {
      structuredForRendering.map(struct => (
      <ClaimCard struct={struct} />
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
