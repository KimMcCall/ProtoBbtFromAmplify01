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

export function toCanonicalEmail(email: string): string {
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
