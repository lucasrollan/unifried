import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import { readFile } from 'fs/promises'
import path from 'path'
import mime from 'mime-types'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        // Signed in

        const fileName = req.query.fileName as string
        const basePath = path.join(process.cwd(), 'private')
        const fullPath = path.join(basePath, fileName)

        const data = await readFile(fullPath)

        const contentType = mime.lookup(fullPath)
        if (contentType) {
            res.setHeader('Content-Type', contentType)
        }

        res.status(200)
        res.send(data)
    } else {
        // Not Signed in
        throw new Error('ERR00005', {cause: 'Not authenticated'})
    }
}