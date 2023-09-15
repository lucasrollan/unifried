import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectTimelineStart = (state: RootState) => state.timeline.startDate
export const selectTimelineEnd = (state: RootState) => state.timeline.endDate

export const selectMonthPeriodsFromDates = (startDate: Date, endDate: Date) => {

}

export const selectMonthPeriods = createSelector(
    selectTimelineStart,
    selectTimelineEnd,
    selectMonthPeriodsFromDates,
)

