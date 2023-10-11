import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"
import { google } from 'googleapis'

import type { NextApiRequest, NextApiResponse } from 'next'
import getGoogleAuth from './getGoogleAuth';
import { GcalEvent } from '@/types/gcal';

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
    const timeMin = (new Date(startDate)).toISOString()
    const timeMax = (new Date(endDate)).toISOString()

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
                [calendarId]: response.data.items || []
            }
        })
    )


    const eventsByCalendar: Record<string, GcalEvent[]> =
        pairs.reduce((acc, pair) => ({
            ...acc,
            ...pair
        }), {})

    return eventsByCalendar
}