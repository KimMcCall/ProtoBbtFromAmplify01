import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Flex, TextField } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import PageWrapper from "../components/PageWrapper";
import { selectCanonicalEmail, selectIsSuperAdmin, setAsSuperAdmin, setCanonicalEmail } from "../features/userInfo/userInfoSlice";
import { selecNext, setNextPath } from "../features/navigation/navigationSlice";
import { dbClient } from "../main";
import { computeUserStatus, toCanonicalEmail, UserStatusType } from "../utils/utils";

function PlayPage02() {
  const [ savedPath, setSavedPath] = useState("/donate");
  const [ userStatus, setUserStatus ] = useState("");
  const [simpleTestResult, setSimpleTestResult] = useState(42)
  const dispatch = useAppDispatch();
  const isNowSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const newPath = useAppSelector(selecNext);
  const navigateTo = useNavigate();

  const toggleIsAdmin = () => {
    dispatch(setAsSuperAdmin(!isNowSuperAdmin))
  }

  const goThere = () => { navigateTo(newPath); }

  const computeAndSetStatus = async () => {
    const computedStatus: UserStatusType = await testComputeStatus();
    setUserStatus(computedStatus);
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

    retVal = await computeUserStatus(submitteduthId, submittedEmail);
    return retVal;
  }

  const runSimpleTest = async () => {
    const count = await simpleTest();
    setSimpleTestResult(count);
  }

  const currentCEmail = useAppSelector(selectCanonicalEmail);

  const toggleCEmail = () => {
    let newValue = '';
    if (currentCEmail.length === 0) {
      newValue = 'random@example.com';
    }
    dispatch(setCanonicalEmail(newValue))
  }

  const clearOrFill = currentCEmail.length === 0 ? 'Fill' : 'Clear';

  return (
    <PageWrapper>
      <Flex direction="column">
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
        </Flex>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage02;
