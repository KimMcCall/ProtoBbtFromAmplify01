import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

// Define a type for the slice state
interface NavigationState {
  currentPath: string
  nextPath: string
}

// Define the initial state using that type
const initialState: NavigationState = {
  currentPath: '/',
  nextPath: '/',
}

export const navigationSlice = createSlice({
  name: 'navigation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    navigateTo: (state, action: PayloadAction<string>) => {
      state.currentPath = action.payload;
    },
    setNextPath: (state, action: PayloadAction<string>) => {
      state.nextPath = action.payload;
    },
  },
})

export const { navigateTo, setNextPath } = navigationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selecCurrent = (state: RootState) => state.navigation.currentPath
export const selecNext = (state: RootState) => state.navigation.nextPath

export default navigationSlice.reducer

