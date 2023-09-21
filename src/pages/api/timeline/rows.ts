import { TimelineRow } from '@/types/timeline'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TimelineRow[]>
) {
  res.status(200).json([
    {
        id: 'ROW_TEST',
        label: 'Test',
        entryIds: ['TST0000001'],
    }
  ])
}
