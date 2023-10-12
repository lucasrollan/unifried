import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"
import { google } from 'googleapis'

import type { NextApiRequest, NextApiResponse } from 'next'
import getGoogleAuth from './getGoogleAuth';
import { GcalCalendar } from '@/models/gcal';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const events = await fetchCalendarsFromGoogleCalendar()

        // Signed in
        res.status(200).json([
            ...events,
        ])
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}

const googleAuth = getGoogleAuth()

async function fetchCalendarsFromGoogleCalendar() {
    const calendar = google.calendar({ version: 'v3', auth: googleAuth });

    try {
        const calendarList = await calendar.calendarList.list({
            showDeleted: false,
            showHidden: false,
        })

        const calendars: GcalCalendar[] = await Promise.all(
            calendarList.data.items?.map(async calendarListItem => {
                const response = await calendar.calendars.get({
                    calendarId: calendarListItem.id || 'primary',
                })
                return response.data
            }) || []
        )

        return calendars
    } catch (e: any) {
        const err = e.response.data.error
        console.error('Something bad happened', err, e)
        return []
    }
}