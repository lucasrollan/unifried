import { TimelineEntry, TimelineRow } from '@/types/timeline'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import moment, { MomentInput } from 'moment'

export interface TimelineViewport {
    from: string, //first date visible on the viewport
    to: string, //first date not visible on the viewport
}
export interface TimelineState {
    startDate: string,
    endDate: string, //not inclusive
    viewport: TimelineViewport,
    daysInView: number,
    rowIds: string[],
    rowsById: Record<string, TimelineRow>,
    entryIds: string[],
    entriesById: Record<string, TimelineEntry>,
}

const defaultDaysInView = 14
const initialState: TimelineState = {
    startDate: '2023-07-15T00:00',
    endDate: '2024-03-01T00:00',
    // replace these 2 with viewport
    daysInView: defaultDaysInView,
    viewport: {
        from: moment().subtract(defaultDaysInView/2, 'days').format('YYYY-MM-DD'),
        to: moment().add(defaultDaysInView/2, 'days').format('YYYY-MM-DD'),
    },
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
        updateStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload
        },
        updateEndDate: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload
        },
        updateViewportScrollDays: (state, action: PayloadAction<number>) => {
            const currentDaysInView = moment(state.viewport.to).diff(state.viewport.from, 'day', true)
            const minFromDate = moment(state.startDate)
            const maxFromDate = moment(state.endDate).subtract(currentDaysInView, 'day')

            const fromDate = clampMoment(
                moment(state.startDate).add(action.payload, 'day'),
                minFromDate,
                maxFromDate
            )
            const toDate = moment(fromDate).add(currentDaysInView, 'day')

            state.viewport.from = fromDate.format('YYYY-MM-DD')
            state.viewport.to = toDate.format('YYYY-MM-DD')
        },
        updateDaysInView: (state, action: PayloadAction<number>) => {
            //state.daysInView = action.payload
            const viewport = state.viewport
            const currentDaysInView = moment(viewport.to).diff(viewport.from, 'day', true)
            const currentMiddle = moment(viewport.from).add(currentDaysInView/2, 'day')
            const newHalfSize = action.payload/2
            const from = moment(currentMiddle).subtract(newHalfSize, 'day').format('YYYY-MM-DD')
            const to = moment(currentMiddle).add(newHalfSize, 'day').format('YYYY-MM-DD')

            state.viewport = { from, to }
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

function clampMoment(input: MomentInput, min: MomentInput, max: MomentInput) {
    const values = [
        moment(input),
        moment(min),
        moment(max)
    ].sort((a, b) => a.valueOf() - b.valueOf())
    const lowerBound = moment.max(values[0], values[1])

    return moment.min(lowerBound, values[2])
}

// Action creators are generated for each case reducer function
export const { updateStartDate, updateEndDate, updateDaysInView, updateViewportScrollDays } = timelineSlice.actions

export default timelineSlice.reducer