import { TimelineRow } from '@/types/timeline'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TimelineRow[]>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in
        res.status(200).json([
            {
                id: 'ROW_TEST',
                label: 'Test',
                entryIds: ['TST0000001'],
            }
        ])
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}
