import React from 'react';
import Airtable from 'airtable';
import Head from 'next/head';

interface Activity {
    name: string;
    completed: boolean;
    required: boolean;
}

interface Props {
    activities: Activity[];
}

const ChristmasActivities: React.FC<Props> = ({ activities }) => {
    const completedActivities = activities.filter((activity) => activity.completed).length;
    const percentageCompleted = Math.round((completedActivities / activities.length) * 100);
    const orderedActivities = activities
        .sort((a, b) =>
            a.name.startsWith('🇮🇹') && !b.name.startsWith('🇮🇹') ? 1 :
            !a.name.startsWith('🇮🇹') && b.name.startsWith('🇮🇹') ? -1 :
            a.name.localeCompare(b.name, 'es', { sensitivity: 'base', ignorePunctuation: true })
        )

    return (
        <>
            <Head>
                <title>Actividades Navideñas 2023</title>
            </Head>
            <div style={{ padding: '20px 40px', fontSize: '20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                    <h1>Actividades Navideñas 2023</h1>
                    <p style={{ marginBottom: '20px', color: 'gray', fontSize: '0.8em' }}>
                        <i>{percentageCompleted}% completadas ({completedActivities}/{activities.length})</i>
                    </p>
                    <ul>
                        {orderedActivities.map((activity) => (
                            <li key={activity.name} style={{position: 'relative', listStyleType: 'none'}}>
                                {activity.completed && <span style={{ color: 'green', position: 'absolute', left: '-25px' }}>✅</span>}
                                <span
                                    style={{
                                        color: activity.completed ? 'Darkgreen' : 'black',
                                    }}
                                >{activity.name}</span>
                                {!activity.required && <span style={{ color: 'gray' }}> (opcional)</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export async function getServerSideProps() {
    // Fetch data from external API
    const activities = await fetchEntriesFromAirtable()

    // Pass data to the page via props
    return { props: { activities } }
  }

async function fetchEntriesFromAirtable(): Promise<Activity[]> {
    var base = new Airtable().base('applyggDoSgqTOMEs');

    return new Promise((resolve, reject) => {
      const results: any[] = []

      base('Activities').select({
        view: "Grid view",
      }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        results.push(...records.map(projectEntry)) //Unwrap from Airtable response

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

function projectEntry(entry: any): Activity {
    return {
        name: entry.fields.Name,
        completed: entry.fields.Completed || false,
        required: entry.fields.Required || false,
    }
}

export default ChristmasActivities;
