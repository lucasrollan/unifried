import { TimelineEntry, TimelineRow } from '@/models/timeline'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export interface TimelineState {
    startDate: string,
    endDate: string, //not inclusive
    daysInView: number,
    scrollPos: number,
}

const initialState: TimelineState = {
    startDate: moment().subtract(1, 'week').format('YYYY-MM-DD'),
    endDate: '2024-02-11T00:00',
    daysInView: 10,
    scrollPos: 0,
}

export const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        updateStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload
        },
        updateEndDate: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload
        },
        updateDaysInView: (state, action: PayloadAction<number>) => {
            state.daysInView = action.payload
        },
        updateScrollPos: (state, action: PayloadAction<number>) => {
            state.scrollPos = action.payload
        },
        scrollToNow: (state) => {
            state.scrollPos = 1000
        }
    },
    extraReducers: (builder) => {
    },
})

// Action creators are generated for each case reducer function
export const { updateStartDate, updateEndDate, updateDaysInView, updateScrollPos, scrollToNow } = timelineSlice.actions

export default timelineSlice.reducer