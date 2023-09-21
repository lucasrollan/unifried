import { TimelineRow } from '@/types/timeline'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TimelineRow[]>
) {
    const token = await getToken({ req })
    if (token) {
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
