import IFragment from "@/models/IFragment";
import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import { AirtableDbEntry } from "./AirtableDbEntry";
import FragmentFactory from "@/models/FragmentFactory";

class FragmentRepository {
    private static instance: FragmentRepository | null = null
    private airtableDB: AirtableBase

    private constructor() {
        this.airtableDB = new Airtable().base('applyggDoSgqTOMEs');
    }

    static getInstance(): FragmentRepository {
        if (!FragmentRepository.instance) {
            FragmentRepository.instance = new FragmentRepository()
        }
        return FragmentRepository.instance
    }

    public async getAll(): Promise<IFragment[]> {
        return new Promise((resolve, reject) => {
            const results: IFragment[] = []

            console.log('FragmentRepository.getAll')
                this.airtableDB('fragments').select({
                    view: "Grid view"
                }).eachPage(function page(records, fetchNextPage) {
                    try {
                        const theRecords: AirtableDbEntry<IFragment>[] = records as any
                        results.push(...theRecords.map(FragmentFactory.fromAirtableRow))

                        fetchNextPage();
                    } catch (e) {
                        console.error('FragmentRepository.getAll failed')
                        console.error(e)
                    }
                }, function done(err) {
                    if (err) {
                        console.error(err);
                        reject(err)
                        return;
                    }

                    console.log('FragmentRepository.getAll results', results)
                    resolve(results)
                });
        })
    }

    public async getById(id: string): Promise<IFragment> {
        return new Promise((resolve, reject) => {
            let result: IFragment | null = null
            const airtableId = FragmentFactory.projectFragmentIdToAirtable(id)

            console.log('FragmentRepository.getById', id)
            this.airtableDB('fragments').find(airtableId, function (err, record) {
                if (err) { console.error(err); return; }
                if (!record) {
                    console.error('Record not found')
                    reject()
                    return
                }

                const theRecord: AirtableDbEntry<IFragment> = record as any
                result = FragmentFactory.fromAirtableRow(theRecord)
                console.log('Retrieved fragment by id', result.id);

                resolve(result)
            })
        })
    }

    async create(fragment: IFragment): Promise<IFragment> {
        return new Promise((resolve, reject) => {
            this.airtableDB('fragments').create([fragment], function (err, records) {
                if (err) {
                    console.error(err);
                    reject()
                    return;
                }
                if (!records) {
                    return undefined
                }

                console.log('FragmentRepository.create')
                const theRecord: AirtableDbEntry<IFragment> = records[0] as any
                resolve(FragmentFactory.fromAirtableRow(theRecord))
            })
        })
    }

    async patch(fragment: IFragment): Promise<IFragment> {
        return new Promise((resolve, reject) => {
            // FragmentFactory.validateInvariants(fragment)

            console.log('FragmentRepository.patch', fragment.id)
            const dbEntry = FragmentFactory.toAirtableRow(fragment)
            console.log('dbEntry', dbEntry)
            this.airtableDB('fragments').update([dbEntry], function (err: any, records: any) {
                if (err) {
                    console.error(err);
                    reject()
                    return;
                }
                if (!records) {
                    return undefined
                }
                const theRecord: AirtableDbEntry<IFragment> = records[0] as any
                resolve(FragmentFactory.fromAirtableRow(theRecord))
            })
        })
    }
}

export default FragmentRepository