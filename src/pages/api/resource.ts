import { getServerSession } from 'next-auth/next'
import { authOptions } from "./auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import { castArray } from 'lodash'
import ResourceRepository from '@/persistence/ResourceRepository'

const resourceRepository = ResourceRepository.getInstance()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in

        const iri = castArray(req.query.iri)[0]

        if (!iri) {
            throw new Error('ERR00010', {cause: 'Missing argument "iri"'})
        }

        if (req.method === 'GET') {
            const content = await resourceRepository.getResourceContent(iri)

            // Signed in
            res.status(200)
            res.send(content)
        } else {
            res.status(405)
            throw new Error('ERR00011', {cause:`Method not allowed: ${req.method}`})
        }

    } else {
        // Not Signed in
        throw new Error('ERR00012', {cause: 'Not authenticated'})
    }
}