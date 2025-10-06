// utils.ts
import { getCurrentUser } from "aws-amplify/auth";
import { dbClient } from "../main";
import { CommentBlockType, IssueBlockForRenderingType, IssueType } from "../features/issues/issues";
import { msToLookBackForTallyCount, nSubmissionsAllowedPer24Hr, PlaceholderForEmptyComment, PlaceholderForEmptyUrl, submissionCountWarningThreashold } from "./constants";

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

type PermissionQueryResult = {
  granted: boolean
  explanation: string
}

export type UserStatusType = UserStatus;

export function getRandomIntegerInRange(min: number, max: number) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const checkForPermissionToSubmitGoogleDoc = async (currentUserId: string, url: string) => {
  const trustedConformance: PermissionQueryResult = await checkForTrustedPermission(currentUserId);
  if (trustedConformance.granted) {
    console.log(`Allowing Submission because user ${currentUserId} is trusted`)
    return { granted: true, explanation: "Submitter is trusted!" };  
  }

  const tallyConformance: PermissionQueryResult = await checkSubmissionTallyForPermission(currentUserId);
  if (!tallyConformance.granted) {
    console.warn(`Permission denied: ${tallyConformance.explanation}`);
    alert(`Permission denied: ${tallyConformance.explanation}`);
    return tallyConformance;
  }

  const policyConformance: PermissionQueryResult = await checkGoogleDocUrlForPolicyConformance(url);
  if (!policyConformance.granted) {
    console.warn(`Permission denied: ${policyConformance.explanation}`);
    alert(`Permission denied: ${policyConformance.explanation}`);
    return policyConformance;
  }
  return { granted: true, explanation: "It's all good!" };
};

export const checkForPermissionToSubmitText = async (currentUserId: string, str: string) => {
  const trustedConformance: PermissionQueryResult = await checkForTrustedPermission(currentUserId);
  if (trustedConformance.granted) {
    console.log(`Allowing Submission because user ${currentUserId} is trusted`)
    return { granted: true, explanation: "Submitter is trusted!" };  
  }

  const tallyConformance: PermissionQueryResult = await checkSubmissionTallyForPermission(currentUserId);
  if (!tallyConformance.granted) {
    console.warn(`Permission denied: ${tallyConformance.explanation}`);
    alert(`Permission denied: ${tallyConformance.explanation}`);
    return tallyConformance;
  }

  const policyConformance: PermissionQueryResult = await checkStringForPolicyConformance(str);
  if (!policyConformance.granted) {
    console.warn(`Permission denied: ${policyConformance.explanation}`);
    alert(`Permission denied: ${policyConformance.explanation}`);
    return policyConformance;
  }

  return { granted: true, explanation: "It's all good!" };
};

const checkGoogleDocUrlForPolicyConformance = async (url: string): Promise<PermissionQueryResult> => {
  // Simulate a policy conformance check
  console.log(`Checking policy conformance for document ${url}`);
  // Should make a call to Google API to check for abusiveness, etc
  // For now, we'll just approve all URLs
  return { granted: true, explanation: "Policy conformance check passed." };
};

const checkStringForPolicyConformance = async (str: string): Promise<PermissionQueryResult> => {
  // Simulate a policy conformance check
  const strToLog = str.length < 40 ? str : str.substring(0, 40) + '...';
  console.log(`Policy conformance check for string: ${strToLog}`);
  // Should make a call to Google API to check for abusiveness, etc
  // For now, we'll just approve all URLs
  return { granted: true, explanation: "Policy conformance check passed." };
};

