import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
export interface UserInfoState {
  id: string
  authId: string
  canonicalEmail: string
  initialEmail: string
  name: string
  isSuperAdmin: boolean
  isAdmin: boolean
  isBanned: boolean
}

// Define the initial state using that type
const initialState: UserInfoState = {
  id: '',
  authId: '',
  canonicalEmail: '',
  initialEmail: '',
  name: '',
  isSuperAdmin: false,
  isAdmin: false,
  isBanned: false,
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfoState>) => {
      const newUser = action.payload;
      state.id = newUser.id;
      state.authId = newUser.authId;
      state.canonicalEmail = newUser.canonicalEmail;
      state.initialEmail = newUser.initialEmail;
      state.name = newUser.name;
      state.isAdmin = newUser.isAdmin;
      state.isSuperAdmin = newUser.isSuperAdmin;
      state.isBanned = newUser.isBanned;
    },
    clearUserInfo: (state) => {
      state.id = '';
      state.authId = '';
      state.canonicalEmail = '';
      state.initialEmail = '';
      state.name = '';
      state.isAdmin = false;
      state.isSuperAdmin = false;
      state.isBanned = false;
    },
    setAsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    setAsSuperAdmin: (state, action: PayloadAction<boolean>) => {
      state.isSuperAdmin = action.payload;
    },
  },
})

export const { setUserInfo, clearUserInfo, setId, setAsAdmin, setAsSuperAdmin } = userInfoSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserId = (state: RootState) => state.userInfo.id
export const selectAuthId = (state: RootState) => state.userInfo.authId
export const selectUserName = (state: RootState) => state.userInfo.name
export const selectCanonicalEmail = (state: RootState) => state.userInfo.canonicalEmail
export const selectInitialEmail = (state: RootState) => state.userInfo.initialEmail
export const selectIsAdmin = (state: RootState) => state.userInfo.isAdmin
export const selectIsSuperAdmin = (state: RootState) => state.userInfo.isSuperAdmin
export const selectIsBanned = (state: RootState) => state.userInfo.isBanned

export default userInfoSlice.reducer
