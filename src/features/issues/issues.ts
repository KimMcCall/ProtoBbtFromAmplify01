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

export interface CommentBlockType {
  commentKey: string
  authorEmail: string
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
  proIsPdf: boolean,
  conIsPdf: boolean,
  proComments: CommentBlockType[]
  conComments: CommentBlockType[]
}

export interface IssuesSliceType {
  issues: IssueType[]
  displayBlocks: IssueBlockForRenderingType[]
  currentIssueId: string
  proOrCon: string
}

/*
  issueId: string;
  claim: string;
  proUrl: string;
  conUrl: string;
  proIsPdf: boolean;
  conIsPdf: boolean;
  proAuthorId: string;
  conAuthorId: string;
  makeAvailable: boolean;
  commentKey: string;
  commentId: string;
  commentText: string;
  authorId: string;
  createdT: string;
  updatedT: string;
  priority: Nullable<number>;
  commentType: "PRO" | "CON" | null;
  readonly createdAt: string;
  readonly updatedAt: string;
*/

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

const initialState: IssuesSliceType = {
  issues: [initialIssueInstance],
  displayBlocks: [initialDisplayBlockInstance],
  currentIssueId: '',
  proOrCon: 'pro',
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
    setDisplayBlocks: (state, action: PayloadAction<IssueBlockForRenderingType[]>) => {
      const newBlocks = action.payload;
      state.displayBlocks = newBlocks;
    },
    setCurrentIssueId: (state, action: PayloadAction<string>) => {
      state.currentIssueId = action.payload;
    },
    setProOrCon: (state, action: PayloadAction<string>) => {
      state.proOrCon = action.payload;
    },
  },
})

export const {
  setIssues,
  setDisplayBlocks,
  setCurrentIssueId,
  setProOrCon,
} = issuesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllIssues =  (state: RootState) => state.persistedReducer.issues.issues;
export const selectAllDisplayBlocks =  (state: RootState) => state.persistedReducer.issues.displayBlocks;
export const selectDisplayBlockForCurrentIssue =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allBlocks = state.persistedReducer.issues.displayBlocks;
  const foundBlock = allBlocks.find((block) => block.issueId === issueId);
  return foundBlock;
}
export const selectSomeRecordForCurrentIssue =  (state: RootState) => {
  const issueId = state.persistedReducer.issues.currentIssueId;
  const allIssues = state.persistedReducer.issues.issues;
  const foundIssue = allIssues.find((issue) => issue.issueId === issueId);
  return foundIssue;
}
export const selectProOrCon =  (state: RootState) => state.persistedReducer.issues.proOrCon;

export default issuesSlice.reducer
