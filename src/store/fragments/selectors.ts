import FragmentService from "@/models/FragmentService"
import IFragment from "@/models/IFragment"
import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"
import { sortBy } from "lodash"
import moment, { MomentInput } from "moment"

export const selectSummaryDateSelected = (state: RootState) =>
    state.fragments.fragmentSummaryDateSelected

export const selectSummaryDateSelectedDescription = (state: RootState) => {
    const date = moment(selectSummaryDateSelected(state)).startOf('day')
    const today = moment().startOf('day')

    const dayName = date.format('dddd')
    let relative = ''

    if (date.isSame(today, 'day')) {
        relative = 'today'
    } else if (date.diff(today, 'day') === 1) {
        relative = 'tomorrow'
    } else if (date.diff(today, 'day') === -1) {
        relative = 'yesterday'
    }

    if (!relative) {
        relative = moment().to(date)
    }
    return [dayName, relative].join(', ')
}

export const selectAllFragments = createSelector(
    (state: RootState) => state.fragments,
    fragmentState =>
        fragmentState.fragmentIds.map(id => fragmentState.fragmentsById[id])
)

export const selectFragmentById =
    (state: RootState, id: string) =>
        state.fragments.fragmentsById[id]


export const selectFragmentsRelevantForDate = createSelector(
    (state: RootState) => state.fragments.fragmentSummaryDateSelected,
    selectAllFragments,
    (date, fragments) =>
        sortFragmentsForSummary(
            fragments.filter(fragment =>
                FragmentService.isFragmentRelevantForDate(
                    fragment,
                    moment(date).startOf('day'),
                    moment(date).add(1, 'day').startOf('day')
                )
            )
        )
)

function sortFragmentsForSummary(fragments: IFragment[]): IFragment[] {
    return sortFragmentsByUrgencyScore(fragments)
}

function sortFragmentsByUrgencyScore(fragments: IFragment[]): IFragment[] {
    let sorted = sortBy(fragments, [
        fragment => fragment.role === 'event' ? 0 : 1, // events first
        fragment => fragment.isCompleted ? 1 : 0, // completed last
        fragment => fragment.priority
    ])
    return sorted
}