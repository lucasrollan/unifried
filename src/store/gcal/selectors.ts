import { RootState } from "@/store"
import { GcalEvent } from "@/types/gcal"
import { createSelector } from "@reduxjs/toolkit"
import moment from "moment"
import { TimelineCard } from "../timeline/types"

const USE_DECIMAL_DAYS = true

export const selectCalendarEvents = createSelector(
    (state: RootState) => state.timeline.startDate,
    (state: RootState) => state.timeline.endDate,
    (state: RootState) => state.calendar.eventIds,
    (state: RootState) => state.calendar.eventsById,
    (timelineStart, timelineEnd, eventIds, eventsById) =>
        filterMap(
            eventIds,
            (eventId) => eventsById[eventId],
            (event) => isEventWithinTimeframe(event, timelineStart, timelineEnd),
        ).map((event => projectCalendarEventToCard(event, timelineStart, timelineEnd)))
)

function projectCalendarEventToCard(event: GcalEvent, timelineStart: string, timelineEnd: string): TimelineCard {
    const start = event.start!.dateTime || event.start!.date
    const end = event.end!.dateTime || event.end!.date
    const useStart = moment.max(moment(start), moment(timelineStart))
    const useEnd = moment.min(moment(end), moment(timelineEnd))

    return ({
        id: event.id!,
        label: event.summary || '<No summary>',
        start: moment(event.start!.date),
        end: moment(event.end!.date),
        timeWindow: {
            daysSinceStart: useStart.diff(timelineStart, 'day', USE_DECIMAL_DAYS),
            daysLength: useEnd.diff(start, 'day', USE_DECIMAL_DAYS),
        }
    })
}

function isEventWithinTimeframe (event: GcalEvent, timelineStart: string, timelineEnd: string) {
    return moment(event.end!.dateTime).isSameOrAfter(timelineStart)
        && moment(event.start!.dateTime).isSameOrBefore(timelineEnd)
}

function filterMap<T, U>(list: T[], project: (element: T) => U, predicate: (element: U) => boolean): U[] {
    return list.reduce((acc, el) => {
        const projected = project(el)
        if (predicate(projected)) {
            return [
                ...acc,
                projected,
            ]
        } else {
            return acc
        }
    }, [] as U[])
}