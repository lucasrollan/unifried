import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";
import moment, { Moment, months } from "moment";

type Period = {
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

export const selectMonthPeriods = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    selectMonthPeriodsFromDates,
)

