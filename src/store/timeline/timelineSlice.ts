import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type TimelineRow = {
    id: string,
    label: string,
    entryIds: string[],
}
type TimelineEntry = {
    id: string,
    label: string,
    start: Date,
    end: Date,
    isHighlighted?: boolean,
}

export interface TimelineState {
    startDate: Date,
    endDate: Date, //not inclusive
    dayWidthPx: number,
    rowIds: string[],
    rowsById: Record<string, TimelineRow>,
    entriesById: Record<string, TimelineEntry>,
}

const initialState: TimelineState = {
    startDate: new Date('2023-10-01T00:00'),
    endDate: new Date('2024-02-01T00:00'),
    dayWidthPx: 20,
    rowIds: ['holidays', 'houseProjects'],
    rowsById: {
        'holidays': {
            id: 'holidays',
            label: 'Holidays',
            entryIds: ['witchWeek', 'skeletonWeek'],
        },
        'houseProjects': {
            id: 'houseProjects',
            label: 'House Projects',
            entryIds: ['diningRoomPaneling'],
        },
    },
    entriesById: {
        'witchWeek': {
            id: 'witchWeek',
            label: 'Witch week 2',
            start: new Date('2023-10-25T00:00'),
            end: new Date('2023-11-01T00:00'),
            isHighlighted: true,
        },
        'skeletonWeek': {
            id: 'skeletonWeek',
            label: 'Skelingtong week',
            start: new Date('2023-10-28T00:00'),
            end: new Date('2023-11-04T00:00'),
        },
        'diningRoomPaneling': {
            id: 'diningRoomPaneling',
            label: 'Dining room paneling',
            start: new Date('2023-10-03T00:00'),
            end: new Date('2023-10-15T00:00'),
        },
    },
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