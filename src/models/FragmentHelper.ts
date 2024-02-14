import moment, { MomentInput } from "moment"
import IFragment from "./IFragment"

function isDateWithinRange(date: MomentInput, start: MomentInput, exclusiveEnd: MomentInput): boolean {
    const dateMoment = moment(date)
    return dateMoment.isSameOrAfter(start) && dateMoment.isBefore(exclusiveEnd)
}

function periodsOverlap(periodAStart: MomentInput, periodAEnd: MomentInput, periodBStart: MomentInput, periodBEnd: MomentInput): boolean {
    const missedToTheLeft = moment(periodAEnd).isSameOrBefore(periodBStart) // A ends before B starts
    const missedToTheRight = moment(periodBEnd).isSameOrBefore(periodAStart) // B ends before A starts

    return !missedToTheLeft && !missedToTheRight // they don't miss each other
}

class FragmentHelper {
    static isFragmentRelevantForDate(fragment: IFragment, dateStart: MomentInput, dateEndExclusive: MomentInput): boolean {
        const earliestStart = fragment.earliestStart || fragment.earliestStartDate
        const start = fragment.start || fragment.startDate
        const end = fragment.end || fragment.endDate
        let meta: any = undefined

        if (fragment.meta) {
            try {
                meta = JSON.parse(fragment.meta)
            } catch(e) {
                console.error(`Failed to parse fragment meta for ${fragment.id}`)
                console.error(e)
            }
        }

        if (fragment.role === 'event') {
            if (fragment.status === 'cancelled') {
                return false
            }

            const eventStartsAfterRangeEnd = moment(start).isSameOrAfter(dateEndExclusive)
            const eventEndsAfterRangeStart = moment(end).isSameOrBefore(dateStart)
            return !(eventStartsAfterRangeEnd || eventEndsAfterRangeStart)
        } else if (fragment.role === 'task') {
            const earliestDateOfRelevance: MomentInput = moment(earliestStart || start)
            const exclusiveEnd = moment(fragment.end || moment(fragment.endDate).add(1, 'day'))
            let latestDateOfRelevance: MomentInput = moment.max(exclusiveEnd, moment())

            if (fragment.isCompleted) {
                latestDateOfRelevance = fragment.completionDate
            }

            // TODO: latestDateOfRelevance is inclusive, dateEndExclusive is not
            // fragment end is exclusive, fragment endDate should be turned into a exclusive date by adding one day
            return periodsOverlap(earliestDateOfRelevance, latestDateOfRelevance, dateStart, dateEndExclusive)

            //tasks that (earlyStart, start, or due on-or-before today and are not done) or that are done on-or-after today
        } else if (fragment.role === 'challenge') {
            return isDateWithinRange(fragment.startDate, dateStart, dateEndExclusive)
        } else {
            return false
        }
    }

    static fragmentHappensBefore(fragment: IFragment, date: MomentInput) {
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

    static fragmentHappensOnOrAfter(fragment: IFragment, date: MomentInput) {
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
}

export default FragmentHelper