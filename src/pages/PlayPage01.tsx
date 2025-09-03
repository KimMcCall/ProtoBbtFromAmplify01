import PageWrapper from "../components/PageWrapper";
import { generateClient } from 'aws-amplify/data';
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

const eMailToFind = "mccall.kim@gmail.com"

const { data: masterUsers, errors } = await client.models.MasterUser.list({
  filter: {
    canonicalEmail: {
      eq: eMailToFind,
    }
  }
});

const findMasterUserWithCanonicalEmail = (eEmail: string) => {
  /*
  const { data: masterUsers, errors } = await client.models.MasterUser.list({
    filter: {
      canonicalEmail: {
        eq: eEmail,
      }
    }
  });
  */

  if (errors && errors.length > 0) {
    console.error("Error fetching MasterUser with canonicalEmail", eEmail, errors);
    return;
  }

  if (masterUsers.length === 0) {
    console.log("No MasterUser found with canonicalEmail", eEmail);
    return;
  }

  console.log("Found MasterUser(s) with canonicalEmail", eEmail, masterUsers);  
}

function PlayPage01() {
  return (
    <PageWrapper>
      <div>
        You're on the (stub of the) First Play Page.
      </div>
      <div>
        <button onClick={() => findMasterUserWithCanonicalEmail("mccall.kim@gmail.com")}>Show Master User</button>
      </div>
    </PageWrapper>
  );
}

export default PlayPage01;
