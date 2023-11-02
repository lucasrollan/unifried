import { getServerSession } from 'next-auth/next'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from "../auth/[...nextauth]"
import IFragment from '@/models/IFragment';
import FragmentRepository from '@/persistence/FragmentRepository';

const fragmentRepository = FragmentRepository.getInstance()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IFragment[]>
) {
    const session = await getServerSession(req, res, authOptions)

    if (session) {
        const { start, end } = req.query
        const rangeStart = start as string
        const exclusiveRangeEnd = end as string

        console.log(`GET fragments for range ${rangeStart} - ${exclusiveRangeEnd}`)
        const fragments = await fragmentRepository.getByDateRange(rangeStart, exclusiveRangeEnd)
        console.log('GET fragments response', fragments)

        // Signed in
        res.status(200).json(fragments)
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}