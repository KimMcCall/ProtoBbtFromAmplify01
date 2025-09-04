// import { dbClient } from "../main";
import { Flex, TextField, TextAreaField } from '@aws-amplify/ui-react';
import PageWrapper from "../components/PageWrapper";
import { useState } from 'react';

const eMailToFind = "mccall.kim@gmail.com";

const muDiv = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  width: "600px",
  height: "320px",
  backgroundColor: "#fff0f0",
};
const addDiv = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  width: "580px",
  height: "60px",
  backgroundColor: "#fff0f0",
};
const listDiv = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  width: "580px",
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

const findMasterUserWithCanonicalEmail = (eEmail: string) => {
  console.log("In PlayPage01, findMasterUserWithCanonicalEmail, NOT looking for", eEmail);
  /*
  const { data: masterUsers, errors } = await client.models.MasterUser.list({
    filter: {
      canonicalEmail: {
        eq: eEmail,
      }
    }
  });

  if (errors && errors.length > 0) {
    console.error("Error fetching MasterUser with canonicalEmail", eEmail, errors);
    return;
  }

  if (masterUsers.length === 0) {
    console.log("No MasterUser found with canonicalEmail", eEmail);
    return;
  }

  console.log("Found MasterUser(s) with canonicalEmail", eEmail, masterUsers);  
  */
  /*
  dbClient.models.MasterUser.query("byCanonicalEmail", eEmail).then((masterUsers) => {
    if (masterUsers.length === 0) {
      console.log("No MasterUser found with canonicalEmail", eEmail);
      return;
    } else {
      console.log("Found MasterUser(s) with canonicalEmail", eEmail, masterUsers);
    }
  }).catch((error: any) => {
    console.error("Error fetching MasterUser with canonicalEmail", eEmail, error);
  });
  */
}

const createMasterUser = (eEmail: string) => {
  console.log("In PlayPage01, createMasterUser, NOT creating record", eEmail);
}

function PlayPage01() { 
  const [ emailToCreate, setEMailToCreate ] = useState(eMailToFind);
  const [ foundMasterUser, setFoundMasterUser ] = useState("Wait for click");
  const [ userList, setUserList ] = useState("");

  const listMasterUsers = () => {
    const newContent = "user01@example.com\nuser02@example.com\nuser03@example.com\nuser04@example.com\nuser05@example.com\nuser06@example.com";
    setUserList(newContent);
  }

  return (
    <PageWrapper>
      <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" gap="6px">
        <h1>Play Page 01</h1>
        <div style={muDiv}>
          <div style={addDiv}>
            <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => createMasterUser(emailToCreate)}>Create Master User</button>
              <span>&nbsp;Email: </span>
              <TextField
                label=""
                value={emailToCreate}
                onChange={(e) => setEMailToCreate(e.target.value)}
                placeholder="Enter email"
                width="300px"
              />
            </Flex>
          </div>
          <div style={listDiv}>
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => listMasterUsers()}>List Master Users</button>
              <TextAreaField
                label=""
                value={userList}
                onChange={(e) =>{}}
                placeholder="Master User details will appear here"
                width="300px"
                height="180px" />
            </Flex>
          </div>
          <div style={showDiv}>
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => findMasterUserWithCanonicalEmail(emailToCreate)}>Find Master User</button>
              <TextField
                label=""
                value={foundMasterUser}
                onChange={(e) => setFoundMasterUser(e.target.value)}
                placeholder="Wait for click"
                width="300px"
              />
            </Flex>
          </div>

        </div>
      </Flex>
    </PageWrapper>
  );
}

export default PlayPage01;
