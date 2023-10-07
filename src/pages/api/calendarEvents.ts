import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"
import { google } from 'googleapis'

import type { NextApiRequest, NextApiResponse } from 'next'
import getGoogleAuth from './getGoogleAuth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const startDate = req.query.startDate as string || ''
    const endDate = req.query.endDate as string || ''

    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const events = await fetchEventsFromGoogleCalendar(startDate, endDate)

        // Signed in
        res.status(200).json([
            ...events!,
        ])
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}

const googleAuth = getGoogleAuth()

async function fetchEventsFromGoogleCalendar(startDate: string, endDate: string) {
    const calendar = google.calendar({ version: 'v3', auth: googleAuth });

    console.log('startDate,endDate: ', startDate, endDate)
    let response
    try {
        response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: (new Date(startDate)).toISOString(),
            timeMax: (new Date(endDate)).toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items || [];
        return events
    } catch (e: any) {
        const err = e.response.data.error
        console.error('Something bad happened', err, e)

    }
}