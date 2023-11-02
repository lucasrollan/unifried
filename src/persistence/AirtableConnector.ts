import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import IFragment from "@/models/IFragment";
import { AirtableDbEntry } from "./AirtableDbEntry";
import FragmentFactory from "@/models/FragmentFactory";

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

    public async getAll(): Promise<IFragment[]> {
        return new Promise((resolve, reject) => {
            const results: IFragment[] = []

            console.log('AirtableConnector.getAll')
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

                console.log('AirtableConnector.getAll results', results)
                resolve(results)
            });
        })
    }
}

export default AirtableConnector