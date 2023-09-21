import { TimelineEntry } from '@/types/timeline'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TimelineEntry[]>
) {
  const token = await getToken({ req })
  if (token) {
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

