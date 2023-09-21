import { TimelineEntry } from '@/types/timeline'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TimelineEntry[]>
) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    // Signed in
    res.status(200).json([
      {
        id: 'TST0000001',
        label: 'Test 001',
        start: '2023-12-05',
        end: '2023-12-06',
        isHighlighted: true,
      }
    ])
  } else {
    // Not Signed in
    res.status(401).json([])
  }
}

