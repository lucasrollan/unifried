import { RootState } from "@/store"
import { GcalEvent } from "@/types/gcal"
import { createSelector } from "@reduxjs/toolkit"
import moment from "moment"
import { TimelineCard } from "../timeline/types"
import { mapValues } from "lodash"
import { TimelineRow } from "@/types/timeline"

const USE_DECIMAL_DAYS = true

export const selectCalendarRows = createSelector(
    (state: RootState) => state.calendar.calendarIds,
    (state: RootState) => state.calendar.calendarsById,
    (state: RootState) => state.calendar.ignoredCalendarIds,
    (calendarIds, calendarsById, ignoredCalendarIds) =>
        calendarIds
            .filter(calendarId => !ignoredCalendarIds.includes(calendarId))
            .map(calendarId => {
                const calendar = calendarsById[calendarId]
                const row: TimelineRow = {
                    id: calendarId,
                    label: calendar.summary || '',
                }
                return row
            })
)

export const selectCalendarEventsByCalendarId = createSelector(
    (state: RootState) => state.timeline.startDate,
    (state: RootState) => state.timeline.endDate,
    (state: RootState) => state.calendar.eventsIdsByCalendarId,
    (state: RootState) => state.calendar.eventsById,
    (timelineStart, timelineEnd, eventsIdsByCalendarId, eventsById) =>
        mapValues(
            eventsIdsByCalendarId,
            eventIds => [
                filterMap(
                    eventIds,
                    (eventId) => projectCalendarEventToCard(eventsById[eventId], timelineStart, timelineEnd),
                    (card) => isCardWithinTimeframe(card, timelineStart, timelineEnd),
                )
            ]
        )
)

function projectCalendarEventToCard(event: GcalEvent, timelineStart: string, timelineEnd: string): TimelineCard {
    const start = event.start!.dateTime || event.start!.date
    const end = event.end!.dateTime || event.end!.date
    const useStart = moment.max(moment(start), moment(timelineStart))
    const useEnd = moment.min(moment(end), moment(timelineEnd))

    return ({
        id: event.id!,
        label: event.summary || '<No summary>',
        start: moment(start),
        end: moment(end),
        timeWindow: {
            daysSinceStart: useStart.diff(timelineStart, 'day', USE_DECIMAL_DAYS),
            daysLength: useEnd.diff(start, 'day', USE_DECIMAL_DAYS),
        }
    })
}

function isCardWithinTimeframe (card: TimelineCard, timelineStart: string, timelineEnd: string) {
    return card.end.isAfter(timelineStart)
        && card.start.isBefore(timelineEnd)
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