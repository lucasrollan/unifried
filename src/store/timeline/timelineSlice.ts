import { TimelineEntry, TimelineRow } from '@/types/timeline'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TimelineState {
    startDate: string,
    endDate: string, //not inclusive
    dayWidthPx: number,
    rowIds: string[],
    rowsById: Record<string, TimelineRow>,
    entryIds: string[],
    entriesById: Record<string, TimelineEntry>,
}

const initialState: TimelineState = {
    startDate: '2023-07-15T00:00',
    endDate: '2024-03-01T00:00',
    dayWidthPx: 40,
    rowIds: [],
    rowsById: {},
    entryIds: [],
    entriesById: {},
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

                if (!state.entryIds.includes(entry.id)) {
                    state.entryIds.push(entry.id)
                }
            })
        })
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = timelineSlice.actions

export default timelineSlice.reducer