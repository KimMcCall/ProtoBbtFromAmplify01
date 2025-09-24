import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Radio, RadioGroupField, TextField } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { selectCurrentUserIsLoggedIn, selectCurrentUserIsSuperAdmin, setCurrentUserAsSuperAdmin, setCurrentUserCanonicalEmail } from "../features/userInfo/userInfoSlice";
import { selecNext, setNextPath } from "../features/navigation/navigationSlice";
import { dbClient } from "../main";
import { computeUserStatus, getLatestRowWithIssueId, toCanonicalEmail, UserStatusType } from "../utils/utils";
import { cacheAbortedCallFrom, resetTracking } from "../features/loginTracking/loginTracking";
import { sendEmail } from "../features/email/Email";
import ToastNotifier from "../components/ToastNotifier";
import { getIssue } from "../utils/comment_operations";
import './PlayPage02.css';
import { IssueType, selectAllIssues } from "../features/issues/issues";

interface ImageTilePropsType {
  issueId: string
  claim: string
  selectionCallback: (e: SyntheticEvent<HTMLDivElement>, issueId: string) => void
}

interface IdClaimPairType {
  issueId: string
  claim: string
}

function IssueTile(props: ImageTilePropsType) {
  const { issueId, claim, selectionCallback } = props;

  const handleTileClick = (event: SyntheticEvent<HTMLDivElement>) => {
    event.stopPropagation();
    selectionCallback(event, issueId);
  }

  return(
    <div key={issueId} className="issueTileRoot" onClick={handleTileClick}>
      {claim}
    </div>
  )
}

