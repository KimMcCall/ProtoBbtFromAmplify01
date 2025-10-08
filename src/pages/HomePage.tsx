// import { useNavigate } from 'react-router-dom';
import { Flex } from "@aws-amplify/ui-react";
import PageWrapper from "../components/PageWrapper";
import { useEffect, SyntheticEvent, useState } from 'react';
import { getAllIssueRecords } from '../utils/dynamodb_operations';
// import { useAppDispatch } from '../app/hooks';
import { setCurrentIssueId, IssueType, setAllIssues, IssueBlockForRenderingType, setDisplayBlocks, setAvailableIssues, selectAllIssues } from '../features/issues/issues';
import './HomePage.css'
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { filterForUltimateAvailability, sortAndRepairIssues, structurePerIssue } from "../utils/utils";
import { ClipLoader } from 'react-spinners';
import { selectListIssuesCallTimeIsRecent, setListIssuesCallTime } from "../features/queryLimitation/queryLimitationSlice";


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

function HomePage() {
  const [loading, setLoading] = useState(true);
  // const [structuredForRendering, setStructuredForRendering] = useState(arrayOfStructs);
  const dispatch = useAppDispatch();

  // const userIsSuperAdmin = useAppSelector(selectCurrentUserIsSuperAdmin);
  const nowIsWithinRecencyHorizon = useAppSelector(selectListIssuesCallTimeIsRecent);
  const allIssuesInRedux = useAppSelector(selectAllIssues);
  const nIssuesInRedux = allIssuesInRedux.length;
  console.log(`HomePage: nIssuesInRedux = ${nIssuesInRedux}`);
  // If we have issues in Redux and the last call time is recent, we can skip the fetch
  const haveIssuesInRedux = useAppSelector(selectAllIssues).length > 0;
  console.log(`HomePage: nowIsWithinRecencyHorizon = ${nowIsWithinRecencyHorizon}, haveIssuesInRedux = ${haveIssuesInRedux}`);

  let structuredForRendering: IssueBlockForRenderingType[] = [];
  if (haveIssuesInRedux) {
    structuredForRendering = structurePerIssue(allIssuesInRedux);
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
        dispatch(setDisplayBlocks(structured));
        setLoading(false);
      }
    )
    };
    if (nowIsWithinRecencyHorizon && haveIssuesInRedux /*&& !userIsSuperAdmin*/) {
      const structured = structurePerIssue(allIssuesInRedux);
      dispatch(setDisplayBlocks(structured));
      setLoading(false);
    } else {
      dispatch(setListIssuesCallTime());
      fetchIssues(); // Call the async function
    }

  }, [nowIsWithinRecencyHorizon, haveIssuesInRedux, dispatch, allIssuesInRedux/*, userIsSuperAdmin*/]
);


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
