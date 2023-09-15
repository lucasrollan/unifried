import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TimelineState {
    startDate: Date,
    endDate: Date, //not inclusive
    dayWidthPx: number,
}

const initialState: TimelineState = {
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-02-01'),
    dayWidthPx: 20,
}

export const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        increment: (state) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.dayWidthPx += 1
        },
        decrement: (state) => {
            state.dayWidthPx -= 1
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.dayWidthPx += action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = timelineSlice.actions

export default timelineSlice.reducer