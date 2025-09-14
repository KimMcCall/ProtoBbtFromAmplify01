// utils.ts
import { getCurrentUser } from "aws-amplify/auth";
import { dbClient } from "../main";

type UserStatus =
"returningRegistrant" |
"superAdmin" |
"admin" |
"newRegistrant" |
"alias" |
"banned" |
"bannedAlias" |
"repeatedCall"  |
"uninitialized"|
"corrupted DB";

type DBUser = {
    authId: string;
    canonicalEmail: string;
    initialEmail: string;
    isSuperAdmin: boolean;
    isAdmin: boolean;
    isBanned: boolean;
    name: string | null;
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
}

type UserStatusAndUser = {
  status: UserStatus
  user: DBUser
}

export type UserStatusType = UserStatus;

export function getRandomIntegerInRange(min: number, max: number) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function haveLoggedInUser(): Promise<boolean> {
    const showUserInfo = true;
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      if (showUserInfo) {
        console.log("in utils.ts, Got current user");
        console.log("ut: Username:", username);
        console.log("ut: User ID:", userId);
        console.log("ut: loginId:", signInDetails?.loginId);
        console.log("ut: returning true from haveLoggedInUser()");
      }
      return true;
    } catch (error) {
      console.error("ut: Error in getCurrentUser(); returning false", error);
      return false;
    }
}

export async function cacheUserInfo(setUserCache: (arg0: { isPhoney: boolean; isAdmin: boolean; isSuperAdmin: boolean; email: string; canonicalEmail: string; userId: string; }) => void) {
    const showUserInfo = true;
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      if (showUserInfo) {
        console.log("in utils.ts, Got current user");
        console.log("ut: Username:", username);
        console.log("ut: User ID:", userId);
        console.log("ut: loginId:", signInDetails?.loginId);
      }
      const email = signInDetails && signInDetails.loginId ? signInDetails.loginId : "bogusEmail+22@gmail.com";
      const canonical = toCanonicalEmail(email);
      const userInfo = {
        isPhoney: false,
        isAdmin: true,
        isSuperAdmin: true,
        email: email,
        canonicalEmail: canonical,
        userId: userId,
      }
      setUserCache(userInfo);
    } catch (error) {
      // Fallback to a bogus user if there's an error
      console.error("ut: Error in cacheUserInfo(); installing bogus user into context", error);
      const bogusUserInfo = {
        isPhoney: true,
        isAdmin: false,
        isSuperAdmin: false,
        email: "canonicalEmail+BOGUS@gmail.com",
        canonicalEmail: "canonicalEmail@gmail.com",
        userId: "dsoowr989rhsfaflweru_BOGUS"
      };
      setUserCache(bogusUserInfo);
    }
}

export function toCanonicalEmail(email: string): string {
  if (!email) {
    return "bogusEmail@example.com";
  }
  const lower: string = email.trim().toLowerCase();
  const plusLoc: number = lower.indexOf("+");

  if (plusLoc >= 0) {
    const ampLoc: number = lower.indexOf("@");
    const part1: string = lower.substring(0, plusLoc);
    const part2: string = lower.substring(ampLoc);
    return part1 + part2;
  } else {
    return lower;
  }
} 

export function isRecent(timeString: string, nSecs: number) {
  // Does the timeString represent a time that is less than nSeecs in the past?
  const submittedTime = Date.parse(timeString);
  const maxGap = nSecs * 1000;
  const horizon = submittedTime + maxGap; // Anything before horizon is not recent
  const now = Date.now();
  return now < horizon;
}

