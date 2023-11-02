import { AirtableDbEntry } from "@/persistence/AirtableDbEntry"
import IFragment from "./IFragment"

class FragmentFactory {
    static validateInvariants(fragment: IFragment) {
        if (fragment.role === 'task') {
            if (fragment.status === 'complete' || fragment.completionDate || fragment.isCompleted) {
                // if one of these is defined, the all have to be defined
                console.log('INVALID FRAGMENT')
                console.log(fragment)
                if (fragment.status !== 'complete' || !fragment.completionDate || !fragment.isCompleted) {
                    throw new Error('Task completed with invalid values')
                }
            }
        }
    }

    static update(fragment: IFragment, updates: Partial<IFragment>): IFragment {
        const updatedFragment = {
            ...fragment,
            ...updates,
        }

        FragmentFactory.validateInvariants(updatedFragment)

        return updatedFragment
    }

    static fromAirtableRow (row: AirtableDbEntry<IFragment>): IFragment {
        const fragment = {
            ...row.fields,
            id: FragmentFactory.projectAirtableIdToFragment(row.id),
        }

        FragmentFactory.validateInvariants(fragment)

        return fragment
    }

    static toAirtableRow(fragment: IFragment): AirtableDbEntry<IFragment> {
        const id = FragmentFactory.projectFragmentIdToAirtable(fragment.id)

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

export default FragmentFactory