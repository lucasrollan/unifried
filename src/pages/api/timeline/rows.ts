import { TimelineRow } from '@/types/timeline'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "../auth/[...nextauth]"
import Airtable from 'airtable';
import { google } from 'googleapis'

import type { NextApiRequest, NextApiResponse } from 'next'
import getGoogleAuth from '../getGoogleAuth';
var base = new Airtable().base('applyggDoSgqTOMEs');

const googleAuth = getGoogleAuth()

async function listEvents() {
  const calendar = google.calendar({version: 'v3', auth: googleAuth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start?.dateTime || event.start?.date;
    console.log(`${start} - ${event.summary}`);
  });
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TimelineRow[]>
) {
    // const googleStuff = await getGoogleAccessToken()
    // console.log('googleStuff', googleStuff)
    // console.log('googleStuff <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')

    await listEvents()

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

        records.forEach(function (record) {
          console.log('Retrieved ROW', record.get('id'));
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

  function projectRow(dbEntry: any): TimelineRow {
    return {
      ...dbEntry.fields,
      id: dbEntry.id,
    }
  }