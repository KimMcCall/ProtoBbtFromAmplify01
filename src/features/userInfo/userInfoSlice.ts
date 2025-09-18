// userInfoSlice.ts
 
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
export interface SingleUserInfoType {
  id: string
  authId: string
  canonicalEmail: string
  initialEmail: string
  name: string
  isSuperAdmin: boolean
  isAdmin: boolean
  isBanned: boolean
}

export interface UserSliceType {
  currentUser: SingleUserInfoType
  allUsers: SingleUserInfoType[]
}

// Define the initial state using that type
const basicInitialUser: SingleUserInfoType = {
  id: '',
  authId: '',
  canonicalEmail: '',
  initialEmail: '',
  name: '',
  isSuperAdmin: false,
  isAdmin: false,
  isBanned: false,
}

const basicInitialState: UserSliceType = {
  currentUser: basicInitialUser,
  allUsers: [],
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: basicInitialState,
  reducers: {
    setCurrentUserInfo: (state, action: PayloadAction<SingleUserInfoType>) => {
      const newUser = action.payload;
      const shallowCopy = { ...newUser };
      state.currentUser = shallowCopy;
    },
    clearCurrentUserInfo: (state) => {
      state.currentUser = { ...basicInitialUser }
      /*
      state.id = '';
      state.authId = '';
      state.canonicalEmail = '';
      state.initialEmail = '';
      state.name = '';
      state.isAdmin = false;
      state.isSuperAdmin = false;
      state.isBanned = false;
      */
    },
    setCurrentUserAsAdmin: (state, action: PayloadAction<boolean>) => {
      state.currentUser.isAdmin = action.payload;
    },
    setCurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentUser.id = action.payload;
    },
    setCurrentUserCanonicalEmail: (state, action: PayloadAction<string>) => {
      state.currentUser.canonicalEmail = action.payload;
    },
    setCurrentUserAsSuperAdmin: (state, action: PayloadAction<boolean>) => {
      state.currentUser.isSuperAdmin = action.payload;
    },
    setAllUsers: (state, action: PayloadAction<SingleUserInfoType[]>) => {
      const submittedArray = action.payload;
      const copiedArray = submittedArray.map(user => { return { ...user }});
      state.allUsers = copiedArray;
    }
  },
})

export const {
  setCurrentUserInfo,
  clearCurrentUserInfo,
  setCurrentUserId,
  setCurrentUserCanonicalEmail,
  setCurrentUserAsAdmin,
  setCurrentUserAsSuperAdmin,
  setAllUsers,
} = userInfoSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentUserId = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser ? state.persistedReducer.userInfo.currentUser.id : ''

export const selectCurrentUserAuthId = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser ? state.persistedReducer.userInfo.currentUser.authId : ''

export const selectCurrentUserName = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser ? state.persistedReducer.userInfo.currentUser.name : 'Unnkown User'

export const selectCurrentUserCanonicalEmail = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser ? state.persistedReducer.userInfo.currentUser.canonicalEmail : ''

export const selectCurrentUserInitialEmail = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser ? state.persistedReducer.userInfo.currentUser.initialEmail : ''

export const selectCurrentUserIsAdmin = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser && state.persistedReducer.userInfo.currentUser.isAdmin

export const selectCurrentUserIsSuperAdmin = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser && state.persistedReducer.userInfo.currentUser.isSuperAdmin

export const selectCurrentUserIsBanned = (state: RootState) =>
  state.persistedReducer.userInfo.currentUser && state.persistedReducer.userInfo.currentUser.isBanned

export const selectCurrentUserIsLoggedIn =  (state: RootState) =>
  state.persistedReducer.userInfo.currentUser && state.persistedReducer.userInfo.currentUser.canonicalEmail.length > 0

export const selectCurrentUser =  (state: RootState) => state.persistedReducer.userInfo.currentUser

export const selectAllUsers = (state: RootState) => state.persistedReducer.userInfo.allUsers

export default userInfoSlice.reducer
