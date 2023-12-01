import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import IFragment from '@/models/IFragment'
import Character from '@/models/Character'
import FragmentRepository from '@/persistence/FragmentRepository'
import Fragment from '@/models/Fragment'


type ApiResponseError = {
    code: string,
    description: string,
}
type ApiResponse = {
    errors?: ApiResponseError[],
    updatedEntities?: {
        fragments?: IFragment[],
        characters?: Character[],
    }
}
type ApiRequestAction = {
    type: string,
    payload: Record<string, unknown>,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse>
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        // Not Signed in
        res.status(401).json({
            errors: [
                { code: 'ERR00001', description: 'Not signed in' },
            ]
        })
        return
    }

    if (req.method !== 'POST')  {
        res.status(405).json({
            errors: [
                { code: 'ERR00002', description: 'Method not supported' },
            ]
        })
        return
    }

    const action: ApiRequestAction = req.body.action

    if (!action) {
        res.status(400).json({
            errors: [
                { code: 'ERR00003', description: 'Invalid request' },
            ]
        })
        return
    }

    if (action.type === 'fragmentMarkedAsComplete') {
        const fragmentId = action.payload.fragmentId as string
        const fragmentData = await FragmentRepository.getInstance().getById(fragmentId)
        const fragment = new Fragment(fragmentData)

        fragment.markAsComplete()

        if (fragment.data.reward) {
            // const character = await CharacterRepository.getInstance().getCurrentCharacter()
            // character.addDailyReward(fragment.reward)
        }

        res.status(200).json({
            updatedEntities: {
                fragments: [fragment.data],
                // characters: [character],
            }
        })
    }

}