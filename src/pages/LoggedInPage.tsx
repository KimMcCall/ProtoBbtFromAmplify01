import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selecNext, setNextPath } from "../features/navigation/navigationSlice";
import { clearUserInfo, setUserInfo, UserInfoState } from "../features/userInfo/userInfoSlice";
import { AuthUser } from "aws-amplify/auth";
import { computeUserStatus, toCanonicalEmail, UserStatusType } from "../utils/utils";
import { dbClient } from "../main";
import { useEffect } from "react";
// import { dbClient } from "../main";


/*
const fetchUser = (userId: string) => {
  return async (dispatch: (arg0: { type: string; payload: any; }) => void, getState: any) => {
    // dispatch({ type: 'FETCH_USERS_REQUEST' });
    const response = await dbClient.models.RegisteredUser.get({ id: userId });
    const userRecord = response.data;
    const err = response.errors;
    if (err) {
      console.log("Error on get(): ", err)
      return;
    }
    const reduxUser: UserInfoState = {
      id: userId,
      name: userRecord?.name,
      canonicalEmail: userRecord?.canonicalEmail,
      isSuperAdmin: userRecord?.isSuperAdmin,
      isAdmin: userRecord?.isAdmin,
      isBanned: userRecord?.isBanned,
    };
    console.log("Calling setUserInfo with arg:", reduxUser);
    dispatch(setUserInfo(reduxUser))
  };
};*/

function LoggedInPage(user: AuthUser) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userId, username, signInDetails } = user;

  const submittedAuthId = userId;
  const submittedEmail = signInDetails?.loginId || '';
  const newPath = useAppSelector(selecNext);
  const cEmail = toCanonicalEmail(submittedEmail);

  useEffect(() => {
    const handleLoginInfo = async () => {
      const status: UserStatusType = await computeUserStatus(submittedAuthId, submittedEmail);

      let memoContent = `userId: ${userId};\nusername: ${username};`;
      memoContent += `\nsignInDetails.loginId: ${signInDetails?.loginId};`;
      memoContent += `\nsignInDetails.authFlowType: ${signInDetails?.authFlowType}`;
      memoContent += `\nstatus: ${status}`;

      const memoData = {
        subject: 'LoginInfo',
        content: memoContent,
      };
      dbClient.models.Memo.create(memoData);

      const returning = status === 'returningRegistrant' || status === 'superAdmin' || status === 'admin';

      if (status === 'alias') {
        dispatch(clearUserInfo());
        dispatch(setNextPath('/alias'));
        navigate('/logout', { replace: true });
      } else if (status === 'banned') {
        dispatch(clearUserInfo());
        dispatch(setNextPath('/banned'));
        navigate('/logout', { replace: true });
      } else  if (status === 'bannedAlias') {
        dispatch(clearUserInfo());
        dispatch(setNextPath('/bannedAlias'));
        navigate('/logout', { replace: true });
      } else if (returning) {
        // Don't need to do anything more than let them in and set the redux state
        const initialEmail = signInDetails?.loginId || '';
        const reduxUser: UserInfoState = {
          id: '',
          authId: userId,
          name: '',
          canonicalEmail: cEmail,
          initialEmail: initialEmail,
          isSuperAdmin: status === 'superAdmin',
          isAdmin: status === 'admin' || status === 'superAdmin',
          isBanned: false,
        };
        dispatch(setUserInfo(reduxUser));
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
        };
        dbClient.models.MasterUser.create(stuctToCreate).then((newUser) => {
          console.log("Created new MasterUser with canonicalEmail", cEmail, newUser);
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
            };
            dispatch(setUserInfo(newReduxUser));
          }
        }).catch((error) => {
          console.log("Error creating MasterUser with canonicalEmail", cEmail, error);
        });
        navigate(newPath, { replace: true });
      } else {
        //
        console.log(`Computed surprise stats: "$${status}"`);
      }

    };

    handleLoginInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper>
      <div>
        You're on the LoggedIn Page.
      </div>
      <div>
        userId: {userId}
      </div>
      <div>
        username: {user.username}
      </div>
      <div>
        signInDetails.loginId: {user.signInDetails?.loginId}
      </div>
    </PageWrapper>
  );
}

export default LoggedInPage;
