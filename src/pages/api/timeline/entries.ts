import { TimelineEntry } from '@/types/timeline'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TimelineEntry[]>
) {
  res.status(200).json([
    {
        id: 'TST0000001',
        label: 'Test 001',
        start: '2023-12-05',
        end: '2023-12-06',
        isHighlighted: true,
    }
  ])
}

