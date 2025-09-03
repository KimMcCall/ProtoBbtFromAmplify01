// utils.ts
import { getCurrentUser } from "aws-amplify/auth";

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
  let result = "Nothing";
  const plusLoc: number = lower.indexOf("+");
  if (plusLoc >= 0) {
    const ampLoc: number = lower.indexOf("@");
    const part1: string = lower.substring(0, plusLoc);
    const part2: string = lower.substring(ampLoc)
    result = part1 + part2;
  } else {
  result = lower;
  }
  return result;
} 
