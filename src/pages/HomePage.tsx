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
  
  useEffect(() => {
    const fetchIssues = async () => {
      console.log('At top of fetchIssues() in HomePage useEffect()');
      await getAllIssueRecords().then(
      (result) => {
        const iterable: Iterable<IssueType> = result.values();
        const allIssues = Array.from(iterable);
        const sortedAndRepairedIssues = sortAndRepairIssues(allIssues);
        dispatch(setAllIssues(sortedAndRepairedIssues));
        const filteredForAvailable = sortedAndRepairedIssues.filter(issue => issue.isAvailable);
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
