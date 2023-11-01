export type Entity = {
    id: string,
}

export type AirtableDbEntry<T> = {
    id: string,
    fields: Omit<T, 'id'>,
}

export function projectEntityToAirtableDbEntry<E extends Entity>(entity: E): AirtableDbEntry<E> {
    return {
        id: entity.id,
        fields: {
            ...entity,
            id: undefined,
        }
    }
}
export function projectAirtableDbEntryToEntity<E extends Entity>(dbEntry: AirtableDbEntry<E>): E {
    return {
        ...dbEntry.fields,
        id: dbEntry.id,
    } as E
}