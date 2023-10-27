import Fragment from "@/models/Fragment"
import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"
import moment, { MomentInput } from "moment"

export const selectSummaryDateSelected = (state: RootState) =>
    state.fragments.fragmentSummaryDateSelected

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
                isFragmentRelevantForDate(
                    fragment,
                    moment(date).startOf('day'),
                    moment(date).add(1, 'day').startOf('day')
                )
            )
        )
)

function isFragmentRelevantForDate(fragment: Fragment, dateStart: MomentInput, dateEndExclusive: MomentInput): boolean {
    const earliestStart = fragment.earliestStart || fragment.earliestStartDate
    const start = fragment.start || fragment.startDate
    const end = fragment.end || fragment.endDate

    if (fragment.role === 'event') {
        if (fragment.status === 'cancelled') {
            return false
        }

        const eventStartsAfterRangeEnd = moment(start).isSameOrAfter(dateEndExclusive)
        const eventEndsAfterRangeStart = moment(end).isSameOrBefore(dateStart)
        return !(eventStartsAfterRangeEnd || eventEndsAfterRangeStart)
    } else {
        const isEarliestStartBeforeRangeEnd = earliestStart
            ? moment(earliestStart).isBefore(dateEndExclusive)
            : false
        const isStartBeforeRangeEnd = start
            ? moment(start).isBefore(dateEndExclusive)
            : false
        const isEndBeforeRangeEnd = end
            ? moment(end).isBefore(dateEndExclusive)
            : false
        const happensBeforeRangeEnd = isEarliestStartBeforeRangeEnd || isStartBeforeRangeEnd || isEndBeforeRangeEnd

        const wasCompletedBeforeRangeEnd = fragment.completionDate
            ? moment(fragment.completionDate).isBefore(dateEndExclusive)
            : false

        // TODO: should we show open tasks after today?
        //   - if yes, then we are assuming that all tasks not be done on time // after today
        //   - if no, then they will be carrying them over one day at a time

        // TODO: include tasks done that day, and tasks done after the day too

        if (fragment.isCompleted) {
            return wasCompletedBeforeRangeEnd
        } else {
            return happensBeforeRangeEnd
        }
    }
}

function isDateWithinRange(date: MomentInput, start: MomentInput, exclusiveEnd: MomentInput): boolean {
    const dateMoment = moment(date)
    return dateMoment.isSameOrAfter(start) && dateMoment.isBefore(start)
}

function sortFragmentsForSummary(fragments: Fragment[]): Fragment[] {
    return sortFragmentsByUrgencyScore(fragments)
}

function sortFragmentsByUrgencyScore(fragments: Fragment[]): Fragment[] {
    return fragments
}