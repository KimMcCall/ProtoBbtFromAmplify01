import { useContext } from 'react';
import { UserContext } from '../App';
import PageWrapper from "../components/PageWrapper";

function ProfilePage() {
  const cachePair = useContext(UserContext);
  const userCache = cachePair.userCache;
  console.log("In ProfilePage, userCache=", userCache);
  const {isPhoney, isAdmin, isSuperAdmin, email, canonicalEmail, userId} = userCache;
  return (
    <PageWrapper>
      <h1>My Profile Page</h1>
      <div>
        You're on the (stub of the) Profile Page.
      </div>
      <div>
        `isPhoney` = {String(isPhoney)} <br />
        `isAdmin` = {String(isAdmin)} <br />
        `isSuperAdmin` = {String(isSuperAdmin)} <br />
        `email` = {String(email)} <br />
        `canonicalEmail` = {String(canonicalEmail)} <br />
        `userId` = {String(userId)} <br />
      </div>
    </PageWrapper>
  );
}

export default ProfilePage;
