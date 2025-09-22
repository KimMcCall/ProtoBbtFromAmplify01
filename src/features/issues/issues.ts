import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

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

export interface CommentBlockType {
  commentKey: string
  authorEmail: string
  time: string
  text: string
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

export interface IssueBlockForRenderingType {
  issueId: string
  claim: string
  proUrl: string
  conUrl: string
  proIsPdf: boolean,
  conIsPdf: boolean,
  proComments: CommentBlockType[]
  conComments: CommentBlockType[]
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

export interface IssuesSliceType {
  issues: IssueType[]
  issuesXP2: IssueTypeXP2[]
  displayBlocks: IssueBlockForRenderingType[]
  displayBlocksXP2: IssueBlockForRenderingTypeXP2[]
  currentIssueId: string
}

// Define the initial state using that type
const initialIssueInstance: IssueType = {
  issueId: '',
  claim: '',
  proUrl: '',
  conUrl: '',
  proIsPdf: false,
  conIsPdf: false,
  proAuthorId: '',
  conAuthorId: '',
  makeAvailable: false,
  commentKey: '',
  commentId: '',
  commentText: '',
  authorId: '',
  createdT: '',
  updatedT: '',
  priority: 0,
  commentType: '',
  createdAt: '',
  updatedAt: '',
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
const initialDisplayBlockInstance: IssueBlockForRenderingType = {
  issueId: '',
  claim: '',
  proUrl: '',
  conUrl: '',
  proIsPdf: false,
  conIsPdf: false,
  proComments: [],
  conComments: [],
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

const initialState: IssuesSliceType = {
  issues: [initialIssueInstance],
  issuesXP2: [initialIssueInstanceXP2],
  displayBlocks: [initialDisplayBlockInstance],
  displayBlocksXP2: [initialDisplayBlockInstanceXP2],
  currentIssueId: '',
};

export const issuesSlice = createSlice({
  name: 'issues',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<IssueType[]>) => {
      const newIssues = action.payload;
      state.issues = newIssues;
    },
    setIssuesXP2: (state, action: PayloadAction<IssueTypeXP2[]>) => {
      const newIssues = action.payload;
      state.issuesXP2 = newIssues;
    },
    setDisplayBlocks: (state, action: PayloadAction<IssueBlockForRenderingType[]>) => {
      const newBlocks = action.payload;
      state.displayBlocks = newBlocks;
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
  setIssues,
  setIssuesXP2,
  setDisplayBlocks,
  setDisplayBlocksXP2,
  setCurrentIssueId,
} = issuesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllIssues =  (state: RootState) => state.persistedReducer.issues.issues;
export const selectAllIssuesXP2 =  (state: RootState) => state.persistedReducer.issues.issuesXP2;
export const selectAllDisplayBlocks =  (state: RootState) => state.persistedReducer.issues.displayBlocks;
export const selectAllDisplayBlocksXP2 =  (state: RootState) => state.persistedReducer.issues.displayBlocksXP2;
export const selectDisplayBlockForCurrentIssue =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allBlocks = state.persistedReducer.issues.displayBlocks;
  const foundBlock = allBlocks.find((block) => block.issueId === issueId);
  return foundBlock;
}
export const selectDisplayBlockForCurrentIssueXP2 =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allBlocks = state.persistedReducer.issues.displayBlocksXP2;
  const foundBlock = allBlocks.find((block) => block.issueId === issueId);
  return foundBlock;
}
export const selectSomeRecordForCurrentIssue =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allIssues = state.persistedReducer.issues.issues;
  const foundIssue = allIssues.find((issue) => issue.issueId === issueId);
  return foundIssue;
}
export const selectSomeRecordForCurrentIssueXP2 =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allIssues = state.persistedReducer.issues.issuesXP2;
  const foundIssue = allIssues.find((issue) => issue.issueId === issueId);
  return foundIssue;
}

export default issuesSlice.reducer
