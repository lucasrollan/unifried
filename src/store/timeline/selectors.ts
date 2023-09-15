import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";
import moment, { Moment, months } from "moment";
import { TimelineState } from "./timelineSlice";

type Period = {
    label: string,
    start: Moment,
    end: Moment,
    timeWindow: { // how this period relates to the selected time window
        daysSinceStart: number,
        daysLength: number,
    }
}

type TimelineCard = {
    id: string,
    label: string,
    start: Moment,
    end: Moment,
    timeWindow: { // how this period relates to the selected time window
        daysSinceStart: number,
        daysLength: number,
    }
}

export const selectTimelineStart = (state: RootState) => state.timeline.startDate
export const selectTimelineEnd = (state: RootState) => state.timeline.endDate

export const selectMonthPeriodsFromDates = (startDate: Date, endDate: Date) => {
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


export const selectWeekPeriodsFromDates = (startDate: Date, endDate: Date) => {
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
    (state: RootState) => state.timeline.rowIds,
    (state: RootState) => state.timeline.rowsById,
    (state: RootState) => state.timeline.entriesById,
    (timelineStart, timelineEnd, rowIds, rowsById, entriesById) =>
        rowIds.reduce((acc, rowId) => {
            const row = rowsById[rowId]
            const entries = row.entryIds.map(entryId => entriesById[entryId])
            const cards: TimelineCard[] = entries.map(entry => ({
                id: entry.id,
                label: entry.label,
                start: moment(entry.start),
                end: moment(entry.end),
                timeWindow: { // how this entry relates to the selected time window
                    daysSinceStart: moment(entry.start).diff(timelineStart, 'day'),
                    daysLength: moment(entry.end).diff(entry.start, 'day'),
                }
            }))

            return {
                ...acc,
                [rowId]: cards,
            }
    }, {}) as Record<string, TimelineCard[]>
)