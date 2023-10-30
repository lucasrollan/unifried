import Fragment from '@/models/Fragment';
import Airtable from 'airtable';

import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

var base = new Airtable().base('applyggDoSgqTOMEs');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Fragment | null>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const fragmentId = req.query.fragmentId as string
        const fragmentIdObject = parseFragmentId(fragmentId)

        if (req.method === 'GET') {
            const fragment = await fetchFragmentFromAirtable(fragmentIdObject.id)

            // Signed in
            res.status(200).json(fragment)
        } else if (req.method === 'POST') {
            const fragment = JSON.parse(req.body)
            const createdFragment = await createFragmentInAirtable(fragment)

            // Signed in
            res.status(200).json(createdFragment)
        } else if (req.method === 'PATCH') {
            const fragment = JSON.parse(req.body)
            console.log('PATCH-ing fragment', fragment.id)
            const updatedFragment = await updateFragmentInAirtable(fragment)

            // Signed in
            res.status(200).json(updatedFragment)
        }
    } else {
        // Not Signed in
        res.status(401).json(null)
    }
}


async function fetchFragmentFromAirtable(id: string): Promise<Fragment> {
    return new Promise((resolve, reject) => {
        let result: Fragment | null = null

        base('fragments').find(id, function (err, record) {
            if (err) { console.error(err); return; }
            if (!record) {
                console.error('Record not found')
                reject()
                return
            }

            result = projectRow(record)
            console.log('Retrieved', result.id);

            resolve(result)
        })
    })
}

async function createFragmentInAirtable(fragment: Fragment): Promise<Fragment> {
    return new Promise((resolve, reject) => {
        base('fragments').create([fragment], function (err, records) {
            if (err) {
                console.error(err);
                reject()
                return;
            }
            if (!records) {
                return undefined
            }
            resolve(projectRow(records[0]))
        })
    })
}

async function updateFragmentInAirtable(fragment: Fragment): Promise<Fragment> {
    return new Promise((resolve, reject) => {
        const dbEntry = projectFragmentToAirtableRow(fragment) as any
        console.log('dbEntry', dbEntry)
        base('fragments').update([dbEntry], function (err: any, records: any) {
            if (err) {
                console.error(err);
                reject()
                return;
            }
            if (!records) {
                return undefined
            }
            resolve(projectRow(records[0]))
        })
    })
}

function projectRow(dbEntry: any): Fragment {
    return {
        ...dbEntry.fields,
        id: `airtable:::fragments:::${dbEntry.id}`,
    }
}

function projectFragmentToAirtableRow(fragment: Fragment): unknown {
    return {
        id: parseFragmentId(fragment.id).id,
        fields: {
            ...fragment,
            id: undefined,
            created: undefined,
            modified: undefined,
        }
    }
}

type IdObject = {
    system: 'airtable' | 'gcal' | string,
    container: string,
    id: string,
}

function parseFragmentId(fragmentId: string): IdObject {
    const [system, container, id] = fragmentId.split(':::')

    return {
        system,
        container,
        id
    }
}
