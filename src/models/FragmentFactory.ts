import { AirtableDbEntry } from "@/persistence/AirtableDbEntry"
import IFragment from "./IFragment"
import { GcalEvent } from "./gcal"
import moment from "moment"
import { CompletedChallenge } from "@/persistence/AirtableConnector"

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

    static fromGcalEvent (event: GcalEvent) {
        return {
            id: event.id!,
            title: event.summary!,
            role: 'event',
            content: event.description || undefined,
            createdDate: event.created!,
            modifiedDate: event.updated!,
            status: event.status || undefined,
            earliestStart: undefined,
            earliestStartDate: undefined,
            start: event.start!.dateTime || undefined,
            startDate: event.start!.date || moment(event.start!.dateTime).format('YYYY-MM-DD'),
            end: event.end?.dateTime || undefined,
            endDate: event.end?.date ||  moment(event.end!.dateTime).format('YYYY-MM-DD'),
            location: event.location || undefined,
            reward: undefined,
            isCompleted: false,
            completionDate: undefined,
        }
    }

    static projectAirtableIdToFragment(airtableId: string): string {
        return `airtable:::fragments:::${airtableId}`
    }

    static projectFragmentIdToAirtable(fragmentId: string): string {
        const [system, container, id] = fragmentId.split(':::')
        return id
    }

    static instantiateChallengeFragments(fragment: IFragment, periodStart: string, periodEnd: string, completedRecords: CompletedChallenge[]): IFragment[] {
        let current = moment(periodStart).startOf('day')
        let exclusiveEnd = moment(periodEnd)
        let result: IFragment[] = []

        while (current.isBefore(exclusiveEnd)) {
            const next = moment(current).add(1, 'day')
            const currentFormatted = current.format('YYYY-MM-DD')

            const completedInDate = completedRecords.some(record =>
                current.isSame(record.date, 'day') && record.fragmentId === fragment.id
            )

            const status = completedInDate
                ? 'completed'
                : fragment.status

            const completionDate = completedInDate
                ? currentFormatted
                : fragment.completionDate

            result.push({
                ...fragment,
                id: `${fragment.id}:::${currentFormatted}`,
                startDate: currentFormatted,
                endDate: next.format('YYYY-MM-DD'),
                status,
                completionDate,
                isCompleted: completedInDate,
            })

            current = next
        }

        return result
    }
}

export default FragmentFactory