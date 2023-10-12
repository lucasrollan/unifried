import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"
import { google } from 'googleapis'

import type { NextApiRequest, NextApiResponse } from 'next'
import getGoogleAuth from './getGoogleAuth';
import { GcalEvent } from '@/models/gcal';
import Event from '@/models/Event';

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
        console.log('REquest for calendar IDs', calendarIds)
        const eventsByCalendar = await fetchEventsFromGoogleCalendar(calendarIds, startDate, endDate)

        // Signed in
        res.status(200).json(eventsByCalendar)
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}

const googleAuth = getGoogleAuth()

async function fetchEventsFromGoogleCalendar(calendarIds: string[], startDate: string, endDate: string) {
    const calendarApi = google.calendar({ version: 'v3', auth: googleAuth })
    const timeMin = startDate ? (new Date(startDate)).toISOString() : undefined
    const timeMax = endDate ? (new Date(endDate)).toISOString() : undefined

    console.log('startDate,endDate: ', startDate, endDate)

    const pairs = await Promise.all(
        calendarIds.map(async (calendarId) => {
            const response = await calendarApi.events.list({
                calendarId,
                timeMin,
                timeMax,
                singleEvents: true,
                orderBy: 'startTime',
            })
            return {
                [calendarId]: (response.data.items || []).map(projectGcalEventToApp)
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