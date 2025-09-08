import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
export interface LoginTrackingState {
  lastLoginTime: number
  nAbortedRecents: number
  callerEmails: string[]
}

// Define the initial state using that type
const initialState: LoginTrackingState = {
  lastLoginTime: 100000,
  nAbortedRecents: 0,
  callerEmails: [],
}

export const loginTrackingSlice = createSlice({
  name: 'loginTracking',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    cacheAbortedCallFrom: (state, action: PayloadAction<string>) => {
      const email = action.payload;
      state.lastLoginTime = Date.now();
      state.nAbortedRecents += 1;
      state.callerEmails = state.callerEmails.concat(email);
    },
    resetTracking: (state) => {
      state.lastLoginTime = initialState.lastLoginTime;
      state.nAbortedRecents = initialState.nAbortedRecents;
      state.callerEmails = initialState.callerEmails;
    },
    setLastLoginTimeToNow: (state) => {
      const now = Date.now();
      state.lastLoginTime = now;
    },
  },
})

export const {
  cacheAbortedCallFrom,
  resetTracking,
  setLastLoginTimeToNow,
} = loginTrackingSlice.actions;

const msecToRecencyHorizon = 2000;
// Other code such as selectors can use the imported `RootState` type
export const selectFullState =  (state: RootState) => state.persistedReducer.loginTracking
export const selectRecencyHorizon =  (state: RootState) => state.persistedReducer.loginTracking.lastLoginTime + msecToRecencyHorizon
export const selectNowIsWithinRecencyHorizon = (state: RootState) =>
  Date.now() < state.persistedReducer.loginTracking.lastLoginTime + msecToRecencyHorizon

export default loginTrackingSlice.reducer
