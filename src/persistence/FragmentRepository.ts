import IFragment from "@/models/IFragment";
import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import { AirtableDbEntry } from "./AirtableDbEntry";
import FragmentFactory from "@/models/FragmentFactory";
import FragmentService from "@/models/FragmentService";
import AirtableConnector from "./AirtableConnector";
import GoogleCalendarConnector from "./GoogleCalendarConnector";
import Fragment from "@/models/Fragment";
import FragmentHelper from "@/models/FragmentHelper";

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

    public async getByDateRange(periodStart: string, periodEnd: string): Promise<IFragment[]> {
        const airtable = AirtableConnector.getInstance()
        const googleCalendar = GoogleCalendarConnector.getInstance()

        const airtableResults = await airtable.getFragmentsByDateRange(periodStart, periodEnd)

        const filteredResults = airtableResults.filter(fragment =>
            FragmentHelper.isFragmentRelevantForDate(fragment, periodStart, periodEnd)
        )

        const googleCalendarResults = await googleCalendar.getEventsByDateRange(periodStart, periodEnd)
        const googleCalendarFragments = googleCalendarResults.map(FragmentFactory.fromGcalEvent)

        return [
            ...googleCalendarFragments,
            ...filteredResults,
        ]
    }

    public async getDataById(id: string): Promise<IFragment> {
        return new Promise((resolve, reject) => {
            let result: IFragment | null = null
            const airtableId = FragmentFactory.projectFragmentIdToAirtable(id)

            this.airtableDB('fragments').find(airtableId, function (err, record) {
                if (err) { console.error(err); return; }
                if (!record) {
                    console.error('Record not found')
                    reject()
                    return
                }

                const theRecord: AirtableDbEntry<IFragment> = record as any
                result = FragmentFactory.fromAirtableRow(theRecord)

                resolve(result)
            })
        })
    }

    public async getById(id: string): Promise<Fragment> {
        const fragmentData = await this.getDataById(id)
        return FragmentFactory.fromData(fragmentData)
    }

    async create(fragment: IFragment): Promise<IFragment> {
        return new Promise((resolve, reject) => {
            const forAirtable = FragmentFactory.toAirtableRow(fragment)
            const newRow = {
                fields: {
                    ...forAirtable.fields,
                    createdDate: undefined,
                    modifiedDate: undefined,
                }
            }
            this.airtableDB('fragments').create([newRow], function (err, records) {
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

    async patch(fragment: IFragment): Promise<IFragment> {
        return new Promise((resolve, reject) => {
            // FragmentFactory.validateInvariants(fragment)

            const dbEntry = FragmentFactory.toAirtableRow(fragment)
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