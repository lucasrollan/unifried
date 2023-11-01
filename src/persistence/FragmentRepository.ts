import Fragment from "@/models/Fragment";
import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import { AirtableDbEntry, projectAirtableDbEntryToEntity } from "./AirtableDbEntry";

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

    public async getAll(): Promise<Fragment[]> {
        return new Promise((resolve, reject) => {
            const results: Fragment[] = []

            this.airtableDB('fragments').select({
                view: "Grid view"
            }).eachPage(function page(records, fetchNextPage) {
                const theRecords: AirtableDbEntry<Fragment>[] = records as any
                results.push(...theRecords.map(FragmentRepository.projectAirtableRowToFragment))

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

    public async getById(id: string): Promise<Fragment> {
        return new Promise((resolve, reject) => {
            let result: Fragment | null = null
            const airtableId = FragmentRepository.projectFragmentIdToAirtable(id)

            this.airtableDB('fragments').find(airtableId, function (err, record) {
                if (err) { console.error(err); return; }
                if (!record) {
                    console.error('Record not found')
                    reject()
                    return
                }

                const theRecord: AirtableDbEntry<Fragment> = record as any
                result = FragmentRepository.projectAirtableRowToFragment(theRecord)
                console.log('Retrieved fragment by id', result.id);

                resolve(result)
            })
        })
    }

    async create(fragment: Fragment): Promise<Fragment> {
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

                const theRecord: AirtableDbEntry<Fragment> = records[0] as any
                resolve(FragmentRepository.projectAirtableRowToFragment(theRecord))
            })
        })
    }

    async patch(fragment: Fragment): Promise<Fragment> {
        return new Promise((resolve, reject) => {
            const dbEntry = FragmentRepository.projectFragmentToAirtableRow(fragment)
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
                const theRecord: AirtableDbEntry<Fragment> = records[0] as any
                resolve(FragmentRepository.projectAirtableRowToFragment(theRecord))
            })
        })
    }

    static projectAirtableRowToFragment(row: AirtableDbEntry<Fragment>): Fragment {
        return {
            ...row.fields,
            id: FragmentRepository.projectAirtableIdToFragment(row.id),
        }
    }

    static projectFragmentToAirtableRow(fragment: Fragment): AirtableDbEntry<Fragment> {
        const id = FragmentRepository.projectFragmentIdToAirtable(fragment.id)

        const fields = {
            ...fragment,
            id: undefined,
            created: undefined,
            modified: undefined,
        }

        return {
            id,
            fields,
        }
    }

    static projectAirtableIdToFragment(airtableId: string): string {
        return `airtable:::fragments:::${airtableId}`
    }

    static projectFragmentIdToAirtable(fragmentId: string): string {
        const [system, container, id] = fragmentId.split(':::')
        return id
    }
}

export default FragmentRepository