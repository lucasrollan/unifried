import IFragment from '@/models/IFragment';
import Airtable from 'airtable';

import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import FragmentRepository from '@/persistence/FragmentRepository';

const fragmentRepository = FragmentRepository.getInstance()

var base = new Airtable().base('applyggDoSgqTOMEs');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IFragment | null>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const fragmentId = req.query.fragmentId as string

        if (req.method === 'GET') {
            const fragment = await fragmentRepository.getById(fragmentId)

            // Signed in
            res.status(200).json(fragment)
        } else if (req.method === 'POST') {
            const fragment = JSON.parse(req.body)
            const createdFragment = await fragmentRepository.create(fragment)

            // Signed in
            res.status(200).json(createdFragment)
        } else if (req.method === 'PATCH') {
            const fragment = JSON.parse(req.body)
            console.log('PATCH-ing fragment', fragment.id)
            const updatedFragment = await fragmentRepository.patch(fragment)

            // Signed in
            res.status(200).json(updatedFragment)
        }
    } else {
        // Not Signed in
        res.status(401).json(null)
    }
}