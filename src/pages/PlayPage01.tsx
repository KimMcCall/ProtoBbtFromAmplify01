import { dbClient } from "../main";
import { Flex, TextAreaField } from '@aws-amplify/ui-react';
import PageWrapper from "../components/PageWrapper";
import { useState } from 'react';

const muDiv = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  width: "1000px",
  height: "420px",
  backgroundColor: "#fff0f0",
};
const listDiv = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  width: "980px",
  height: "140px",
  backgroundColor: "#fff0f0",
};
const showDiv = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  width: "580px",
  height: "64px",
  backgroundColor: "#fff0f0",
};

const testGet = () => {
  console.log(`DBM: calling RegisteredUserP2.get() at ${Date.now() % 10000}`);
  dbClient.models.RegisteredUserP2.get({id: 'a9262597-4129-4b84-84a3-a0b991eeb052'})
  .then((response) => {
    const user = response.data;
    // if no match, returns user=null and errors=undefined
    console.log("Found User: ", user);
    console.log('with errors: ', response?.errors)
  });
};

const testSecondaryIndex = () => {
  console.log(`DBM: calling RegisteredUserP2.listByCanonicalEmailXP2() at ${Date.now() % 10000}`);
  dbClient.models.RegisteredUserP2.listByCanonicalEmailXP2({
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

  const listSuperAdmins = () => {
    console.log(`DBM: calling RegisteredUserP2.list() at ${Date.now() % 10000}`);
    dbClient.models.RegisteredUserP2.list()
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

  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
        <h1>Play Page 01</h1>
        <div style={muDiv}>
          <div style={listDiv}>
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
          <div style={showDiv}>
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => testGet()}>Test get()</button>
              <button onClick={() => testSecondaryIndex()}>Test Secondary Index()</button>
            </Flex>
          </div>
        </div>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage01;
