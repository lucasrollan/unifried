import Airtable from 'airtable';
import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from 'next'
import Character from '@/models/Character';
import { AirtableDbEntry, projectAirtableDbEntryToEntity } from '@/persistence/AirtableDbEntry';
var base = new Airtable().base('applyggDoSgqTOMEs');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Character[]>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const dbEntries = await fetchCharactersFromAirtable()

        // Signed in
        res.status(200).json([
            ...dbEntries,
        ])
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}


export async function fetchCharactersFromAirtable(): Promise<Character[]> {
  return new Promise((resolve, reject) => {
    const results: Character[] = []

    console.log('fetchCharactersFromAirtable')
    base('characters').select({
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      const theRecords: Array<AirtableDbEntry<Character>> = records as any[]
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