export const getLatestRowWithIssueId = async (issueId: string) => {
  const myFilter = {
    filter: {
      issueId: { eq: issueId }
    }
  };
  // @ts-expect-error By the time I use this it won't be null
  let latestSoFar: IssueTypes = null;

  console.log(`DBM: calling IssueP2.list(filter) at ${Date.now() % 10000}`);
  await dbClient.models.IssueP2.list(myFilter)
  .then((response) => {
    const allRowsWithThisIssueId = response.data;
    if (allRowsWithThisIssueId.length < 1)  {
      const errorMsg = "Big SNAFU: Found no records with issueId: " + issueId
      alert(errorMsg);
      throw new Error(errorMsg);
    }
    latestSoFar = allRowsWithThisIssueId[0];
    allRowsWithThisIssueId.forEach((row) => {
      if (row.updatedT.localeCompare(latestSoFar.updatedT) > 0 ) {
        latestSoFar = row
      }
    }
  )
}
  )
  return latestSoFar;
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

// Dreaming: we want an integral 'time' value that
//   1) will fit within our DB's notion of a number (< 2^31)
//   2) won't roll over for a while
//   3) since we want (2), we'd like it to start around Sept 23, 2025 (as I'm writing this)
// So we'd like to ridiculously choose a 20-year roll-over period by taking the remainder of now / msInTwetyYears
// But, unfortunately, that number can get really high, since msInTwetyYears is *way* more than 2^31
// so we'll bite the bullet and set our radix to guarantee a number that will fit in the DB
// const ourRadix = 2147483648; // upperlimitOfDbInt: 2^31
const ourRadix = 2000000000; // just to play it a bit safe
// Unfortunately, this means that our clock will roll over once every 23 days or so
// const msPerDay = 1000 * 60 * 60 * 24; // approx 23.14
// const radixInDays = ourRadix / msPerDay;
// console.log(`radixInDays: ${radixInDays}`);
// const isoForClockStart = '2025-09-23T00:00:00.000Z';
// const epicTimeForClockStart = Date.parse(isoForClockStart);
// const epicTimeForClockStart = 1758585600000; // 2025-09-23T00:00:00.000Z
// console.log(`epicTimeForClockStart: ${epicTimeForClockStart}`);
// const truncatedClockStart = epicTimeForClockStart % ourRadix;
const truncatedClockStart = 585600000;
// const now = Date.now();
// console.log(`now: ${now}`);
// const truncatedToFitInDb = now % ourRadix;
// const zeroed = truncatedToFitInDb - truncatedClockStart;
// console.log(`zeroed: ${zeroed}`);

// const millisRadix = 1100000000;
// The biggest number our DB can handle is about 2147483648
// so we'll take the remainder when dividing by something close to half that

export const tallySubmission = (userId: string)=> {
  const epicMillis = Date.now();
  const dbCompatible = epicMillis % ourRadix;
  const zeroed = dbCompatible - truncatedClockStart;
  const createStruct = {
    userId: userId,
    timestamp: zeroed,
  };
  console.log(`DBM: calling IssueP2.create() at ${Date.now() % 10000}`);
  dbClient.models.SubmissionTally.create(createStruct).then(
    (response) => {console.log("SubmissionTally.create() response: ", response)}
  )
}

const checkForTrustedPermission = async (userId: string) => {
  const retVal: PermissionQueryResult = { granted: false, explanation: 'No trusted permission' };
  const idStruct = {id: userId}
  console.log(`DBM: calling RegisteredUserP2.get() at ${Date.now() % 10000}`);
  await dbClient.models.RegisteredUserP2.get(idStruct).then(
    (response) => {
      console.log(`in then() clause`)
      const user = response.data;
      const isTrusted = user?.isTrusted || user?.isAdmin || user?.isSuperAdmin || false;
      if (isTrusted) {
        retVal.granted = true;
        retVal.explanation = "User is trusted.";
      } else {
        retVal.explanation = "User is not trusted.";
      }
    }
  )
  return retVal;
}

const checkSubmissionTallyForPermission = async (userId: string) => {
  const retVal: PermissionQueryResult = { granted: false, explanation: 'No trusted permission' };
  const myArgStruct = { userId: userId};
  console.log(`DBM: calling SubmissionTally.byUserId() at ${Date.now() % 10000}`);
  await dbClient.models.SubmissionTally.byUserId(myArgStruct).then(
    (result) => {
      const tallyRecords = result.data;
      const now = Date.now();
      const truncatedNow = now % ourRadix;
      const timeHorizon = truncatedNow - msToLookBackForTallyCount;
      const recentRecords = tallyRecords.filter(record => Date.parse(record.createdAt) > timeHorizon)
      const nRecents = recentRecords.length;
      console.log(`nRecents: ${nRecents}`)
      if (nRecents < submissionCountWarningThreashold) {
        retVal.granted = true;
        retVal.explanation = "User has not exceeded submission limit.";
      } else if (nRecents === submissionCountWarningThreashold) {
        const msg = `To avoid an avalanche, we only permit ${nSubmissionsAllowedPer24Hr} submissions per 24 hour period. Just letting you know that since this is submission number ${nRecents + 1} for you, your next one is likely to be rejected unless you wait a while.`;
        alert(msg);
        retVal.granted = true;
        retVal.explanation = "User is at submission limit.";
      } else {
        /* nRecents > submissionCountWarningThreashold */
        const msg = `To avoid an avalanche, we only permit ${nSubmissionsAllowedPer24Hr} submissions per 24 hour period. Since you're looking to exceed this, I'm afraid we have to reject your submission for now.`;
        alert(msg);
        retVal.granted = false;
        retVal.explanation = "User has exceeded submission limit.";
      }
    }
  )
  return retVal;
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

  console.log(`DBM: calling RegisteredUserP2.listByAuthIdXP2() at ${Date.now() % 10000}`);
  await dbClient.models.RegisteredUserP2.listByAuthIdXP2({
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
              console.log(`DBM: calling Memo.create() at ${Date.now() % 10000}`);
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
  console.log(`DBM: calling RegisteredUserP2.listByAuthIdXP2() at ${Date.now() % 10000}`);
  await dbClient.models.RegisteredUserP2.listByCanonicalEmailXP2({ canonicalEmail: cEmail }).then(
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

interface SharedIdGroupType {
  groupPriority: number
  issues: IssueType[]
}

export const sortAndRepairIssues = (issues: IssueType[]) => {
  const groupedById: SharedIdGroupType[] = groupById(issues);
  const sortedByUpdate: SharedIdGroupType[] = sortEachGroupByUpdateT(groupedById);
  const sortedByPriority: SharedIdGroupType[] = sortByDecreasingPriority(sortedByUpdate);
  const reunitedIssues: IssueType[] = uniteGroups(sortedByPriority);
  const repairedIssues = repairPlaceholderStrings(reunitedIssues);
  return repairedIssues;
}

const groupById =  (issues: IssueType[]) => {
  const issueIdSet = new Set();
  issues.forEach((issue) => { issueIdSet.add(issue.issueId)});
  let myGroups: SharedIdGroupType[] = [];
  // @ts-expect-error I only put strings into the Set, so that's all I'll get out
  issueIdSet.forEach((issueId: string) => {
    let latestUpdateT = '0';
    let priorityOfLatest = -1;
    const issuesWithThisId = issues.filter(issue => {
      return issue.issueId === issueId
    });
    issuesWithThisId.forEach(issue => {
      if (issue.updatedT > latestUpdateT) {
        latestUpdateT = issue.updatedT;
        priorityOfLatest = issue.priority;
      }
    })
    const group: SharedIdGroupType = { groupPriority: priorityOfLatest, issues: issuesWithThisId };
    myGroups = myGroups.concat(group);
  });
  return myGroups;
}

const sortEachGroupByUpdateT = (groups: SharedIdGroupType[]) => {
  let sortedGroups: SharedIdGroupType[] = [];
  groups.forEach(group => {
    const issues = group.issues;
    const sortedIssues = issues.sort((a, b) => a.updatedT.localeCompare(b.updatedT));
    group.issues = sortedIssues;
    sortedGroups = sortedGroups.concat(group);
  });
  return sortedGroups;
}

const sortByDecreasingPriority = (issueGroups: SharedIdGroupType[]) => {
  issueGroups.sort((a, b) => {
    return 0 - (a.groupPriority - b.groupPriority);
  })
  return issueGroups;
}

const uniteGroups = (groups: SharedIdGroupType[]) => {
  let issues: IssueType[] = [];
  groups.forEach(group => {
    const groupIssues = group.issues;
    groupIssues.forEach (issue => {
      issues = issues.concat(issue);
    })
  })
  return issues;
}

const repairPlaceholderStrings = (issues: IssueType[]) => {
  const repairedIssues = issues.map((issue) => {
    if (issue.proUrl === PlaceholderForEmptyUrl) {
      issue.proUrl = '';
    }
    if (issue.conUrl === PlaceholderForEmptyUrl) {
      issue.conUrl = '';
    }
    if (issue.commentText === PlaceholderForEmptyComment) {
      issue.commentText = '';
    }
    return issue;
  });
  return repairedIssues;
}

export const structurePerIssue = (listOfIssues: IssueType[]) => {
  const issueIdSet = new Set();
  listOfIssues.forEach((issue) => { issueIdSet.add(issue.issueId)});
  let myStructs: IssueBlockForRenderingType[]  = [];
  // @ts-expect-error I only put strings into the Set, so that's all I'll get out
  issueIdSet.forEach((issueId: string) => {
    const struct: IssueBlockForRenderingType = createRenderingStuctForIssueId(issueId, listOfIssues)
    myStructs = myStructs.concat(struct);
  });
  return myStructs;
}

const createRenderingStuctForIssueId = (issueId: string, issues: IssueType[]) => {
  const issuesForThisId = issues.filter((issue) => issue.issueId === issueId);
  // since we want the value of the latest one, we'll just override these each time through
  let claim = '';
  let proUrl = '';
  let conUrl = '';
  let proDocType = '';
  let conDocType = '';
  let comments: CommentBlockType[] = [];

  issuesForThisId.forEach((issue) => {
    claim = issue.claim;
    proUrl = issue.proUrl;
    conUrl = issue.conUrl;
    proDocType = issue.proDocType;
    conDocType = issue.conDocType;
    const isEmpty = issue.commentText === PlaceholderForEmptyComment;
    if (isEmpty) {
      return;
    }
    const commentStruct: CommentBlockType = {
      commentKey: issue.commentKey,
      commentAuthorEmail: issue.commentAuthorEmail,
      time: issue.updatedT,
      text: issue.commentText,
    };
    comments = comments.concat(commentStruct);
  });
  const retVal: IssueBlockForRenderingType = {
    issueId,
    claim,
    proUrl,
    conUrl,
    proDocType,
    conDocType,
    comments,
  }
  return retVal;
}
