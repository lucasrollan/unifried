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
            throw new Error('ERR00013', {cause: 'Missing argument "iri"'})
        }

        if (req.method === 'GET') {
            const url = await resourceRepository.getResourceFileUrl(iri)

            if (url) {
                console.log('redirecting to ', url)
                res.redirect(url)
            }
        } else {
            res.status(405)
            throw new Error('ERR00014', {cause:`Method not allowed: ${req.method}`})
        }

    } else {
        // Not Signed in
        throw new Error('ERR00015', {cause: 'Not authenticated'})
    }
}