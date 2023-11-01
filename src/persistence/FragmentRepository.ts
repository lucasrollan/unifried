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

    static projectAirtableRowToFragment(row: AirtableDbEntry<Fragment>): Fragment {
        return {
            ...row.fields,
            id: `airtable:::fragments:::${row.id}`,
        }
    }
}

export default FragmentRepository