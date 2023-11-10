import { calendar_v3, google } from 'googleapis'
import getGoogleAuth from "@/pages/api/getGoogleAuth";
import Calendar from '@/models/Calendar';
import { GcalCalendar, GcalEvent } from '@/models/gcal';

const HIGHLIGHTED_CALENDARS_IDS = [
    '4ef5086e1cd0b60a8fc47e3e530b1144244b93b6b119e71f455f46a7f647286a@group.calendar.google.com', // PTOs
]

class GoogleCalendarConnector {
    private static instance: GoogleCalendarConnector | null = null
    private googleCalendar: calendar_v3.Calendar

    private constructor() {
        const googleAuth = getGoogleAuth()
        this.googleCalendar = google.calendar({ version: 'v3', auth: googleAuth });
    }

    static getInstance(): GoogleCalendarConnector {
        if (!GoogleCalendarConnector.instance) {
            GoogleCalendarConnector.instance = new GoogleCalendarConnector()
        }
        return GoogleCalendarConnector.instance
    }

    async listCalendars() {
        try {
            const calendarList = await this.googleCalendar.calendarList.list({
                showDeleted: false,
                showHidden: false,
            })

            const calendars: Calendar[] = await Promise.all(
                calendarList.data.items?.map(async calendarListItem => {
                    const response = await this.googleCalendar.calendars.get({
                        calendarId: calendarListItem.id || 'primary',
                    })
                    return projectGcalCalendarToApp(response.data)
                }) || []
            )

            return calendars
        } catch (e: any) {
            const err = e.response.data.error
            console.error('Something bad happened', err, e)
            return []
        }
    }

    async getEventsForCalendar(calendarId: string, startDate: string, endDate: string): Promise<GcalEvent[]> {
        const timeMin = startDate ? (new Date(startDate)).toISOString() : undefined
        const timeMax = endDate ? (new Date(endDate)).toISOString() : undefined

        const response = await this.googleCalendar.events.list({
            calendarId,
            timeMin,
            timeMax,
            singleEvents: true,
            orderBy: 'startTime',
        })

        return (response.data.items || [])
    }

    async getEventsByDateRange(startDate: string, endDate: string): Promise<GcalEvent[]> {
        const calendars = await this.listCalendars()

        const response = await Promise.all(
            calendars.map(async calendar =>
                this.getEventsForCalendar(calendar.id, startDate, endDate)
            )
        )

        return response.flat()
    }
}

function projectGcalCalendarToApp (gcalCalendar: GcalCalendar): Calendar {
    const isHighlighted = HIGHLIGHTED_CALENDARS_IDS.includes(gcalCalendar.id!)

    return ({
        id: gcalCalendar.id!,
        isVisible: true,
        label: gcalCalendar.summary!,
        isHighlighted,
    })
}

export default GoogleCalendarConnector