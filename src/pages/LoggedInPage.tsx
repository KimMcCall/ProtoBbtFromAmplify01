import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selecNext } from "../features/navigation/navigationSlice";
import { setUserInfo, UserInfoState } from "../features/userInfo/userInfoSlice";
import { AuthUser } from "aws-amplify/auth";
import { toCanonicalEmail } from "../utils/utils";
import { dbClient } from "../main";
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
      name: userRecord?.name || '',
      canonicalEmail: userRecord?.canonicalEmail || '',
      isSuperAdmin: userRecord?.isSuperAdmin || false,
      isAdmin: userRecord?.isAdmin || false,
      isBanned: userRecord?.isBanned || false,
    };
    console.log("Calling setUserInfo with arg:", reduxUser);
    dispatch(setUserInfo(reduxUser))
  };
};*/

function LoggedInPage(user: AuthUser) {
  const { userId, username, signInDetails } = user;
  const memoData = {
    subject: 'LoginInfo',
    content: `userId: ${userId};\nusername: ${username};\nsignInDetails.loginId: ${signInDetails?.loginId};\nsignInDetails.authFlowType: ${signInDetails?.authFlowType}`,
  };
  dbClient.models.Memo.create(memoData);
  let newPath = useAppSelector(selecNext);
  newPath = newPath || '/';
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cEmail = toCanonicalEmail(signInDetails?.loginId || '');

  const reduxUser: UserInfoState = {
    id: userId,
    authId: signInDetails?.loginId || '',
    name: '',
    canonicalEmail: cEmail,
    isSuperAdmin: true,
    isAdmin: true,
    isBanned: false,
  }

  const saveUserToReduxAndNavigate = () => {
    dispatch(setUserInfo(reduxUser))
    navigate(newPath,  { replace: true });
  }

  saveUserToReduxAndNavigate();

  return (
    <PageWrapper>
      <div>
        You're on the (stub of the) LoggedIn Page.
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
