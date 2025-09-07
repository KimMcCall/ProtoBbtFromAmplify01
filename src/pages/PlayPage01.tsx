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
  console.log("running test!")
  dbClient.models.RegisteredUser.get({id: 'fb54f3eb-7967-4b8b-ac82-fd256ff6c598'})
  .then((response) => {
    const user = response.data;
    // if no match, returns user=null and errors=undefined
    console.log("Found User: ", user);
    console.log('with errors: ', response?.errors)
  });
};

const testSecondaryIndex = () => {
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

  const listMasterUsers = () => {
    dbClient.models.MasterUser.list()
    .then((response) => {
      const masterUsers = response.data;
      if (masterUsers.length === 0) {
        setUserList("No MasterUsers found");
        return;
      }
      let newContent = "";
      masterUsers.forEach((mu) => {
        console.log("in listMUs; mu:", mu);
        newContent += `Name: ***TBD***, Email: ${mu.canonicalEmail}, UserId: ${mu.userId}\n`;
      });
      setUserList(newContent);
    })
    .catch((error) => {
      console.error("Error listing MasterUsers", error);
      setUserList("Error listing MasterUsers");
    });
  };

  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
        <h1>Play Page 01</h1>
        <div style={muDiv}>
          <div style={listDiv}>
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => listMasterUsers()}>List Master Users</button>
              <TextAreaField
                label=""
                value={userList}
                readOnly
                placeholder="Master User details will appear here"
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
