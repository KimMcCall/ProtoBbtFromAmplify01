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
  currentIssueId: ''
};

export const issuesSlice = createSlice({
  name: 'issues',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<IssueType[]>) => {
      const newIssues = action.payload;
      const nIssues = newIssues.length;
      console.log(`In setIssues, nIssues: ${nIssues}`);
      state.issues = newIssues;
    },
    resetIssues: (state) => {
      console.log(`state BEFORE: `, state.issues);
      state.issues = [initialIssueInstance];
      console.log(`state AFTER: `, state.issues);
    },
    setDisplayBlocks: (state, action: PayloadAction<IssueBlockForRenderingType[]>) => {
      const newBlocks = action.payload;
      const nBlocks = newBlocks.length;
      console.log(`In setDisplayBlocks, nBlocks: ${nBlocks}`);
      state.displayBlocks = newBlocks;
    },
    setCurrentIssueId: (state, action: PayloadAction<string>) => {
      state.currentIssueId = action.payload;
    },
  },
})

export const {
  setIssues,
  resetIssues,
  setDisplayBlocks,
  setCurrentIssueId,
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

export default issuesSlice.reducer
