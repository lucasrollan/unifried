import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in
        const iri = [req.query.iri].flat()[0]

        if (!iri) {
            res.status(400)
            throw new Error('ERR000006', {cause: 'Missing IRI query parameter'})
        }

        const data = await fetch(iri)
        const content = await data.text()
        res.status(data.status)
        res.send(content)
    } else {
        // Not Signed in
        throw new Error('ERR00007', {cause: 'Not authenticated'})
    }
}