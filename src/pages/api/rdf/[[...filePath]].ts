import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import { readFile } from 'fs/promises'
import path from 'path'
import mime from 'mime-types'
import { castArray } from 'lodash'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in

        const filePath = castArray(req.query.filePath)
        const basePath = path.join(process.cwd(), 'rdf')
        const fullPath = path.join(basePath, ...filePath) + '.ttl'

        const data = await readFile(fullPath)

        const contentType = mime.lookup(fullPath)
        if (contentType) {
            res.setHeader('Content-Type', contentType)
        }

        res.status(200)
        res.send(data)
    } else {
        // Not Signed in
        throw new Error('ERR00008', {cause: 'Not authenticated'})
    }
}