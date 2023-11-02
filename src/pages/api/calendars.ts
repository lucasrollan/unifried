import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import GoogleCalendarConnector from '@/persistence/GoogleCalendarConnector';
import Calendar from '@/models/Calendar';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Calendar[]>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const googleCalendar = GoogleCalendarConnector.getInstance()
        const calendars = await googleCalendar.listCalendars()

        // Signed in
        res.status(200).json([
            ...calendars,
        ])
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}