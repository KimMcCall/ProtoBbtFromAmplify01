import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state  
interface QueryLimitationState {
  listIssuesCallTime: number;
}

const initialState: QueryLimitationState = {
  listIssuesCallTime: 0,
};

export const queryLimitationSlice = createSlice({
  name: 'queryLimitation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setListIssuesCallTime: (state) => {
      state.listIssuesCallTime = Date.now();
    },
  },
})

export const { setListIssuesCallTime } = queryLimitationSlice.actions;

// Define a constant for the recency horizon in milliseconds
const msecToRecencyHorizon = 10 * 60 * 1000 // 10 minutes;
export const selectListIssuesCallTimeIsRecent = (state: RootState) =>
  Date.now() < state.persistedReducer.queryLimitation.listIssuesCallTime + msecToRecencyHorizon

export default queryLimitationSlice.reducer
