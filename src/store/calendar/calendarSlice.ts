import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '..'
import Calendar from '@/models/Calendar'
import Event from '@/models/Event'

export interface CalendarState {
    loading: boolean,
    eventsIdsByCalendarId: Record<string, string[]>,
    eventIds: string[],
    eventsById: Record<string, Event>,
    calendarIds: string[],
    calendarsById: Record<string, Calendar>,
    ignoredCalendarIds: string[],
    ephemeridesCalendarIds: string[], // calendars that mark things about the days (like holidays) but don't contain events
}

const initialState: CalendarState = {
    loading: false,
    eventsIdsByCalendarId: {},
    eventIds: [],
    eventsById: {},
    calendarIds: [],
    calendarsById: {},
    ignoredCalendarIds: [
        'p#weather@group.v.calendar.google.com',
    ],
    ephemeridesCalendarIds: [
        'a81586a68abd6c28b30d7623206f888676fbd7789aea0edc7b549f9759ec9c63@group.calendar.google.com', // birthdays
        'es.ar#holiday@group.v.calendar.google.com',
        'es.dutch#holiday@group.v.calendar.google.com',
    ]
}

const api_fetchCalendars = async function (): Promise<Calendar[]> {
    const result = await fetch('/api/calendars')
    return result.json()
}

const api_fetchCalendarEvents = async function (calendarIds: string[]): Promise<Record<string, Event[]>> {
    const startDate = '2023-01-01'
    const params = new URLSearchParams({
        calendarIds: calendarIds.join(','),
        startDate,
    })
    const result = await fetch('/api/calendarEvents?' + params)
    return await result.json()
}

export const fetchCalendarsAndEvents = createAsyncThunk(
    'gcal/fetchCalendarsAndEvents',
    async (args, thunkAPI) => {
        const action = await thunkAPI.dispatch(fetchCalendars())
        await thunkAPI.dispatch(fetchCalendarEvents())
    }
)

export const fetchCalendars = createAsyncThunk(
    'gcal/fetchCalendars',
    async () => {
        const calendars = await api_fetchCalendars()

        return calendars
    }
)

export const fetchCalendarEvents = createAsyncThunk(
    'gcal/fetchCalendarEvents',
    async (args, thunkAPI) => {
        const state = thunkAPI.getState() as RootState
        const calendarIds = state.calendar.calendarIds
            .filter(calendarId =>
                !state.calendar.ignoredCalendarIds.includes(calendarId))

        const response = await api_fetchCalendarEvents(calendarIds)
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
            const eventsByCalendarId = action.payload

            Object.keys(eventsByCalendarId).forEach(calendarId => {
                const events = eventsByCalendarId[calendarId]

                state.eventsIdsByCalendarId[calendarId] = events.map(event => event.id!)

                events.forEach(event => {
                    const eventId: string = event.id!
                    state.eventsById[eventId] = event

                    if (!state.eventIds.includes(eventId)) {
                        state.eventIds.push(eventId)
                    }
                })
            })
        })
        builder.addCase(fetchCalendars.fulfilled, (state, action) => {
            const calendars = action.payload

            calendars.forEach(calendar => {
                const calendarId: string = calendar.id!
                state.calendarsById[calendarId] = calendar

                if (!state.calendarIds.includes(calendarId)) {
                    state.calendarIds.push(calendarId)
                }
            })
        })
    },
})

// Action creators are generated for each case reducer function
export const {  } = gcalSlice.actions

export default gcalSlice.reducer