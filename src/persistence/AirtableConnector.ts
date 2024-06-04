import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import IFragment from "@/models/IFragment";
import { AirtableDbEntry } from "./AirtableDbEntry";
import FragmentFactory from "@/models/FragmentFactory";

export type CompletedChallenge = {
    id: string,
    date: string,
    fragmentId: string,
}


class AirtableConnector {
    private static instance: AirtableConnector | null = null
    private airtableDB: AirtableBase

    private constructor() {
        this.airtableDB = new Airtable().base('applyggDoSgqTOMEs');
    }

    static getInstance(): AirtableConnector {
        if (!AirtableConnector.instance) {
            AirtableConnector.instance = new AirtableConnector()
        }
        return AirtableConnector.instance
    }

    public async getFragmentsByDateRange(periodStart: string, periodEnd: string): Promise<IFragment[]> {
        const completedChallenges = await this.getCompletedChallenges()

        return new Promise((resolve, reject) => {
            const results: IFragment[] = []

            this.airtableDB('fragments').select({
                view: "Grid view",
            }).eachPage(function page(records, fetchNextPage) {
                try {
                    const theRecords: AirtableDbEntry<IFragment>[] = records as any
                    results.push(...theRecords.map(FragmentFactory.fromAirtableRow))

                    fetchNextPage();
                } catch (e) {
                    console.error('AirtableConnector.getAll failed')
                    console.error(e)
                }
            }, function done(err) {
                if (err) {
                    console.error(err);
                    reject(err)
                    return;
                }

                const instantiatedResults: IFragment[] = []

                results.forEach(r => {
                    if (r.role === 'challenge') {
                        instantiatedResults.push(...FragmentFactory.instantiateChallengeFragments(r, periodStart, periodEnd, completedChallenges))
                    } else {
                        instantiatedResults.push(r)
                    }
                })

                resolve(instantiatedResults)
            });
        })
    }

    public async getCompletedChallenges(): Promise<CompletedChallenge[]> {
        return new Promise((resolve, reject) => {
            const results: CompletedChallenge[] = []

            this.airtableDB('completedChallenges').select({
                view: "Grid view",
            }).eachPage(function page(records, fetchNextPage) {
                try {
                    const theRecords: AirtableDbEntry<CompletedChallenge>[] = records as any
                    results.push(...theRecords.map(projectChallengesCompletedRecordFromAirtable))

                    fetchNextPage();
                } catch (e) {
                    console.error('AirtableConnector.completedChallenges failed')
                    console.error(e)
                }
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
}

function projectChallengesCompletedRecordFromAirtable(record: AirtableDbEntry<CompletedChallenge>): CompletedChallenge {
    return {
        ...record.fields,
        id: record.id,
    }
}

function projectChallengesCompletedRecordToAirtable(record: CompletedChallenge): AirtableDbEntry<CompletedChallenge> {
    const fields = {
        ...record,
        id: undefined,
    }

    return {
        id: record.id,
        fields,
    }
}


export default AirtableConnector