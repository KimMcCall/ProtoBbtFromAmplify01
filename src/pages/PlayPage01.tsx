import { dbClient } from "../main";
import PageWrapper from "../components/PageWrapper";

const eMailToFind = "mccall.kim@gmail.com"

const findMasterUserWithCanonicalEmail = (eEmail: string) => {
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
}

function PlayPage01() {  
  return (
    <PageWrapper>
      <div>
        You're on the (stub of the) First Play Page.
      </div>
      <div>
        <button onClick={() => findMasterUserWithCanonicalEmail(eMailToFind)}>Show Master User</button>
      </div>
    </PageWrapper>
  );
}

export default PlayPage01;
