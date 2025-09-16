// import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, SyntheticEvent, useState } from 'react';
import { getAllIssueRecords } from '../utils/dynamodb_operations';
// import { useAppDispatch } from '../app/hooks';
import { IssueType, CommentBlockType, IssueBlockForRenderingType, setDisplayBlocks, setCurrentIssueId, setIssues } from '../features/issues/issues';
import './HomePage.css'
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";

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

const keyUrlString = 'NONE';
const keyCommentString = 'No Comment';

const repairKeyStrings = (issues: IssueType[]) => {
  const repairedIssues = issues.map((issue) => {
    if (issue.proUrl === keyUrlString) {
      issue.proUrl = '';
    }
    if (issue.conUrl === keyUrlString) {
      issue.conUrl = '';
    }
    if (issue.commentText === keyCommentString) {
      issue.commentText = '';
    }
    return issue;
  });
  return repairedIssues;
}

const createRenderingStuctForIssueId = (issueId: string, issues: IssueType[]) => {
  const issuesForThisId = issues.filter((issue) => issue.issueId === issueId);
  // since we want the value of the latest one, we'll just override these each time through
  let claim = '';
  let proUrl = '';
  let conUrl = '';
  let proIsPdf = false;
  let conIsPdf = false;
  let proComments: CommentBlockType[] = [];
  let conComments: CommentBlockType[] = [];

  issuesForThisId.forEach((issue) => {
    claim = issue.claim;
    proUrl = issue.proUrl;
    conUrl = issue.conUrl;
    proIsPdf = issue.proIsPdf;
    conIsPdf = issue.conIsPdf;
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
    proUrl: proUrl,
    conUrl: conUrl,
    proIsPdf: proIsPdf,
    conIsPdf: conIsPdf,
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleCardClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();
    console.log(`Should now save state for comments and navigate to the IssuePage`)
    // navigate(`/issue`); // GATOR: possibly add queryString to URL
    dispatch(setCurrentIssueId(struct.issueId));
    navigate('/issue')
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
  proComments: [{commentKey: 'lksffksdll', text: 'PRO commentText'}],
  conComments: [{commentKey: 'afl;dskr0r', text: 'CON commentText'}],
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
        const sortedByUpdate = sortByUpdateT(issues);
        const sortedByIssueId = sortByIssueId(sortedByUpdate);
        const sortedByPriority = sortByIncreasingPriority(sortedByIssueId);
        const repairedIssues = repairKeyStrings(sortedByPriority);
        console.log(`# repairedIssues: ${repairedIssues.length}`)
        dispatch(setIssues(repairedIssues));
        const structured = structurePerIssue(sortedByPriority);
        console.log(`# structured: ${structured.length}`)
        console.log(structured);
        // GATOR: in issueSlice, make a place to store this
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
