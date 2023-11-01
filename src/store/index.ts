import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import timelineSlice from './timeline/timelineSlice'
import calendarSlice from './calendar/calendarSlice'
import fragmentSlice from './fragments/fragmentSlice'
import actorsSlice from './actors/actorsSlice'

export const store = configureStore({
  reducer: {
    timeline: timelineSlice,
    calendar: calendarSlice,
    fragments: fragmentSlice,
    actors: actorsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector