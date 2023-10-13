import { TimelineEntry, TimelineRow } from '@/models/timeline'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'

export interface TimelineState {
    startDate: string,
    endDate: string, //not inclusive
    daysInView: number,
    rowIds: string[],
    rowsById: Record<string, TimelineRow>,
    entryIds: string[],
    entriesById: Record<string, TimelineEntry>,
    scrollPos: number,
}

const initialState: TimelineState = {
    startDate: moment().subtract(1, 'week').format('YYYY-MM-DD'),
    endDate: '2024-02-11T00:00',
    daysInView: 10,
    rowIds: [],
    rowsById: {},
    entryIds: [],
    entriesById: {},
    scrollPos: 0,
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
export const { updateStartDate, updateEndDate, updateDaysInView, updateScrollPos, scrollToNow } = timelineSlice.actions

export default timelineSlice.reducer