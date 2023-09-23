import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";
import { TimelineCard } from "./types";

type Period = {
    label: string,
    start: Moment,
    end: Moment,
    timeWindow: { // how this period relates to the selected time window
        daysSinceStart: number,
        daysLength: number,
    }
}

const USE_DECIMAL_DAYS = true

export const selectTimelineStart = (state: RootState) => state.timeline.startDate
export const selectTimelineEnd = (state: RootState) => state.timeline.endDate

export const selectTimeframeLengthDays = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    (start, end) => moment(end).diff(start, 'day')
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

export const selectTimelineRows = createSelector(
    (state: RootState) => state.timeline.rowIds,
    (state: RootState) => state.timeline.rowsById,
    (rowIds, rowsById) =>
        rowIds.map(rowId => rowsById[rowId])
)

export const selectTimelineCardsByRowIds = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    (state: RootState) => state.timeline.entryIds,
    (state: RootState) => state.timeline.entriesById,
    (timelineStart, timelineEnd, entryIds, entriesById) =>
        entryIds.reduce((acc, entryId) => {
            // TODO: filter to only entries that are within the timeframe
            const entry = entriesById[entryId]

            const card: TimelineCard =({
                id: entry.id,
                label: entry.label,
                start: moment(entry.start),
                end: moment(entry.end),
                isHighlighted: entry.isHighlighted,
                timeWindow: { // how this entry relates to the selected time window
                    daysSinceStart: moment(entry.start).diff(timelineStart, 'day', USE_DECIMAL_DAYS),
                    daysLength: moment(entry.end).diff(entry.start, 'day', USE_DECIMAL_DAYS),
                }
            })

            return {
                ...acc,
                [entry.rowId]: [...(acc[entry.rowId] || []), card],
            }
    }, {} as Record<string, TimelineCard[]>)
)