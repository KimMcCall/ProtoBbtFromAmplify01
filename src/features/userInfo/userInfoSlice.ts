import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
interface UserInfoState {
  id: string
  name: string
  canonicalEmail: string
  isAdmin: boolean
  isSuperAdmin: boolean
  isBanned: boolean
}

// Define the initial state using that type
const initialState: UserInfoState = {
  id: '',
  name: 'Unknoown Name',
  canonicalEmail: 'bogus@example.com',
  isAdmin: false,
  isSuperAdmin: false,
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
      state.name = newUser.name;
      state.canonicalEmail = newUser.canonicalEmail;
      state.isAdmin = newUser.isAdmin;
      state.isSuperAdmin = newUser.isSuperAdmin;
      state.isBanned = newUser.isBanned;
    },
    setAsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setAsSuperAdmin: (state, action: PayloadAction<boolean>) => {
      state.isSuperAdmin = action.payload;
    },
  },
})

export const { setUserInfo, setAsAdmin, setAsSuperAdmin } = userInfoSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUserId = (state: RootState) => state.userInfo.id
export const selectUserName = (state: RootState) => state.userInfo.name
export const selectCanonicalEmail = (state: RootState) => state.userInfo.canonicalEmail
export const selectIsAdmin = (state: RootState) => state.userInfo.isAdmin
export const selectIsSuperAdmin = (state: RootState) => state.userInfo.isSuperAdmin
export const selectIsBanned = (state: RootState) => state.userInfo.isBanned

export default userInfoSlice.reducer
