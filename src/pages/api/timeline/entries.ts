import { TimelineEntry } from '@/types/timeline'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"
import Airtable from 'airtable';

var base = new Airtable().base('applyggDoSgqTOMEs');

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TimelineEntry[]>
) {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    const dbEntries = await fetchEntriesFromAirtable()

    // Signed in
    res.status(200).json([
      ...dbEntries,
    ])
  } else {
    // Not Signed in
    res.status(401).json([])
  }
}

async function fetchEntriesFromAirtable(): Promise<TimelineEntry[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = []

    base('Entries').select({
      view: "Grid view"
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.

      results.push(...records.map(projectEntry)) //Unwrap from Airtable response

      records.forEach(function (record) {
        console.log('Retrieved ENTRIES', record.get('id'));
      });

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

function projectEntry(dbEntry: any): TimelineEntry {
  return {
    ...dbEntry.fields,
    id: dbEntry.id,
  }
}