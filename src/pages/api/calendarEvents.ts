import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"g
import { google } from 'googleapis'

import type { NextApiRequest, NextApiResponse } from 'next'
import getGoogleAuth from './getGoogleAuth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const start = req.query.start as string || ''
    const end = req.query.end as string || ''

    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const events = await fetchEventsFromGoogleCalendar(new Date(start), new Date(end))

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

async function fetchEventsFromGoogleCalendar(start: Date, end: Date) {
  const calendar = google.calendar({version: 'v3', auth: googleAuth});
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items || [];

  return events
}