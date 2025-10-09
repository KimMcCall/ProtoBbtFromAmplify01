import { SyntheticEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button, Flex, TextField } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { selectCurrentUserIsAdmin, selectCurrentUserIsSuperAdmin, setCurrentUserAsAdmin, setCurrentUserAsSuperAdmin } from "../features/userInfo/userInfoSlice";
import { selecNext, setNextPath } from "../features/navigation/navigationSlice";
import { dbClient } from "../main";
import { computeUserStatus, toCanonicalEmail, UserStatusType } from "../utils/utils";
import { cacheAbortedCallFrom, resetTracking } from "../features/loginTracking/loginTracking";
import { sendClientEmail, sendServerEmail } from "../features/email/Email";
import './PlayPage02.css';
import { IssueType, selectAllIssues } from "../features/issues/issues";

interface IdClaimPairType {
  issueId: string
  claim: string
}

function PlayPage02() {
  const [ savedPath, setSavedPath] = useState("/finances");
  const [ userStatus, setUserStatus ] = useState("");
  const [ dbCheckFeedback, setDbCheckFeedback ] = useState("Waiting for czech");
  const [simpleTestResult, setSimpleTestResult] = useState(42)

  const dispatch = useAppDispatch();
  const isNowSuperAdmin = useAppSelector(selectCurrentUserIsSuperAdmin);
  const isNowAdmin = useAppSelector(selectCurrentUserIsAdmin);
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

  const toggleIsSuperAdmin = () => {
    dispatch(setCurrentUserAsSuperAdmin(!isNowSuperAdmin))
  }

  const toggleIsAdmin = () => {
    dispatch(setCurrentUserAsAdmin(!isNowAdmin))
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
    console.log(`DBM: calling RegisteredUserP2.listByCanonicalEmailXP2() at ${Date.now() % 10000}`);
    await dbClient.models.RegisteredUserP2.listByCanonicalEmailXP2({ canonicalEmail: expectedCEmail }).then(
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
            console.log(`DBM: calling Memo.create() at ${Date.now() % 10000}`);
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
    console.log(`DBM: calling RegisteredUserP2.listByCanonicalEmailXP2() at ${Date.now() % 10000}`);
     await dbClient.models.RegisteredUserP2.listByCanonicalEmailXP2({ canonicalEmail: cEmail }).then(
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

  const testServerEmail = async () => {
    // toAddressess: string[]; subject: string; body: string
    const toAddresses = ['mccall.kim@gmail.com'];
    const subject = 'testSubject';
    const body= '<p>Some <b>lovely</b> message</>';
    sendServerEmail({toAddresses, subject, body } );
  }

  const testClientEmail = async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // toAddressess: string[]; subject: string; body: string
    const toAddresses = ['mccall.kim@gmail.com'];
    const subject = 'testSubject';
    const body= '<p>Some <b>lovely</b> message</>';
    sendClientEmail({toAddresses, subject, body } );
  }

  const handleMigrateDbClick = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    console.log("We're short-circuiting the migration, since it's alreaddy happened!");
    return;

  }

  return (
    <PageWrapper>
      <Flex className="play02page" direction="column" gap="6px">
        <Flex direction="column" gap="12px">
          <Flex direction={"row"}>
            <button onClick={() => toggleIsSuperAdmin()}>Toggle isSuperAdmin</button>
            <TextField
              label="value:"
              direction={"row"}
              value={'' + isNowSuperAdmin}
              readOnly
              placeholder="??"
              width="120px"
            />
            <button onClick={() => toggleIsAdmin()}>Toggle isAdmin</button>
            <TextField
              label="value:"
              direction={"row"}
              value={'' + isNowAdmin}
              readOnly
              placeholder="??"
              width="120px"
            />
          </Flex>
          <Flex direction={"row"}>
            <button onClick={() => checkDbAndShowResult()}>Check DB for corruption</button>
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
          </Flex>

          <Flex>
            <Button onClick={handleMigrateDbClick} disabled> Migrate User DB </Button>
            <button onClick={testServerEmail}>Test Server Email</button>
            <button onClick={testClientEmail}>Test Client Email</button>
          </Flex>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage02;
