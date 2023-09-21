import { TimelineEntry, TimelineRow } from '@/types/timeline'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TimelineState {
    startDate: string,
    endDate: string, //not inclusive
    dayWidthPx: number,
    rowIds: string[],
    rowsById: Record<string, TimelineRow>,
    entriesById: Record<string, TimelineEntry>,
}

const initialState: TimelineState = {
    startDate: '2023-10-01T00:00',
    endDate: '2024-02-01T00:00',
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
            start: '2023-10-25T00:00',
            end: '2023-11-01T00:00',
            isHighlighted: true,
        },
        'skeletonWeek': {
            id: 'skeletonWeek',
            label: 'Skelingtong week',
            start: '2023-10-28T00:00',
            end: '2023-11-04T00:00',
        },
        'diningRoomPaneling': {
            id: 'diningRoomPaneling',
            label: 'Dining room paneling',
            start: '2023-10-03T00:00',
            end: '2023-10-15T00:00',
        },
    },
}

const api_fetchRows = async function (): Promise<TimelineRow[]> {
    const result = await fetch('/api/timeline/rows')
    return result.json()
}

export const fetchTimelineRows = createAsyncThunk(
    'timeline/fetchRows',
    async (thunkAPI) => {
        const response = await api_fetchRows()
        return response
    }
)

const api_fetchEntries = async function (): Promise<TimelineEntry[]> {
    const result = await fetch('/api/timeline/entries')
    return result.json()
}

export const fetchTimelineEntries = createAsyncThunk(
    'timeline/fetchEntries',
    async (thunkAPI) => {
        const response = await api_fetchEntries()
        return response
    }
)

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
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchTimelineRows.fulfilled, (state, action) => {
            const rows = action.payload
            console.log('rows', rows)

            rows.forEach(row => {
                if (!state.rowsById[row.id]) {
                    state.rowsById[row.id] = row
                }

                if (!state.rowIds.includes(row.id)) {
                    state.rowIds.push(row.id)
                }
            })
        })
        builder.addCase(fetchTimelineEntries.fulfilled, (state, action) => {
            const entries = action.payload
            console.log('entries', entries)

            entries.forEach(entry => {
                if (!state.entriesById[entry.id]) {
                    state.entriesById[entry.id] = entry
                }
            })
        })
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = timelineSlice.actions

export default timelineSlice.reducer