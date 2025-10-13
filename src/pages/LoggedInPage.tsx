import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selecNext, setNextPath } from "../features/navigation/navigationSlice";
import { clearCurrentUserInfo, setCurrentUserInfo, SingleUserInfoType } from "../features/userInfo/userInfoSlice";
import { AuthUser } from "aws-amplify/auth";
import { computeUserStatus, toCanonicalEmail, UserStatusType } from "../utils/utils";
import { dbClient } from "../main";
import { useEffect } from "react";
import { cacheAbortedCallFrom, selectNowIsWithinRecencyHorizon, setLastLoginTimeToNow } from "../features/loginTracking/loginTracking";

function LoggedInPage(user: AuthUser) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userId, username, signInDetails } = user;

  const submittedAuthId = userId;
  const submittedEmail = signInDetails?.loginId || '';
  const newPath = useAppSelector(selecNext);
  const cEmail = toCanonicalEmail(submittedEmail);
  const showInfo = false;

  const isRepeated = useAppSelector(selectNowIsWithinRecencyHorizon);
  console.log(`isRepeated: ${isRepeated}; dispatching '${isRepeated ? 'cacheAbortedCallFrom' : 'setLastLoginTimeToNow'}'`)
  if (isRepeated) {
    dispatch(cacheAbortedCallFrom(submittedEmail));
  } else {
    dispatch(setLastLoginTimeToNow());
  }

  useEffect(() => {
    const handleLoginInfo = async () => {
      const statusAndUser = await computeUserStatus(submittedAuthId, submittedEmail);
      const status: UserStatusType = statusAndUser.status;
      const user = statusAndUser.user;

      let memoContent = `userId: ${submittedAuthId};\nusername: ${username};`;
      memoContent += `\nsignInDetails.loginId: ${signInDetails?.loginId};`;
      memoContent += `\nstatus: ${status}`;

      const memoData = {
        subject: 'LoginInfo',
        content: memoContent,
      };
      console.log(`DBM: calling Memo.create() at ${Date.now() % 10000}`);
      dbClient.models.Memo.create(memoData);

      const returning = status === 'returningRegistrant' || status === 'superAdmin' || status === 'admin';

      if (status === 'alias') {
        dispatch(clearCurrentUserInfo());
        dispatch(setNextPath('/alias'));
        navigate('/logout', { replace: true });
      } else if (status === 'banned') {
        dispatch(clearCurrentUserInfo());
        dispatch(setNextPath('/banned'));
        navigate('/logout', { replace: true });
      } else  if (status === 'bannedAlias') {
        dispatch(clearCurrentUserInfo());
        dispatch(setNextPath('/bannedAlias'));
        navigate('/logout', { replace: true });
      } else if (returning) {
        // Don't need to do anything more than let them in and set the redux state
        const initialEmail = signInDetails?.loginId || '';
        const reduxUser: SingleUserInfoType = {
          id: user.id,
          authId: submittedAuthId,
          name: user.name || '',
          canonicalEmail: cEmail,
          initialEmail: initialEmail,
          isSuperAdmin: status === 'superAdmin',
          isAdmin: status === 'admin' || status === 'superAdmin',
          isBanned: false,
          trustLevel: 0,
          withholdWelcome: false,
        };
        dispatch(setCurrentUserInfo(reduxUser));
        navigate(newPath, { replace: true });
    } else if (status === 'repeatedCall') {
      // Don't need to do anything except get them back on the right page
      navigate(newPath, { replace: true });
    } else if (status === 'uninitialized') {
      // YIIKES!! let's make a Memo and ask the user to notify us
      let memoContent = `computeUserStatus() returned: '${status}';`;
      memoContent += `\nusername: ${username};`;
      memoContent += `\nsignInDetails.loginId: ${signInDetails?.loginId};`;
      const memoData = {
        subject: 'BadUserStatus',
        content: memoContent,
      };
      console.log(`DBM: calling Memo.create() at ${Date.now() % 10000}`);
      dbClient.models.Memo.create(memoData);
      navigate('/uninitializedUserStatus', { replace: true });
    } else if (status === 'corrupted DB') {
      // YIIKES!! let's make a Memo and ask the user to notify us
      let memoContent = `computeUserStatus() returned: '${status}';`;
      memoContent += `\nusername: ${username};`;
      memoContent += `\nsignInDetails.loginId: ${signInDetails?.loginId};`;
      const memoData = {
        subject: 'BadUserStatus',
        content: memoContent,
      };
      console.log(`DBM: calling Memo.create() at ${Date.now() % 10000}`);
      dbClient.models.Memo.create(memoData);
      navigate('/corruptedDb', { replace: true });
    } else if (status === 'newRegistrant') {
      //
      const stuctToCreate = {
        authId: submittedAuthId,
        name: '',
        canonicalEmail: cEmail,
        initialEmail: submittedEmail,
        isSuperAdmin: false,
        isAdmin: false,
        isBanned: false,
        trustLevel: 0,
        withholdWelcome: false,
      };
      console.log(`DBM: calling RegisteredUser.create() at ${Date.now() % 10000}`);
      dbClient.models.RegisteredUser.create(stuctToCreate).then((newUser) => {
        const returnedUserRecord = newUser.data;
        if (returnedUserRecord) {
          const newReduxUser = {
            id: returnedUserRecord.id,
            authId: submittedAuthId,
            name: '',
            canonicalEmail: cEmail,
            initialEmail: submittedEmail,
            isSuperAdmin: false,
            isAdmin: false,
            isBanned: false,
            trustLevel: 0,
            withholdWelcome: false,
          };
          dispatch(setCurrentUserInfo(newReduxUser));
        }
      })
      navigate(newPath, { replace: true });
    } else {
      console.log(`Computed surprise stats: "${status}"`);
    }

    };

    handleLoginInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showInfo){
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>
        You're on the LoggedIn Page.
      </h2>
      <div>
        submittedAuthId: {submittedAuthId}
      </div>
      <div>
        username: {user.username}
      </div>
      <div>
        signInDetails.loginId: {user.signInDetails?.loginId}
      </div>
    </div>
  );
}

export default LoggedInPage;
