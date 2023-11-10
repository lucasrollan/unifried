import Airtable from 'airtable';

import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import Character from '@/models/Character';
import RewardTokensDayEntry from '@/models/RewardTokensDayEntry';
import { AirtableDbEntry, projectAirtableDbEntryToEntity, projectEntityToAirtableDbEntry } from '@/persistence/AirtableDbEntry';
import { fetchCharactersFromAirtable } from '..';

var base = new Airtable().base('applyggDoSgqTOMEs');

export type UpdatedRewardTokensResponse = {
    character?: Character,
    rewardTokens: RewardTokensDayEntry[],
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UpdatedRewardTokensResponse | null>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const characterId = req.query.characterId as string

        if (req.method === 'GET') {
            const dailyRewardTokens = await fetchRewardTokensForCharacter(characterId)

            res.status(200).json({
                rewardTokens: dailyRewardTokens,
            })
        }
        if (req.method === 'POST') {
            const { amount, date } = JSON.parse(req.body) as { amount: number, date: string }

            const updatedTokens = await addRewardTokensInAirtable(date, amount)

            const characters = await fetchCharactersFromAirtable()
            const currentCharacter = characters.find(character => character.id === characterId)

            const characterToUpdate = {
                ...currentCharacter!,
                tokens: (currentCharacter!.tokens || 0) + amount,
            }

            const updatedCharacter = await updateCharacterInAirtable(characterToUpdate)

            // Signed in
            res.status(200).json({
                character: updatedCharacter,
                rewardTokens: [updatedTokens],
            })
        }
    } else {
        // Not Signed in
        res.status(401).json(null)
    }
}

async function addRewardTokensInAirtable(date: string, amount: number): Promise<RewardTokensDayEntry> {
    const rewardTokensForDate = await fetchRewardTokensForDate(date)
    const rewardTokensForDateUpdated = {
        ...rewardTokensForDate,
        fields: {
            ...rewardTokensForDate.fields,
            amount: rewardTokensForDate.fields.amount + amount
        }
    }
    const updatedRewardTokens = await updateRewardTokensForDate(rewardTokensForDateUpdated)
    return updatedRewardTokens
}

async function fetchRewardTokensForCharacter(characterId: string): Promise<RewardTokensDayEntry[]> {
    return new Promise((resolve, reject) => {
        const results: RewardTokensDayEntry[] = []

        console.log('FORMULA=', `characterId='${characterId}'`)

        console.log('fetchRewardTokensForCharacter')

        base('rewardTokens').select({
            filterByFormula: `characterId='${characterId}'`
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            const theRecords: Array<AirtableDbEntry<RewardTokensDayEntry>> = records as any[]
            results.push(...(theRecords).map(projectAirtableDbEntryToEntity))

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();

        }, function done(err) {
            if (err) {
                console.error(err);
                reject(err)
                return;
            }

            resolve(results)
        });
    })
}

async function fetchRewardTokensForDate(date: string): Promise<AirtableDbEntry<RewardTokensDayEntry>> {
    return new Promise((resolve, reject) => {
        base('rewardTokens').select({
            filterByFormula: `date=${date}`
        }).firstPage(function page(records) {
            // This function (`page`) will get called for each page of records.

            const record = records[0]
            resolve(record)
        });
    })
}

async function updateRewardTokensForDate(dbRecord: AirtableDbEntry<RewardTokensDayEntry>): Promise<RewardTokensDayEntry> {
    return new Promise((resolve, reject) => {
        base('rewardTokens').update([dbRecord], function (err: any, records: any) {
            if (err) {
                console.error(err);
                reject()
                return;
            }
            if (!records) {
                return undefined
            }
            const firstRecord = records[0] as AirtableDbEntry<RewardTokensDayEntry>
            resolve(projectAirtableDbEntryToEntity(firstRecord))
        })
    })
}

async function updateCharacterInAirtable(character: Character): Promise<Character> {
    return new Promise((resolve, reject) => {
        const dbEntry = projectEntityToAirtableDbEntry(character)
        base('characters').update([dbEntry], function (err: any, records: any) {
            if (err) {
                console.error(err);
                reject()
                return;
            }
            if (!records) {
                return undefined
            }
            const firstRecord = records[0] as AirtableDbEntry<Character>
            resolve(projectAirtableDbEntryToEntity(firstRecord))
        })
    })
}