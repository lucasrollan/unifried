import IFragment from "@/models/IFragment";
import Airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import { AirtableDbEntry } from "./AirtableDbEntry";
import FragmentFactory from "@/models/FragmentFactory";
import FragmentService from "@/models/FragmentService";
import AirtableConnector from "./AirtableConnector";
import GoogleCalendarConnector from "./GoogleCalendarConnector";
import ICharacter from "@/models/ICharacter";
import CharacterFactory from "@/models/CharacterFactory";
import Character from "@/models/Character";

class CharacterRepository {
    private static instance: CharacterRepository | null = null
    private airtableDB: AirtableBase

    private constructor() {
        this.airtableDB = new Airtable().base('applyggDoSgqTOMEs');
    }

    static getInstance(): CharacterRepository {
        if (!CharacterRepository.instance) {
            CharacterRepository.instance = new CharacterRepository()
        }
        return CharacterRepository.instance
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

    async getCurrentCharacter(): Promise<Character> {
        return new Promise((resolve, reject) => {
            const id = 'recQjKKFnjDC4KJUo' // Lucas

            let result: Character | null = null

            console.log('CharacterRepository.getCurrentCharacter', id)
            this.airtableDB('characters').find(id, function (err, record) {
                if (err) { console.error(err); return; }
                if (!record) {
                    console.error('Record not found')
                    reject()
                    return
                }

                const theRecord: AirtableDbEntry<ICharacter> = record as any
                result = CharacterFactory.fromAirtableRow(theRecord)
                console.log('Retrieved fragment by id', result.data.id);

                resolve(result)
            })
        })
    }

    async patch(character: Character): Promise<Character> {
        return new Promise((resolve, reject) => {
            console.log('CharacterRepository.patch', character.data.id)

            const dbEntry = CharacterFactory.toAirtableRow(character.data)
            console.log('dbEntry', dbEntry)

            this.airtableDB('characters').update([dbEntry], function (err: any, records: any) {
                if (err) {
                    console.error(err);
                    reject()
                    return;
                }
                if (!records) {
                    return undefined
                }
                const theRecord: AirtableDbEntry<ICharacter> = records[0] as any
                resolve(CharacterFactory.fromAirtableRow(theRecord))
            })
        })
    }
}

export default CharacterRepository