import React, { useCallback, useEffect } from "react";
import { throttle } from "lodash";
import style from './Timeline.module.css'
import { useAppDispatch, useAppSelector } from "@/store";
import { groupCardsIntoLanes, selectNumberOfDaysInView, selectScrollPos, selectTimeframeLengthDays, selectTodayTimeframeDays, timelineCardsByRow } from "@/store/timeline/selectors";
import TimelineCard from "./TimelineCard";
import TimelinePeriods from "./TimelinePeriods";
import { classes, scale } from "./utils";
import { updateScrollPos } from "@/store/timeline/timelineSlice";
import TimelineControls from "./TimelineControls";
import createScrollable from "../Scrollable";
import { fetchCalendarsAndEvents } from "@/store/calendar/calendarSlice";
import { selectCalendarEventsByCalendarId, selectCalendarRows, selectEphemeridesEvents, selectHighlightedCalendarEvents } from "@/store/calendar/selectors";
import { TimelineRow } from "@/models/timeline";
import TimelineEphemerisCard from "./TimelineEphemerisCard";

const Scrollable = createScrollable()

export default function Timeline() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchCalendarsAndEvents())
    }, [dispatch])

    const daysLength = useAppSelector(selectTimeframeLengthDays)
    const todayDays = useAppSelector(selectTodayTimeframeDays)
    const daysInView = useAppSelector(selectNumberOfDaysInView)
    const scrollPos = useAppSelector(selectScrollPos)

    const ephemeridesEvents = useAppSelector(selectEphemeridesEvents)
    const calendarRows = useAppSelector(selectCalendarRows)
    const calendarEventsByCalendarId = useAppSelector(selectCalendarEventsByCalendarId)
    const highlightedEvents = useAppSelector(selectHighlightedCalendarEvents)

    const ephemeridesEventByLane = groupCardsIntoLanes(ephemeridesEvents)
    const allRows: TimelineRow[] = calendarRows
    const allCardsByRow: timelineCardsByRow = calendarEventsByCalendarId

    const handleScroll = useCallback(
        throttle(
            (newPosition: number) => dispatch(updateScrollPos(newPosition)),
            500,
        ),
        []
    )

    return (
        <div className={style.timeline}>
            <Scrollable
                className={style.viewport}
                position={scrollPos}
                onScroll={handleScroll}
            >
                <div className={style.timelineContent}
                    style={{ width: scale(daysLength, daysInView) }}
                >
                    {
                        highlightedEvents.map(card => <div
                            key={card.id}
                            className={classes(style.timelineHighlight, style[card.color || ''])}
                            style={{
                                width: scale(card.timeWindow.daysLength, daysInView),
                                left: scale(card.timeWindow.daysSinceStart, daysInView),
                            }}
                        />)
                    }
                    <div className={style.timelineRows}>
                        {
                            allRows.map(row => (
                                <div className={style.timelineRow} key={row.id}>
                                    <h4>
                                        <span className={style.timelineRowTitle}>{row.label}</span>
                                    </h4>
                                    <div className={style.timelineRowLanes}>
                                        {
                                            (allCardsByRow[row.id] || []).map((lane, laneIndex) => (
                                                <div className={style.timelineRowLane} key={`${row.id}-${laneIndex}`}>
                                                    {
                                                        lane.map(card => (
                                                            <TimelineCard
                                                                key={card.id}
                                                                card={card}
                                                                style={{
                                                                    width: scale(card.timeWindow.daysLength, daysInView),
                                                                    left: scale(card.timeWindow.daysSinceStart, daysInView),
                                                                }}
                                                            />
                                                        ))
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className={style.timelineEphemerides}>
                        {
                            ephemeridesEventByLane.map((lane, laneIndex) => (
                                <div className={style.timelineEphemeridesLane} key={laneIndex}>
                                    {
                                        lane.map(card => (
                                            <TimelineEphemerisCard
                                                key={card.id}
                                                card={card}
                                                style={{
                                                    width: scale(card.timeWindow.daysLength, daysInView),
                                                    left: scale(card.timeWindow.daysSinceStart, daysInView),
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <TimelinePeriods />
                    <div className={style.todayMarker} style={{
                        left: scale(todayDays, daysInView)
                    }} />
                </div>
            </Scrollable>
            <TimelineControls />
        </div>
    );
}