function PlayPage02() {
  const [ savedPath, setSavedPath] = useState("/donate");
  const [ userStatus, setUserStatus ] = useState("");
  const [ dbCheckFeedback, setDbCheckFeedback ] = useState("Waiting for czech");
  const [simpleTestResult, setSimpleTestResult] = useState(42)
  const [showToast, setShowToast] = useState(false);
  const [uiChoice, setUIChoice] = useState('uiMgmt');
  const [activityChoice, setActivityChoice] = useState('manageOtherFields');
  const [issueIdText, setIssueIdText] = useState('');
  const [claimText, setClaimText] = useState('');
  const [priorityText, setPriorityText] = useState('');
  const [availabilityChoice, setAvailabilityChoice] = useState('noChoiceYet');

  const dispatch = useAppDispatch();
  const isNowSuperAdmin = useAppSelector(selectCurrentUserIsSuperAdmin);
  const newPath = useAppSelector(selecNext);
  const navigateTo = useNavigate();

  const allIssues: IssueType[] = useAppSelector(selectAllIssues);
  const issueMap = new Map();
  allIssues.forEach((issue) => issueMap.set(issue.issueId, issue.claim))
  let idClaimPairs: IdClaimPairType[] = [];
  issueMap.forEach((value, key) => {
    const issueId = key;
    const claim = value;
    const struct = { issueId: issueId, claim: claim };
    idClaimPairs = idClaimPairs.concat(struct);
  });
  console.log(`# idClaimPairs: ${idClaimPairs.length}`)
  console.log(idClaimPairs);

  const toggleIsAdmin = () => {
    dispatch(setCurrentUserAsSuperAdmin(!isNowSuperAdmin))
  }

  const goThere = () => { navigateTo(newPath); }

  const computeAndSetStatus = async () => {
    const computedStatus: UserStatusType = await testComputeStatus();
    setUserStatus(computedStatus);
  }

  const checkDbAndShowResult = async () => {
    const result: string = await checkDbForCorruption();
    setDbCheckFeedback(result);
  }

  const checkDbForCorruption = async () => {
    let retVal = 'retVal never got overidden';
    let haveResetRetVal = false;
    await dbClient.models.RegisteredUser.list().then(
      (response) => {
        const allRecords = response.data;
        const authIds: string[] = [];
        allRecords.forEach((record) => {
          const thisAuthId = record.authId;
          if (authIds.find((element) => element === thisAuthId)) {
            // Found duplicate authId. make a Memo and return something useful to display
            const memoContent = `found multiple records with authId: ${thisAuthId}`;
            const memoData = {
              subject: 'DB Corruption',
              content: memoContent,
            };
            dbClient.models.Memo.create(memoData);
            console.log(`found multiple records with authId: ${thisAuthId}`);
            retVal = `found multiple records with authId: ${thisAuthId}`;
            haveResetRetVal = true;
          } else {
            authIds.push(thisAuthId);
          }
        })
        if (!haveResetRetVal) {
          console.log('found no duplicate authIds');
          retVal = 'no dupllicate authId\'s';
        }
      }
    )
    return retVal;
  }

  const expectedCEmail = "mccall.kim@gmail.com"

  const simpleTest = async (): Promise<number>  => {
    const alias = 'mccall.kim+tsowner02@gmail.com';
    const cEmail = toCanonicalEmail(alias);
    const match = cEmail === expectedCEmail;
    console.log(`match in simpleTest: ${match}`);
    let retVal = -1;
     await dbClient.models.RegisteredUser.listByCanonicalEmail({ canonicalEmail: cEmail }).then(
      //?
      (response) => {
        const listOfMatchingCanonicals = response.data;
        const nMatches = listOfMatchingCanonicals.length;
        retVal = nMatches;
      }
     )
     console.log(`returning ${retVal} from end of function`)
     return retVal;
  }

  const testComputeStatus = async (): Promise<UserStatusType> => {
    let retVal: UserStatusType = 'uninitialized';
    const testNormal = false; // Done!
    const testSA = false; // Done!
    const testNewRegistrant = false; // Done!
    const testBanned = false; // Done!
    const testAlias = false;
    const testBannedAlias = true;
    const testRepeatCall = false;

    const normalAuthId = '9989d9ae-6011-709c-f3e1-55e81655d7b3';
    const normalEmail = 'vafield@gmail.com';
    const saAuthId = 'd919199e-50e1-7065-7998-a3d0fc554943';
    const saEmail = 'mccall.kim+tsowner01@gmail.com';
    const newAuthId = '*BOGUS**-50e1-7065-7998-a3d0fc554943';
    const newEmail = 'mccall.kim+NewReg@gmail.com';
    const bannedAuthId = 'e99959ae-a041-70ac-f624-5be9e03211df';
    const bannedEmail = 'vafield@yahoo.com';
    const simpleAliasAuthId = 'eALIAS3e-10f1-708e-fb09-9e48e54415a3';
    const simpleAliasEmail = 'mccall.kim+tsowner02@gmail.com';
    const bannedAliasAuthId = 'BANNED-a041-70ac-f624-5be9e03211df';
    const bannedAliasEmail = 'vafield+alias@yahoo.com';
    const repeatAuthId = '9989d9ae-6011-709c-f3e1-55e81655d7b3';
    const repeatEmail = 'vafield@gmail.com';

    let submitteduthId = '';
    let submittedEmail = '';
    if (testNormal) {
      submitteduthId = normalAuthId;
      submittedEmail = normalEmail;
    } else if (testSA) {
      submitteduthId = saAuthId;
      submittedEmail = saEmail;
    } else if (testNewRegistrant) {
      submitteduthId = newAuthId;
      submittedEmail = newEmail;
    } else if (testBanned) {
      submitteduthId = bannedAuthId;
      submittedEmail = bannedEmail;
    } else if (testAlias) {
      submitteduthId = simpleAliasAuthId;
      submittedEmail = simpleAliasEmail;
    } else if (testBannedAlias) {
      submitteduthId = bannedAliasAuthId;
      submittedEmail = bannedAliasEmail;
    } else if (testRepeatCall) {
      submitteduthId = repeatAuthId;
      submittedEmail = repeatEmail;
    } else {
      retVal = 'uninitialized';
      return retVal;
    }

    const statusAndUser = await computeUserStatus(submitteduthId, submittedEmail);
    return statusAndUser.status;
  }

  const runSimpleTest = async () => {
    const count = await simpleTest();
    setSimpleTestResult(count);
  }

  const resetLoginTracking = async () => {
    dispatch(resetTracking())
  }// 

  const addToLoginTracking = async () => {
    dispatch(cacheAbortedCallFrom('person@example.com'))
  }

  const testEmail = async () => {
    // toAddressess: string[]; subject: string; body: string
    const toAddresses = ['mccall.kim@gmail.com'];
    const subject = 'testSubject';
    const body= '<p>Some <b>lovely</b> message</>';
    sendEmail({toAddresses, subject, body } );
  }

  const isLoggedIn = useAppSelector(selectCurrentUserIsLoggedIn)

  const toggleCEmail = () => {
    let newValue = '';
    if (!isLoggedIn) {
      newValue = 'random@example.com';
    }
    dispatch(setCurrentUserCanonicalEmail(newValue))
  }

  const handleFetchIssueClick = (event: { stopPropagation: () => void; }) => {
    event.stopPropagation();
    getIssue("ISSUE#2025-09-14T14:27:17.611Z");
  }

  const clearOrFill = isLoggedIn ? 'Clear' : 'Fill';
  const toastMessage = "This is a long enough text to stretch across multiple lines, I hope";

  const handleUiRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const choice = event.target.value;
    console.log(`choice: '${choice}.`)
    setUIChoice(choice)
  }

  const handleActivityRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const choice = event.target.value;
    console.log(`activity choice: '${choice}.`)
    setActivityChoice(choice)
  }

  const handleAvailabilityRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const choice = event.target.value;
    console.log(`availabillity choice: '${choice}'.`)
    setAvailabilityChoice(choice)
  }

  const handleOtherFieldsClearButtonClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIssueIdText('');
    setClaimText('');
    setPriorityText('');
    setAvailabilityChoice('noChoiceYet')
  }

  const handleOtherFieldsSubmitButtonClick = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log("Should now update the DB")
    const issueId = issueIdText;
    if (!issueId) {
      alert('You can\'t submit without selecting an issue');
      return;
    }

    const availability = availabilityChoice; // 'available', 'unavailable', or 'noChoiceYet'
    if (availability === 'noChoiceYet') {
      alert('You have to choose either "Make Available" or "Make Unavailable"');
      return;
    }

    const claim = claimText;
    const priorityString = priorityText;
    const haveClaim = claim.length > 0;
    const havePriorityString = priorityString.length > 0;
    const priority = havePriorityString ?  parseInt(priorityString): -1;
    const shouldBeAvailable = availability === 'available';
    const latestRow: IssueType = await getLatestRowWithIssueId(issueId);
    if (!latestRow) {
      alert("big screwup. getLatestRowWithIssueId() didn't return a row")
      throw new Error("big screwup. getLatestRowWithIssueId() didn't return a rpw");
    }

    const commentKey = latestRow.commentKey;
    let myUpdate =  {
      issueId: issueId,
      commentKey: commentKey,
      isAvailable: shouldBeAvailable,
    };
    if (haveClaim) {
      const addition = {claim: claim};
      myUpdate = { ...myUpdate, ...addition }
    }
    if (havePriorityString) {
      const addition = { priority: priority};
      myUpdate = { ...myUpdate, ...addition}
    }

    await dbClient.models.IssueP2.update(myUpdate).then(
          (response) => {
            // @ts-expect-error It will not be undefined if the .update() succeeded!
            const modifiedIssue: IssueType = response.data;
            const { issueId, commentKey } = modifiedIssue;
            // dispatch(setDesignatedUserId(id));
            console.log(`back from update({issueId: ${issueId}, commentKey: ${commentKey}})`);
          }
        );
  }

  const handleIssueTileClick = (event: SyntheticEvent<HTMLDivElement>, issueId: string) => {
    event.stopPropagation();
    setIssueIdText(issueId);
  }

  const showUiMgmt = uiChoice === 'uiMgmt';
  const showRandom = uiChoice === 'randomUI';
  const showUrlUi = activityChoice === 'manageUrls';
  const showOtherFieldsUi = activityChoice === 'manageOtherFields';

  return (
    <PageWrapper>
      <Flex direction="column" gap="6px">
        <RadioGroupField
          legend="Choose What to See"
          name="uiChoice"
          direction="row"
          value={uiChoice}
          onChange={handleUiRadioButtonChange}
        >
          <Radio value="uiMgmt">IssueModification UI</Radio>
          <Radio value="randomUI">random cool stuff</Radio>
        </RadioGroupField>

        {
          showUiMgmt &&
          (
            <div className="activityChoiceDiv">
              <RadioGroupField
                legend="What do you want to do?"
                name="activityChoice"
                direction="row"
                value={activityChoice}
                onChange={handleActivityRadioButtonChange}
              >
                  
                <div className="activityButtonsDiv">
                  <Radio value="manageUrls">Manage pro/con URLs</Radio>
                </div>
                <div className="activityButtonsDiv">
                  <Radio value="manageOtherFields">Manage other Issue properties</Radio>
                </div>
              </RadioGroupField>
              {
                showOtherFieldsUi &&
                (
                  // UI to display if showOtherFieldsUi is true
                  <Flex direction="column" className="otherFieldsFormDiv">
                    <Flex direction="row">
                      <div className="issueScrollDiv">{
                        idClaimPairs.map(pair => (
                          <IssueTile
                            key={pair.issueId}
                            issueId={pair.issueId}
                            claim={pair.claim}
                            selectionCallback={handleIssueTileClick} />
                         ))}
                      </div>
                      <Flex direction="column" gap="0px">
                        <div className="chosenIssueLabel">
                          chosen Issue ID:
                        </div>
                        <div className="chosenIssue">
                          <TextField
                            label=""
                            name=""
                            width="240px"
                            value={issueIdText}
                            readOnly
                            />
                      </div>
                      </Flex>
                    </Flex>
                    <Flex direction="row">
                      <div className="claimLabelDiv">
                        claim:
                      </div>
                      <div className="claimDiv">
                        <TextField
                          label=""
                          name=""
                          value={claimText}
                          onChange={(e) => setClaimText(e.target.value)}
                          />
                      </div>
                    </Flex>
                    <Flex direction="row">
                      <div className="priorityLabelDiv">
                        priority:
                      </div>
                      <div className="priorityDiv">
                        <TextField
                          label=""
                          name=""
                          value={priorityText}
                          onChange={(e) => setPriorityText(e.target.value)}
                          />
                      </div>
                    </Flex>
                    <Flex direction="row">
                      <div className="availabilityLabel">
                        Availability:
                      </div>
                      <RadioGroupField
                        className="availabilityButtons"
                        legend=""
                        name="activityChoice"
                        direction="row"
                        value={availabilityChoice}
                        onChange={handleAvailabilityRadioButtonChange}
                      >
                        <div className="availabilityButtonDiv">
                          <Radio value="available">&nbsp;Make Available</Radio>
                        </div>
                        <div className="availabilityButtonDiv">
                          <Radio value="unavailable">&nbsp;Make Unavailable</Radio>
                        </div>
                      </RadioGroupField>
                      <div className="otherFieldsFormButtonsDiv">
                        <Button className="otherFieldsFormButton" onClick={handleOtherFieldsClearButtonClick}>
                          Clear
                        </Button>
                        <Button className="otherFieldsFormButton" onClick={handleOtherFieldsSubmitButtonClick}>
                          Submit
                        </Button>
                      </div>
                    </Flex>

                    <div>

                    </div>
                  </Flex>
                )
              }
              {
                showUrlUi &&
                (
                  // UI to display if showOtherFieldsUi is true
                  <p>This is displayed to allow modifiction of URLs.</p>
                )
              }

            </div>
          )
        }

        {
          showRandom &&
          (
            // UI to display if showRandom is true
            <Flex direction="column" gap="12px">
              <Flex direction={"row"}>
                <button onClick={() => toggleIsAdmin()}>Toggle isSuperAdmin</button>
                value:
                <TextField
                  label=""
                  value={'' + isNowSuperAdmin}
                  readOnly
                  placeholder="??"
                  width="120px"
                />
              </Flex>
              <Flex direction={"row"}>
                <button onClick={() => toggleCEmail()}>{String(clearOrFill)} cEmail</button>
                <button onClick={() => checkDbAndShowResult()}>Czech DB for corruption</button>
                <TextField
                  label=""
                  value={dbCheckFeedback}
                  readOnly
                  width="420px"
                />
              </Flex>
              <Flex direction={"row"}>
                <button onClick={() => dispatch(setNextPath(savedPath))}>Set as next path</button>
                <TextField
                  label=""
                  value={savedPath}
                  onChange={(e) => setSavedPath(e.target.value)}
                  width="200px"
                />
                <button onClick={() => goThere()}>Go to the path</button>
              </Flex>
              <Flex direction={"row"}>
                <button onClick={() => computeAndSetStatus()}>Compute Status</button>
                <TextField
                  label=""
                  value={userStatus}
                  readOnly
                  width="400px"
                />
                <button onClick={() => setUserStatus('')}>Clear Status</button>
              </Flex>
              <Flex direction={"row"}>
                <button onClick={() => runSimpleTest()}>Run Simple Test</button>
                <TextField
                  label=""
                  value={simpleTestResult}
                  readOnly
                  width="60px"
                />
                <button onClick={() => resetLoginTracking()}>Reset Login Tracking</button>
                <button onClick={() => addToLoginTracking()}>Add to Login Tracking</button>
                <button onClick={() => testEmail()}>Test Email</button>
              </Flex>

              <ToastNotifier message={toastMessage} shouldShow={showToast} showF={setShowToast}/>
              <Flex>
                <Button onClick={handleFetchIssueClick}> Fetch Issue </Button>
              </Flex>
            </Flex>
          )
        }
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage02;
