import Fragment from "@/models/Fragment"
import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"
import moment, { MomentInput } from "moment"

export const selectAllFragments = createSelector(
    (state: RootState) => state.fragments,
    fragmentState =>
        fragmentState.fragmentIds.map(id => fragmentState.fragmentsById[id])
)

export const selectFragmentById =
    (state: RootState, id: string) =>
        state.fragments.fragmentsById[id]


export const selectFragmentsRelevantForDate = createSelector(
    (state: RootState, date: string) => date,
    selectAllFragments,
    (date, fragments) =>
        fragments.filter(fragment =>
            isFragmentRelevantForDate(
                fragment,
                moment(date).startOf('day'),
                moment(date).add(1, 'day').startOf('day')
            )
        )
)

function isFragmentRelevantForDate(fragment: Fragment, dateStart: MomentInput, dateEndExclusive: MomentInput): boolean {
    const earliestStart = fragment.earliestStart || fragment.earliestStartDate
    const start = fragment.start || fragment.startDate
    const end = fragment.end || fragment.endDate
    const isOpen = fragment.status !== 'done' && fragment.status !== 'cancelled'

    if (fragment.role === 'event') {
        const isEarliestStartWithinRange = earliestStart
            ? isDateWithinRange(earliestStart, dateStart, dateEndExclusive)
            : false
        const isStartWithinRange = start
            ? isDateWithinRange(start, dateStart, dateEndExclusive)
            : false
        const isEndWithinRange = start
            ? isDateWithinRange(end, dateStart, dateEndExclusive)
            : false

        return isOpen && (isEarliestStartWithinRange || isStartWithinRange || isEndWithinRange)
    } else {
        const isEarliestStartAfterRangeStart = earliestStart
            ? moment(earliestStart).isSameOrAfter(dateStart)
            : false
        const isStartAfterRangeStart = start
            ? moment(start).isSameOrAfter(dateStart)
            : false
        const isEndBeforeRangeStart = end
            ? moment(end).isSameOrBefore(dateStart)
            : false

        return isOpen && (isEarliestStartAfterRangeStart || isStartAfterRangeStart || isEndBeforeRangeStart)
    }
}

function isDateWithinRange(date: MomentInput, start: MomentInput, exclusiveEnd: MomentInput): boolean {
    const dateMoment = moment(date)
    return dateMoment.isSameOrAfter(start) && dateMoment.isBefore(start)
}
