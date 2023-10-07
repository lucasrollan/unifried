import { configureStore } from '@reduxjs/toolkit'
import timelineSlice from './timeline/timelineSlice'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import gcalSlice from './gcal/gcalSlice'

export const store = configureStore({
  reducer: {
    timeline: timelineSlice,
    calendar: gcalSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector