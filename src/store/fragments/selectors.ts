import Fragment from "@/models/Fragment"
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
    } else if (fragment.role === 'task') {
       const happensBeforeRangeEnd = fragmentHappensBefore(fragment, dateEndExclusive)
        const happensOnOrAfterRangeStart = fragmentHappensOnOrAfter(fragment, dateStart)

        const wasCompletedWithinRange = isDateWithinRange(fragment.completionDate, dateStart, dateEndExclusive)
        const wasCompletedAfterRangeStart = fragment.completionDate
            ? moment(fragment.completionDate).isSameOrAfter(dateStart)
            : false

        // TODO: should we show open tasks after today?
        //   - if yes, then we are assuming that all tasks not be done on time // after today
        //   - if no, then they will be carrying them over one day at a time

        // TODO: include tasks done that day, and tasks done after the day too

        if (fragment.isCompleted) {
            return wasCompletedWithinRange || (happensOnOrAfterRangeStart && wasCompletedAfterRangeStart)
        } else {
            return happensBeforeRangeEnd
        }

        //tasks that (earlyStart, start, or due on-or-before today and are not done) or that are done on-or-after today
    } else {
        return false
    }
}

function fragmentHappensBefore(fragment: Fragment, date: MomentInput) {
    const earliestStart = fragment.earliestStart || fragment.earliestStartDate
    const start = fragment.start || fragment.startDate
    const end = fragment.end || fragment.endDate

    const isEarliestStartBeforeDate = earliestStart
        ? moment(earliestStart).isBefore(date)
        : false
    const isStartBeforeDate = start
        ? moment(start).isBefore(date)
        : false
    const isEndBeforeDate = end
        ? moment(end).isBefore(date)
        : false
    const happensBeforeDate = isEarliestStartBeforeDate || isStartBeforeDate || isEndBeforeDate
    return happensBeforeDate
}

function fragmentHappensOnOrAfter(fragment: Fragment, date: MomentInput) {
    const earliestStart = fragment.earliestStart || fragment.earliestStartDate
    const start = fragment.start || fragment.startDate
    const end = fragment.end || fragment.endDate

    const isEarliestStartOnOrAfterDate = earliestStart
        ? moment(earliestStart).isSameOrAfter(date)
        : false
    const isStartOnOrAfterDate = start
        ? moment(start).isSameOrAfter(date)
        : false
    const isEndOnOrAfterDate = end
        ? moment(end).isSameOrAfter(date)
        : false
    const happensOnOrAfterDate = isEarliestStartOnOrAfterDate || isStartOnOrAfterDate || isEndOnOrAfterDate
    return happensOnOrAfterDate
}

function isDateWithinRange(date: MomentInput, start: MomentInput, exclusiveEnd: MomentInput): boolean {
    const dateMoment = moment(date)
    return dateMoment.isSameOrAfter(start) && dateMoment.isBefore(start)
}

function sortFragmentsForSummary(fragments: Fragment[]): Fragment[] {
    return sortFragmentsByUrgencyScore(fragments)
}

function sortFragmentsByUrgencyScore(fragments: Fragment[]): Fragment[] {
    let sorted = sortBy(fragments, [
        fragment => fragment.role === 'event' ? 0 : 1, // events first
        fragment => fragment.isCompleted ? 1 : 0, // completed last
        fragment => fragment.priority
    ])
    return sorted
}