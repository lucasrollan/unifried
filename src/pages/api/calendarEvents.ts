import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import Event from '@/models/Event';
import GoogleCalendarConnector from '@/persistence/GoogleCalendarConnector';
import { GcalEvent } from '@/models/gcal';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const calendarIdsCsl = req.query.calendarIds as string || ''
    const startDate = req.query.startDate as string || ''
    const endDate = req.query.endDate as string || ''

    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const calendarIds = calendarIdsCsl.split(',')
        const eventsByCalendar = await fetchEventsFromGoogleCalendar(calendarIds, startDate, endDate)

        // Signed in
        res.status(200).json(eventsByCalendar)
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}

async function fetchEventsFromGoogleCalendar(calendarIds: string[], startDate: string, endDate: string) {
    const googleCalendar = GoogleCalendarConnector.getInstance()

    const pairs = await Promise.all(
        calendarIds.map(async (calendarId) => {
            const events = await googleCalendar.getEventsForCalendar(calendarId, startDate, endDate)
            return {
                [calendarId]: events.map(projectGcalEventToApp)
            }
        })
    )

    const eventsByCalendar: Record<string, Event[]> =
        pairs.reduce((acc, pair) => ({
            ...acc,
            ...pair
        }), {})

    return eventsByCalendar
}

function projectGcalEventToApp (gcalEvent: GcalEvent): Event {
    return ({
        id: gcalEvent.id || '',
        label: gcalEvent.summary || '',
        start: gcalEvent.start?.dateTime || gcalEvent.start?.date || '',
        end: gcalEvent.end?.dateTime || gcalEvent.end?.date || '',
    })
}
