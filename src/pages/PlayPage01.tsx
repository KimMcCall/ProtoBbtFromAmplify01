import { dbClient } from "../main";
import { Flex, TextField, TextAreaField } from '@aws-amplify/ui-react';
import PageWrapper from "../components/PageWrapper";
import { useState } from 'react';

// Define the MasterUser type
type MasterUserType = {
  id: string;
  canonicalEmail: string;
  userId: string;
};

const eMailToFind = "mccall.kim@gmail.com";

const muDiv = {
  border: "1px solid black",
  padding: "10px",
  margin: "10px",
  width: "1000px",
  height: "420px",
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

function findMatchingMasterUser(cEmail: string): MasterUserType | null {
  dbClient.models.MasterUser.list()
  .then((response) => {
    const masterUsers = response.data;
    if (masterUsers.length === 0) {
      return null;
    }
    const matchingUser = masterUsers.find((el) => el.canonicalEmail === cEmail);
    return matchingUser;
  })
  .catch((error) => {
    console.error("Error listing MasterUsers", error);
    return null;
  });
  return null;
}

const createMasterUser = (cEmail: string) => {
  const stuctToCreate = {
    canonicalEmail: cEmail,
    userId: "userId_" + Math.floor(Math.random() * 1000000).toString(),
  };
  console.log("In PlayPage01, createMasterUser, creating", stuctToCreate);
  // client.models.MasterUser.create(stuctToCreate).then((newUser) => {
  //   console.log("Created new MasterUser with canonicalEmail", cEmail, newUser);
  // }).catch((error: any) => {
  //   console.error("Error creating MasterUser with canonicalEmail", cEmail, error);
  // });
  dbClient.models.MasterUser.create(stuctToCreate).then((newUser) => {
    console.log("Created new MasterUser with canonicalEmail", cEmail, newUser);
  }).catch((error) => {
    console.error("Error creating MasterUser with canonicalEmail", cEmail, error);
  });
}

const updateNameOfMasterUser = (canonicalEmail: string, /*newName: string*/) => {
  const matchingUser = findMatchingMasterUser(canonicalEmail);
  if (!matchingUser) {
    return;
  }
  // const recordId = matchingUser.id;
  // dbClient.models.MasterUser.update( )
  console.log("In updateNameOfMasgerUser, aborting")
}

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
  const [ emailToCreate, setEMailToCreate ] = useState(eMailToFind);
  const [ userList, setUserList ] = useState("");
  const [ foundMasterUser, setFoundMasterUser ] = useState("Wait for click");
  const [newName, setNewName ] = useState("New Name");

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

  const showMatchingMasterUser = (cEmail: string) => {
    const matchingUser = findMatchingMasterUser(cEmail);
      if (matchingUser) {
        let myText = cEmail;
        myText += " id: ";
        myText += matchingUser.userId;
        setFoundMasterUser(myText);
      } else {
        console.log("No matching MasterUser found for", cEmail)
        setFoundMasterUser("No matchin MasterUser found");
      }

    dbClient.models.MasterUser.list()
    .then((response) => {
      const masterUsers = response.data;
      if (masterUsers.length === 0) {
        setFoundMasterUser("No MasterUsers found");
        return;
      }

      const matchingUser = masterUsers.find((el) => el.canonicalEmail === cEmail)
      if (matchingUser) {
        let myText = cEmail;
        myText += " id: ";
        myText += matchingUser.userId;
        setFoundMasterUser(myText);
      } else {
        console.log("No matching MasterUser found for", cEmail)
      }
    })
    .catch((error) => {
      console.error("Error listing MasterUsers", error);
      setFoundMasterUser("Error listing MasterUsers");
    });
  };

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
                readOnly
                placeholder="Master User details will appear here"
                width="800px"
                height="180px" />
            </Flex>
          </div>
          <div style={showDiv}>
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => showMatchingMasterUser(emailToCreate)}>Find Master User</button>
              <TextField
                label=""
                value={foundMasterUser}
                readOnly
                placeholder="Wait for click"
                width="400px"
              />
            </Flex>
          </div>
          <div style={showDiv}>
             <Flex direction="row" justifyContent="flex-start" alignItems="center" wrap="nowrap" gap="6px">
              <button onClick={() => updateNameOfMasterUser(emailToCreate, /*newName*/)}>Update Name</button>
              <TextField
                label=""
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Wait for click"
                width="400px"
              />
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
