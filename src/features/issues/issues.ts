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

export interface IssueTypeXP2 {
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

export interface CommentBlockTypeXP2 {
  commentKey: string
  commentAuthorEmail: string
  time: string
  text: string
}

export interface IssuesTypeXP2 {
  issues: IssueTypeXP2[]
}

export interface IssueBlockForRenderingTypeXP2 {
  issueId: string
  claim: string
  proUrl: string
  conUrl: string
  proDocType: string,
  conDocType: string,
  comments: CommentBlockTypeXP2[]
}

export interface IssuesSliceTypeXP2 {
  issuesXP2: IssueTypeXP2[]
  displayBlocksXP2: IssueBlockForRenderingTypeXP2[]
  currentIssueId: string
}

// Define the initial state using that type
const initialIssueInstanceXP2: IssueTypeXP2 = {
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
const initialDisplayBlockInstanceXP2: IssueBlockForRenderingTypeXP2 = {
  issueId: '',
  claim: '',
  proUrl: '',
  conUrl: '',
  proDocType: '',
  conDocType: '',
  comments: [],
}

const initialState: IssuesSliceTypeXP2 = {
  issuesXP2: [initialIssueInstanceXP2],
  displayBlocksXP2: [initialDisplayBlockInstanceXP2],
  currentIssueId: '',
};

export const issuesSlice = createSlice({
  name: 'issues',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIssuesXP2: (state, action: PayloadAction<IssueTypeXP2[]>) => {
      const newIssues = action.payload;
      state.issuesXP2 = newIssues;
    },
    setDisplayBlocksXP2: (state, action: PayloadAction<IssueBlockForRenderingTypeXP2[]>) => {
      const newBlocks = action.payload;
      state.displayBlocksXP2 = newBlocks;
    },
    setCurrentIssueId: (state, action: PayloadAction<string>) => {
      state.currentIssueId = action.payload;
    },
  },
})

export const {
  setIssuesXP2,
  setDisplayBlocksXP2,
  setCurrentIssueId,
} = issuesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllIssuesXP2 =  (state: RootState) => state.persistedReducer.issues.issuesXP2;
export const selectAllDisplayBlocksXP2 =  (state: RootState) => state.persistedReducer.issues.displayBlocksXP2;
export const selectDisplayBlockForCurrentIssueXP2 =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allBlocks = state.persistedReducer.issues.displayBlocksXP2;
  const foundBlock = allBlocks.find((block) => block.issueId === issueId);
  return foundBlock;
}
export const selectSomeRecordForCurrentIssueXP2 =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allIssues = state.persistedReducer.issues.issuesXP2;
  const foundIssue = allIssues.find((issue) => issue.issueId === issueId);
  return foundIssue;
}

export default issuesSlice.reducer
