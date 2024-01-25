import { AirtableDbEntry } from "@/persistence/AirtableDbEntry"
import ICharacter from "./ICharacter"
import Character from "./Character"

class CharacterFactory {
    static fromData(data: ICharacter) {
        return new Character(data)
    }

    static fromAirtableRow (row: AirtableDbEntry<ICharacter>): Character {
        const character = {
            ...row.fields,
            id: row.id,
        }

        return CharacterFactory.fromData(character)
    }

    static toAirtableRow(character: ICharacter): AirtableDbEntry<ICharacter> {
        const id = character.id

        const fields = {
            ...character,
            id: undefined,
        }

        return {
            id,
            fields,
        }
    }
}

export default CharacterFactory