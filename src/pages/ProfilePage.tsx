import { Flex } from '@aws-amplify/ui-react';
import PageWrapper from "../components/PageWrapper";
import { selectCurrentUser } from '../features/userInfo/userInfoSlice';
import { useAppSelector } from '../app/hooks';

function ProfilePage() {
  const reduxUser =  useAppSelector(selectCurrentUser);
  const {id, authId, canonicalEmail, initialEmail, name, isSuperAdmin, isAdmin, isBanned, trustLevel, withholdWelcome} = reduxUser;
  return (
    <PageWrapper>
      <Flex direction={"column"}>
        <h1>My Profile Page</h1>
        <div>
          You're on the (stub of the) Profile Page.
        </div>
        <div>
          id: "{String(id)}"<br />
          authId: "{String(authId)}"<br />
          canonicalEmail: "{String(canonicalEmail)}"<br />
          initialEmail: "{String(initialEmail)}"<br />
          name: "{String(name)}" <br />
          isSuperAdmin: {String(isSuperAdmin)}<br />
          isAdmin: {String(isAdmin)}<br />
          trustLevel: {String(trustLevel)}<br />
          isBanned: {String(isBanned)}<br />
          withholdWelcome: {String(withholdWelcome)}<br /> 
        </div>
      </Flex>
    </PageWrapper>
  );
}

export default ProfilePage;
