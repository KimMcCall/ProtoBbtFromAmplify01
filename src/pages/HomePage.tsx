// import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, SyntheticEvent, useState } from 'react';
import { getAllIssueRecords } from '../utils/dynamodb_operations';
// import { useAppDispatch } from '../app/hooks';
import { setCurrentIssueId, IssueType, setAllIssues, IssueBlockForRenderingType, setDisplayBlocks, setAvailableIssues } from '../features/issues/issues';
import './HomePage.css'
import { useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { sortAndRepairIssues, structurePerIssue } from "../utils/utils";
import { ClipLoader } from 'react-spinners';


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

const arrayOfStructs: IssueBlockForRenderingType[] = [];

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [structuredForRendering, setStructuredForRendering] = useState(arrayOfStructs);
  const dispatch = useAppDispatch();

  const filterForUltimateAvailability = (issues: IssueType[]) => {
    const issueAvailablityMap = new Map<string, boolean>();
    issues.forEach(issue => {
      issueAvailablityMap.set(issue.issueId, issue.isAvailable);
    });
    let issuesToShow: IssueType[] = [];
    issues.forEach(issue => {
      if (issueAvailablityMap.get(issue.issueId)) {
        issuesToShow = issuesToShow.concat(issue);
      }
    });
    return issuesToShow;
  } 
  
  useEffect(() => {
    const fetchIssues = async () => {
      console.log('At top of fetchIssues() in HomePage useEffect()');
      await getAllIssueRecords().then(
      (result) => {
        const iterable: Iterable<IssueType> = result.values();
        const allIssues = Array.from(iterable);
        const sortedAndRepairedIssues = sortAndRepairIssues(allIssues);
        console.log(`All ${sortedAndRepairedIssues.length} issues: `, sortedAndRepairedIssues);
        dispatch(setAllIssues(sortedAndRepairedIssues));
        const filteredForAvailable = filterForUltimateAvailability(sortedAndRepairedIssues);
        dispatch(setAvailableIssues(filteredForAvailable));
        // Structure per issue for rendering
        const structured = structurePerIssue(filteredForAvailable);
        setStructuredForRendering(structured);
        dispatch(setDisplayBlocks(structured));
        setLoading(false);
      }
    )
    };

    fetchIssues(); // Call the async function

  }, [dispatch]);


  return (
    <PageWrapper>
          {loading ? (
            <div className="loaderContainer">
              <ClipLoader color="#36D7B7" loading={loading} size={300} />
            </div>
          ) : (
          <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
            {
              structuredForRendering.map(struct => (
                <ClaimCard key={struct.issueId} struct={struct} />
              )
            )
            }
          </Flex>
          )}
    </PageWrapper>
  );
}

export default HomePage;
