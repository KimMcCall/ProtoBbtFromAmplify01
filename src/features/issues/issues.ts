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

export interface IssueBlockForRenderingType {
  issueId: string
  claim: string
  proComments: CommentBlockType[]
  conComments: CommentBlockType[]
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
const initialInstance: IssueType = {
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

export interface IssuesType {
  issues: IssueType[]
}

const initialState: IssuesType = { issues: [initialInstance] };

export const issuesSlice = createSlice({
  name: 'issues',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<IssueType[]>) => {
      const issues = action.payload;
      const nIssues = issues.length;
      console.log(`In setIssues, nIssues: ${nIssues}`);
      state.issues = issues;
    },
    resetIssues: (state) => {
      console.log(`state BEFORE: `, state.issues);
      state.issues = [initialInstance];
      console.log(`state AFTER: `, state.issues);
    },
  },
})

export const {
  setIssues,
  resetIssues,
} = issuesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectFullState =  (state: RootState) => state.persistedReducer.issues;

export default issuesSlice.reducer
