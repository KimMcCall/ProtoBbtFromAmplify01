import { combineReducers, configureStore } from '@reduxjs/toolkit'

// Found the following by googling "redux toolkit resilient to page refresh"
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import navigationReducer from '../features/navigation/navigationSlice'
import userInfoReducer from '../features/userInfo/userInfoSlice'
import loginTrackingReducer from  '../features/loginTracking/loginTracking'
import issuesReducer from  '../features/issues/issues'


const persistConfig = {
  key: 'root',
  storage,
};

const combinedReducer = combineReducers({
  userInfo: userInfoReducer,
  navigation: navigationReducer,
  loginTracking: loginTrackingReducer,
  issues: issuesReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: {
    // navigation: navigationReducer,
    // userInfo: userInfoReducer,
    persistedReducer
  },
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
