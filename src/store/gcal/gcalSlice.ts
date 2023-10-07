import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '..'
import { GcalEvent } from '@/types/gcal'

export interface GcalState {
    loading: boolean,
    eventIds: string[],
    eventsById: Record<string, GcalEvent>,
}

const initialState: GcalState = {
    loading: false,
    eventIds: [],
    eventsById: {},
}

const api_fetchCalendarEvents = async function (startDate: string, endDate: string): Promise<any[]> {
    const params = new URLSearchParams({
        startDate,
        endDate,
    })
    const result = await fetch('/api/calendarEvents?' + params)
    return result.json()
}

export const fetchCalendarEvents = createAsyncThunk(
    'gcal/fetchCalendarEvents',
    async (args: void, thunkAPI) => {
        const state = thunkAPI.getState() as RootState
        const startDate = state.timeline.startDate
        const endDate = state.timeline.endDate

        const response = await api_fetchCalendarEvents(startDate, endDate)
        return response
    }
)

export const gcalSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchCalendarEvents.fulfilled, (state, action) => {
            const events = action.payload
            console.log('calendar events', events)

            events.forEach(event => {
                state.eventsById[event.id] = event

                if (!state.eventIds.includes(event.id)) {
                    state.eventIds.push(event.id)
                }
            })
        })
    },
})

// Action creators are generated for each case reducer function
export const {  } = gcalSlice.actions

export default gcalSlice.reducer