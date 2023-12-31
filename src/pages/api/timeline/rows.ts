import { TimelineRow } from '@/models/timeline'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"
import Airtable from 'airtable';

import type { NextApiRequest, NextApiResponse } from 'next'
var base = new Airtable().base('applyggDoSgqTOMEs');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TimelineRow[]>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const dbEntries = await fetchRowsFromAirtable()

        // Signed in
        res.status(200).json([
            ...dbEntries,
        ])
    } else {
        // Not Signed in
        res.status(401).json([])
    }
}

async function fetchRowsFromAirtable(): Promise<TimelineRow[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = []

      base('Rows').select({
        view: "Grid view"
      }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        results.push(...records.map(projectRow)) //Unwrap from Airtable response

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

  function projectRow(dbEntry: any): TimelineRow {
    return {
      ...dbEntry.fields,
      id: dbEntry.id,
    }
  }