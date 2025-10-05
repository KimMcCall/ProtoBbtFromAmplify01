import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

/*
// Define a type for the slice state
export interface IssueType {
  issueId: string
  claim: string
  proUrl: string
  conUrl: string
  proIsPdf: boolean
  conIsPdf: boolean
  proAuthorId: string
  conAuthorId: string
  makeAvailable: boolean
  commentKey: string
  commentId: string
  commentText: string
  authorId: string
  createdT: string
  updatedT: string
  priority: number
  commentType: string
  createdAt: string
  updatedAt: string
}
*/

export interface IssueType {
  issueId: string
  priority: number
  claim: string
  proUrl: string
  conUrl: string
  proDocType: string
  conDocType: string
  proAuthorEmail: string
  conAuthorEmail: string
  isAvailable: boolean
  commentKey: string
  commentText: string
  commentAuthorEmail: string
  createdT: string
  updatedT: string
  createdAt: string
  updatedAt: string
}

export interface CommentBlockType {
  commentKey: string
  commentAuthorEmail: string
  time: string
  text: string
}

export interface IssuesType {
  issues: IssueType[]
}

export interface IssueBlockForRenderingType {
  issueId: string
  claim: string
  proUrl: string
  conUrl: string
  proDocType: string,
  conDocType: string,
  comments: CommentBlockType[]
}

export interface IssuesSliceType {
  issues: IssueType[]
  availableIssues: IssueType[]  // Issues that are marked isAvailable=true
  displayBlocks: IssueBlockForRenderingType[]
  currentIssueId: string
}

// Define the initial state using that type
const initialIssueInstance: IssueType = {
  issueId: '',
  priority: 0,
  claim: '',
  proUrl: '',
  conUrl: '',
  proDocType: '',
  conDocType: '',
  proAuthorEmail: '',
  conAuthorEmail: '',
  isAvailable: false,
  commentKey: '',
  commentText: '',
  commentAuthorEmail: '',
  createdT: '',
  updatedT: '',
  createdAt: '',
  updatedAt: '',
}

// Define the initial state using that type
const initialDisplayBlockInstance: IssueBlockForRenderingType = {
  issueId: '',
  claim: '',
  proUrl: '',
  conUrl: '',
  proDocType: '',
  conDocType: '',
  comments: [],
}

const initialState: IssuesSliceType = {
  issues: [initialIssueInstance],
  availableIssues: [initialIssueInstance],
  displayBlocks: [initialDisplayBlockInstance],
  currentIssueId: '',
};

export const issuesSlice = createSlice({
  name: 'issues',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setAllIssues: (state, action: PayloadAction<IssueType[]>) => {
      const newIssues = action.payload;
      console.log(`issuesSlice: setting all issues; count = ${newIssues.length}`);
      state.issues = newIssues;
    },
    setAvailableIssues: (state, action: PayloadAction<IssueType[]>) => {
      const someIssues = action.payload;
      console.log(`issuesSlice: setting available issues; count = ${someIssues.length}`);
      state.availableIssues = someIssues;
    },
    setDisplayBlocks: (state, action: PayloadAction<IssueBlockForRenderingType[]>) => {
      const newBlocks = action.payload;
      state.displayBlocks = newBlocks;
    },
    setCurrentIssueId: (state, action: PayloadAction<string>) => {
      state.currentIssueId = action.payload;
    },
  },
})

export const {
  setAllIssues,
  setAvailableIssues,
  setDisplayBlocks,
  setCurrentIssueId,
} = issuesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllIssues =  (state: RootState) => state.persistedReducer.issues.issues;
export const selectAllAvailableIssues =  (state: RootState) => state.persistedReducer.issues.availableIssues;
export const selectCurrentIssueId =  (state: RootState) => state.persistedReducer.issues.currentIssueId;
export const selectCurrentIssue =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allIssues = state.persistedReducer.issues.issues;
  const currentIssue = allIssues.find((issue) => issue.issueId === issueId);
  return currentIssue;
}
export const selectAllDisplayBlocks =  (state: RootState) => state.persistedReducer.issues.displayBlocks;
export const selectDisplayBlockForCurrentIssue =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allBlocks = state.persistedReducer.issues.displayBlocks;
  const foundBlock = allBlocks.find((block) => block.issueId === issueId);
  return foundBlock;
}
export const selectLatestRecordForCurrentIssue =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allIssues = state.persistedReducer.issues.issues;
  const issuesForThisId = allIssues.filter((issue) => issue.issueId === issueId);
  let latestRecord: IssueType = issuesForThisId[0];
  // If none found, return an empty record
  if (issuesForThisId.length === 0) {
    return latestRecord;
  }
  // There should always be at least one record here
  // Find the latest by createdT
  // Sort by createdT descending
  issuesForThisId.forEach(issue => {
    if (issue.createdT > latestRecord.createdT) {
      latestRecord = issue;
    }
  });
  return latestRecord;
}

export default issuesSlice.reducer
