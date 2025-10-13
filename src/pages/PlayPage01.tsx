import { dbClient } from "../main";
import { Button, Flex, TextAreaField } from '@aws-amplify/ui-react';
import PageWrapper from "../components/PageWrapper";
import { useState } from 'react';
import { filterForUltimateAvailability, sortAndRepairIssues, structurePerIssue } from "../utils/utils";
import { useAppDispatch } from "../app/hooks";
import { setAllIssues, setAvailableIssues, setDisplayBlocks } from "../features/issues/issues";

const testGet = () => {
  console.log(`DBM: calling RegisteredUser.get() at ${Date.now() % 10000}`);
  dbClient.models.RegisteredUser.get({id: '08f930bf-44fe-419d-8610-c1c685a24f94'})
  .then((response) => {
    const user = response.data;
    // if no match, returns user=null and errors=undefined
    console.log("Found User: ", user);
    console.log('with errors: ', response?.errors)
  });
};

const testSecondaryIndex = () => {
  console.log(`DBM: calling RegisteredUser.listByCanonicalEmail() at ${Date.now() % 10000}`);
  dbClient.models.RegisteredUser.listByCanonicalEmail({
    canonicalEmail: 'mccall.kim@gmail.com',
  })
  .then((response) => {
    const users = response.data; // an array
    if (users.length < 1) {
      return;
    }
    const user = users[0];
    console.log("Found RegisteredUser: ", user); // contains id and everything
    console.log('with errors: ', response?.errors)
  });
}

function PlayPage01() { 
  const [ userList, setUserList ] = useState("");

  const dispatch = useAppDispatch();

  const listSuperAdmins = () => {
    console.log(`DBM: calling RegisteredUser.list() at ${Date.now() % 10000}`);
    dbClient.models.RegisteredUser.list()
    .then((response) => {
      const allUsers = response.data;
      const superUsers = allUsers.filter((user) => user.isSuperAdmin);
      if (superUsers.length === 0) {
        setUserList("No SuperAdmins found");
        return;
      }
      let newContent = "";
      superUsers.forEach((sa) => {
        console.log("in listSAs; sa:", sa);
        newContent += `Name: ***TBD***, Email: ${sa.canonicalEmail}, id: ${sa.id}\n`;
      });
      setUserList(newContent);
    })
    .catch((error) => {
      console.error("Error listing SuperAdmins", error);
      setUserList("Error listing SuperAdmins");
    });
  };

  const fetchAndCacheIssues = async () => {
    console.log(`DBM: calling IssueP2.list() at ${Date.now() % 10000}`);
    const response = await dbClient.models.IssueP2.list();
    const allIssues = response.data;
    console.log(`Fetched ${allIssues.length} issues`);


          const sortedAndRepairedIssues = sortAndRepairIssues(allIssues);
          console.log(`All ${sortedAndRepairedIssues.length} issues: `, sortedAndRepairedIssues);
          dispatch(setAllIssues(sortedAndRepairedIssues));
          const filteredForAvailable = filterForUltimateAvailability(sortedAndRepairedIssues);
          dispatch(setAvailableIssues(filteredForAvailable));
          // Structure per issue for rendering
          const structured = structurePerIssue(filteredForAvailable);
          dispatch(setDisplayBlocks(structured));
  };

  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
        <h1>Play Page 01</h1>
        <div className="pp01MuDiv">
          <div className="pp01ListDiv">
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => listSuperAdmins()}>List SuperAdmins</button>
              <TextAreaField
                label=""
                value={userList}
                readOnly
                placeholder="SuperAdmin details will appear here"
                width="800px"
                height="180px" />
            </Flex>
          </div>
          <div className="pp01ShowDiv">
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <Button onClick={fetchAndCacheIssues}>SA: Fetch Issues</Button>
              <Button onClick={testGet}>Test get()</Button>
              <Button onClick={testSecondaryIndex}>Test Secondary Index()</Button>
            </Flex>
          </div>
        </div>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage01;
