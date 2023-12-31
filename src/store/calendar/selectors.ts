import { RootState } from "@/store"
import Event from "@/models/Event"
import { createSelector } from "@reduxjs/toolkit"
import moment from "moment"
import { TimelineCard } from "../timeline/types"
import { mapValues } from "lodash"
import { TimelineRow } from "@/models/timeline"
import Calendar from "@/models/Calendar"

const USE_DECIMAL_DAYS = true

export const selectCalendarRows = createSelector(
    (state: RootState) => state.calendar.calendarIds,
    (state: RootState) => state.calendar.calendarsById,
    (state: RootState) => state.calendar.ignoredCalendarIds,
    (state: RootState) => state.calendar.ephemeridesCalendarIds,
    (calendarIds, calendarsById, ignoredCalendarIds, ephemeridesCalendarIds) =>
        calendarIds
            .filter(calendarId =>
                !ignoredCalendarIds.includes(calendarId)
                && !ephemeridesCalendarIds.includes(calendarId))
            .map(calendarId => {
                const calendar = calendarsById[calendarId]
                const row: TimelineRow = {
                    id: calendarId,
                    label: calendar.label
                }
                return row
            })
)

// return a single list of all the events that belong to an ephemerides calendar
export const selectEphemeridesEvents = createSelector(
    (state: RootState) => state.timeline,
    (state: RootState) => state.calendar,
    (timeline, calendar) =>
        calendar.calendarIds
            .filter(calendarId =>
                !calendar.ignoredCalendarIds.includes(calendarId)
                && calendar.ephemeridesCalendarIds.includes(calendarId))
            .map(calendarId =>
                filterMap(
                    calendar.eventsIdsByCalendarId[calendarId] || [],
                    (eventId) => projectCalendarEventToCard(
                        calendar.eventsById[eventId],
                        calendar.calendarsById[calendarId],
                        timeline.startDate,
                        timeline.endDate),
                    (card) => isCardWithinTimeframe(card, timeline.startDate,  timeline.endDate),
                )
            )
            .flat()
)

export const selectCalendarEventsByCalendarId = createSelector(
    (state: RootState) => state.timeline.startDate,
    (state: RootState) => state.timeline.endDate,
    (state: RootState) => state.calendar.eventsIdsByCalendarId,
    (state: RootState) => state.calendar.eventsById,
    (state: RootState) => state.calendar.calendarsById,
    (timelineStart, timelineEnd, eventsIdsByCalendarId, eventsById, calendarsById) =>
        mapValues(
            eventsIdsByCalendarId,
            (eventIds, calendarId) => [
                filterMap(
                    eventIds,
                    (eventId) => projectCalendarEventToCard(
                        eventsById[eventId],
                        calendarsById[calendarId],
                        timelineStart,
                        timelineEnd),
                    (card) => isCardWithinTimeframe(card, timelineStart, timelineEnd),
                )
            ]
        )
)

export const selectHighlightedCalendarEvents = createSelector(
    (state: RootState) => state.timeline.startDate,
    (state: RootState) => state.timeline.endDate,
    (state: RootState) => state.calendar.eventsIdsByCalendarId,
    (state: RootState) => state.calendar.eventsById,
    (state: RootState) => state.calendar.calendarsById,
    (timelineStart, timelineEnd, eventsIdsByCalendarId, eventsById, calendarsById) =>
        Object.keys(eventsIdsByCalendarId)
            .filter(calendarId => calendarsById[calendarId].isHighlighted)
            .map(calendarId =>
                filterMap(
                    eventsIdsByCalendarId[calendarId],
                    (eventId) => projectCalendarEventToCard(
                        eventsById[eventId],
                        calendarsById[calendarId],
                        timelineStart,
                        timelineEnd),
                    (card) => isCardWithinTimeframe(card, timelineStart, timelineEnd),
                )
            )
        .flat()
)

function projectCalendarEventToCard(event: Event, calendar: Calendar, timelineStart: string, timelineEnd: string): TimelineCard {
    const start = event.start
    const end = event.end
    const useStart = moment.max(moment(start), moment(timelineStart))
    const useEnd = moment.min(moment(end), moment(timelineEnd))

    return ({
        id: event.id!,
        label: event.label,
        start: moment(start),
        end: moment(end),
        isHighlighted: calendar.isHighlighted,
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

/*
we have:
- reducers
- selectors
- BE models
- FE models
- changes to FE model -> changes to BE model
*/