import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import IFragment from '@/models/IFragment'
import ICharacter from '@/models/ICharacter'
import FragmentRepository from '@/persistence/FragmentRepository'
import Fragment from '@/models/Fragment'
import FragmentService from '@/models/FragmentService'
import CharacterRepository from '@/persistence/CharacterRepository'


type ApiResponseError = {
    code: string,
    description: string,
}
export type ActionApiResponse = {
    errors?: ApiResponseError[],
    updatedEntities?: {
        fragments?: IFragment[],
        characters?: ICharacter[],
    }
}
export type ApiRequestAction = {
    type: string,
    payload: Record<string, unknown>,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ActionApiResponse>
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

    const body = JSON.parse(req.body)
    const action: ApiRequestAction = body.action
    console.log('action', action, 'type', typeof action)

    if (!action) {
        res.status(400).json({
            errors: [
                { code: 'ERR00003', description: 'Invalid request' },
            ]
        })
        return
    }

    if (action.type === 'fragmentCreated') {
        console.log('ACTION fragmentCreated')
        const fragmentPayload = action.payload.fragment as IFragment
        const fragmentData = await FragmentRepository.getInstance().create(fragmentPayload)
        const fragment = new Fragment(fragmentData)

        res.status(200).json({
            updatedEntities: {
                fragments: [fragment.data],
            }
        })
    }

    if (action.type === 'fragmentUpdated') {
        console.log('ACTION fragmentUpdated')
        const fragmentData = action.payload.fragment as IFragment

        const updatedFragment = await FragmentService.patchFragment(fragmentData.id, fragmentData)

        res.status(200).json({
            updatedEntities: {
                fragments: [updatedFragment.data],
            }
        })
    }

    if (action.type === 'fragmentMarkedAsCompleted') {
        console.log('ACTION fragmentMarkedAsCompleted')
        const fragmentId = action.payload.fragmentId as string
        const fragment = await FragmentRepository.getInstance().getById(fragmentId)

        const updatedFragment = await FragmentService.markFragmentAsCompleted(fragment)
        const updatedCharacter = await CharacterRepository.getInstance().getCurrentCharacter()

        res.status(200).json({
            updatedEntities: {
                fragments: [updatedFragment.data],
                characters: [updatedCharacter.data],
            }
        })
    }

}