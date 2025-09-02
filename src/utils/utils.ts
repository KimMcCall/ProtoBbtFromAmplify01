// utils.ts
// import { getCurrentUser } from "aws-amplify/auth";

// export async function haveLoggedInUser(): Promise<boolean> {
export function haveLoggedInUser():  boolean {
  /*
    const showUserInfo = true;
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      if (showUserInfo) {
        console.log("Got current user");
        console.log("Username:", username);
        console.log("User ID:", userId);
        console.log("Sign-in Details:", signInDetails);
      }
      return true;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return false;
    }
    */
    return false;
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