export const computeUserStatus = async (submittedAuthId: string, submittedEmail: string): Promise<UserStatusAndUser> => {
  let retVal: UserStatus = 'uninitialized';

  let foundUser: DBUser = {
    authId: '',
    canonicalEmail: '',
    initialEmail: '',
    isSuperAdmin: false,
    isAdmin: false,
    isBanned: false,
    name: '',
    id: '',
    createdAt: '',
    updatedAt: '',
  };

  await dbClient.models.RegisteredUser.listByAuthId({
    authId: submittedAuthId,
  }).then (
    async (response) => {
      const records = response.data;
      if (records.length === 0) {
        console.log(`1) in OUTER records.length === 0 branch (No record has authId: "${submittedAuthId}")`);
        // There is no record with this authId;
        // Must be 'newRegistrant' || 'alias' || 'bannedAlias'
        const innerResult = await innerComputeStatus(submittedEmail);
        retVal = innerResult;
      } else if (records.length === 1) {
        console.log(`in OUTER records.length === 1 branch (Оне record has authId: "${submittedAuthId}")`)
        // Normal case of one record with this authId
        // Must be 'returningRegistrant' || 'superAdmin' || 'admin' || 'banned' || 'repeatedCall'
          foundUser = records[0];
          console.log("foundUser: ", foundUser);
          if (foundUser.isBanned) {
            retVal = 'banned';
            return undefined;
          }
          if (foundUser.isSuperAdmin) {
            retVal = 'superAdmin';
            return undefined;
          }
          if (foundUser.isAdmin) {
            retVal = 'admin';
            return undefined;
          }
          const createdAtString = foundUser.createdAt;
          if (isRecent(createdAtString, 5)) { // in last 5 seconds
            console.log('recdent; returning "repeatedCall"')
            retVal = 'repeatedCall';
            return undefined;
          } else {
            console.log('There\'s a DB record with submitted authID, but NOT recent');
            if (foundUser.initialEmail != submittedEmail) {
              // found a record with matching authId but different email
              // I don't see how this could ever happen
              const feebackStr = `found an existing record with submittedAuthId (${submittedAuthId}) but different initialEmail (${foundUser.initialEmail}) vs submittedEmail (${submittedEmail}). This should neever happen, so returning: 'corrupted DB'`;

              const memoData = {
                subject: 'Login Issue',
                content: feebackStr,
              };
              dbClient.models.Memo.create(memoData);

              console.log(feebackStr);
              retVal = 'corrupted DB';
              return;
            }
            console.log('returning "returningRegistrant"')
            retVal = 'returningRegistrant';
            return undefined;
          }
      } else {
        // We have a bug that alloweed us to have multiple records with same authId
        retVal = 'corrupted DB';
        console.log('corrupted DB w/ multiple records with same authId')
        return undefined;
      }
    }
  )
  console.log(`at final return, returning "${retVal}"`);
  const fullRetVal = {
    status: retVal,
    user: foundUser
    };
  return fullRetVal;
}

const innerComputeStatus = async (email: string): Promise<UserStatus>  => {
  let retVal: UserStatus = 'uninitialized';
  const cEmail = toCanonicalEmail(email);
  // if there's a record with this canonicalEmal, then we're dealing with an alias
  console.log(`2) listing records with canonicalEmail: ${cEmail}`);
  await dbClient.models.RegisteredUser.listByCanonicalEmail({ canonicalEmail: cEmail }).then(
    (response) => {
      console.log('3) Back from call to listByCanonicalEmail()')
      const usersWithMatchingCanonicalEmail = response.data;
      console.log(`4) usersWithMatchingCanonicalEmail.length: ${usersWithMatchingCanonicalEmail.length}`);
      if (usersWithMatchingCanonicalEmail.length === 0) {
        console.log("5a) in INNER records.length === 0 branch; returning: newRegistrant");
        retVal = 'newRegistrant';
      } else {
        console.log("5b) in INNER records.length !== 0 branch; should return: alias || bannedAlias");
        // We're dealing with an alias. Let's distinguish between banned ones and not banned
        const thisUser = usersWithMatchingCanonicalEmail[0];
        if (thisUser.isBanned) {
          retVal = 'bannedAlias'
        } else {
          retVal = 'alias';
        }
      }
    }
  )
  console.log(`returning ${retVal} from end of innerComputeStatus`)
  return retVal;
}
