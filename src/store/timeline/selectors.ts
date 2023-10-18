import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"
import moment, { Moment } from "moment"
import { TimelineCard } from "./types"
import { TimelineEntry } from "@/models/timeline"
import { mapValues } from "lodash"

export type timelineCardsByRow = Record<string, Array<TimelineCard[]>>

type Period = {
    label: string,
    start: Moment,
    end: Moment,
    style?: string,
    timeWindow: { // how this period relates to the selected time window
        daysSinceStart: number,
        daysLength: number,
    }
}

export const selectTimelineStart = (state: RootState) => state.timeline.startDate
export const selectTimelineEnd = (state: RootState) => state.timeline.endDate
export const selectTodayTimeframeDays = (state: RootState) =>
    moment().diff(state.timeline.startDate, 'day', true)
export const selectNumberOfDaysInView = (state: RootState) => state.timeline.daysInView
export const selectScrollPos = (state: RootState) => state.timeline.scrollPos

export const selectTimeframeLengthDays = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    (start, end) => moment(end).diff(start, 'day')
)

export const selectYearPeriods = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    (startDate: string, endDate: string) => {
        const periods: Period[] = []

        const startMoment = moment(startDate).startOf('day')
        const endMoment = moment(endDate).startOf('day')

        let currentStart = moment(startMoment)

        while (currentStart.isBefore(endMoment, 'day')) {
            const currentEnd = moment(currentStart).add(1, 'year').startOf('year')

            const periodStart = moment.max(startMoment, currentStart)
            const periodEnd = moment.min(endMoment, currentEnd)

            periods.push({
                label: currentStart.format('YYYY'),
                start: periodStart,
                end: periodEnd,
                timeWindow: {
                    daysSinceStart: periodStart.diff(startMoment, 'day'),
                    daysLength: periodEnd.diff(periodStart, 'day'),
                }
            })

            // move to the next period
            currentStart = currentEnd
        }

        return periods
    }
)

export const selectMonthPeriodsFromDates = (startDate: string, endDate: string) => {
    const periods: Period[] = []

    const startMoment = moment(startDate).startOf('day')
    const endMoment = moment(endDate).startOf('day')

    let currentStart = moment(startMoment)

    while (currentStart.isBefore(endMoment, 'day')) {
        const currentEnd = moment(currentStart).add(1, 'month').startOf('month')

        const periodStart = moment.max(startMoment, currentStart)
        const periodEnd = moment.min(endMoment, currentEnd)

        periods.push({
            label: currentStart.format('MMMM'),
            start: periodStart,
            end: periodEnd,
            timeWindow: {
                daysSinceStart: periodStart.diff(startMoment, 'day'),
                daysLength: periodEnd.diff(periodStart, 'day'),
            }
        })

        // move to the next period
        currentStart = currentEnd
    }

    return periods
}


export const selectWeekPeriodsFromDates = (startDate: string, endDate: string) => {
    const periods: Period[] = []

    const startMoment = moment(startDate).startOf('day')
    const endMoment = moment(endDate).startOf('day')

    let currentStart = moment(startMoment)

    while (currentStart.isBefore(endMoment, 'day')) {
        const currentEnd = moment(currentStart).add(1, 'week').startOf('isoWeek')

        const periodStart = moment.max(startMoment, currentStart)
        const periodEnd = moment.min(endMoment, currentEnd)

        periods.push({
            label: 'Week ' + currentStart.format('WW'),
            start: periodStart,
            end: periodEnd,
            timeWindow: {
                daysSinceStart: periodStart.diff(startMoment, 'day'),
                daysLength: periodEnd.diff(periodStart, 'day'),
            }
        })

        // move to the next period
        currentStart = currentEnd
    }

    return periods
}

const pregnancyStart = moment('2023-07-16')
const pregnancyDueDate = moment('2024-04-21')
export const selectPregnancyWeekPeriodsFromDates = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    (startDate: string, endDate: string) => {
        const periods: Period[] = []

        const startMoment = moment(startDate).startOf('day')
        const endMoment = moment(endDate).startOf('day')

        let current = moment(pregnancyStart)
        const weekIndex = 1
        for (let week = weekIndex; week <= 42 + weekIndex && current.isBefore(endMoment); week += 1) {
            const currentEnd = moment(current).add(1, 'week')
            const useEnd = moment.min(currentEnd, endMoment)
            if (current.isBefore(endMoment) && currentEnd.isAfter(startMoment)) {
                periods.push({
                    label: 'Burbuja week ' + week,
                    start: moment.max(current, startMoment),
                    end: moment.min(currentEnd, endMoment),
                    timeWindow: {
                        daysSinceStart: current.diff(startMoment, 'day'),
                        daysLength: useEnd.diff(current, 'day'),
                    }
                })
            }

            current = currentEnd
        }


        return periods
    }
)

export const selectDayPeriodsFromDates = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    (startDate: string, endDate: string) => {
        const periods: Period[] = []

        const startMoment = moment(startDate).startOf('day')
        const endMoment = moment(endDate).startOf('day')

        let currentStart = moment(startMoment)

        while (currentStart.isBefore(endMoment, 'day')) {
            const currentEnd = moment(currentStart).add(1, 'day').startOf('day')

            const periodStart = moment.max(startMoment, currentStart)
            const periodEnd = moment.min(endMoment, currentEnd)

            periods.push({
                label: currentStart.format('DD'),
                start: periodStart,
                end: periodEnd,
                style: currentStart.isoWeekday() >= 6
                    ? 'weekend'
                    : '',
                timeWindow: {
                    daysSinceStart: periodStart.diff(startMoment, 'day'),
                    daysLength: periodEnd.diff(periodStart, 'day'),
                }
            })

            // move to the next period
            currentStart = currentEnd
        }

        return periods
    }
)

export const selectMonthPeriods = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    selectMonthPeriodsFromDates,
)

export const selectWeekPeriods = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    selectWeekPeriodsFromDates,
)

function isTimelineEntryWithinTimeframe (entry: TimelineEntry, timelineStart: string, timelineEnd: string) {
    return moment(entry.end).isSameOrAfter(timelineStart)
        && moment(entry.start).isSameOrBefore(timelineEnd)
}

const groupCardsIntoLanes = (cards: TimelineCard[]): Array<TimelineCard[]> => {
    let lanes: Array<TimelineCard[]> = []

    for (let card of cards) {
        let addedToLane = false

        for (let lane of lanes) {
            if (!overlapsWithCardInLane(card, lane)) {
                lane.push(card)
                addedToLane = true
                break
            }
        }

        if (!addedToLane) {
            // create new lane
            lanes.push([ card ])
        }
    }

    return lanes
}

function overlapsWithCardInLane(card: TimelineCard, lane: TimelineCard[]) {
    return lane.some(current => cardsOverlap(current, card))
}

function cardsOverlap (cardA: TimelineCard, cardB: TimelineCard) {
    const segment1 = [cardA.timeWindow.daysSinceStart, cardA.timeWindow.daysSinceStart + cardA.timeWindow.daysLength]
    const segment2 = [cardB.timeWindow.daysSinceStart, cardB.timeWindow.daysSinceStart + cardB.timeWindow.daysLength]
    return segmentsOverlap(segment1, segment2) || segmentsOverlap(segment2, segment1)
}

function segmentsOverlap (seg1: number[], seg2: number[]) {
    return seg2[0] >= seg1[0] && seg2[0] < seg1[1]
        || seg2[1] > seg1[0] && seg2[1] <= seg1[1]
}