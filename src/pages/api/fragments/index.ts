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
        const fragments = await fragmentRepository.getAll()

        // Signed in
        res.status(200).json(fragments)
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}