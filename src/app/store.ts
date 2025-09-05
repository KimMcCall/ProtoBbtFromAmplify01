import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import navigationReducer from '../features/navigation/navigationSlice'
import userInfoReducer from '../features/userInfo/userInfoSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    navigation: navigationReducer,
    userInfo: userInfoReducer,
    /*
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
    */
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
