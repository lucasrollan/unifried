import React, { useCallback, useEffect } from "react";
import { throttle } from "lodash";
import style from './Timeline.module.css'
import { useAppDispatch, useAppSelector } from "@/store";
import { selectHighlightedCards, selectNumberOfDaysInView, selectScrollPos, selectTimeframeLengthDays, selectTimelineCardsByRowIds, selectTimelineRows, selectTodayTimeframeDays, timelineCardsByRow } from "@/store/timeline/selectors";
import TimelineCard from "./TimelineCard";
import TimelinePeriods from "./TimelinePeriods";
import { classes, scale } from "./utils";
import { fetchTimelineEntries, fetchTimelineRows, updateScrollPos } from "@/store/timeline/timelineSlice";
import TimelineControls from "./TimelineControls";
import createScrollable from "../Scrollable";
import { fetchCalendarEvents } from "@/store/gcal/gcalSlice";
import { selectCalendarEvents } from "@/store/gcal/selectors";
import { TimelineRow } from "@/types/timeline";

const Scrollable = createScrollable()

export default function Timeline() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTimelineEntries())
        dispatch(fetchTimelineRows())
        dispatch(fetchCalendarEvents())
    }, [dispatch])

    const daysLength = useAppSelector(selectTimeframeLengthDays)
    const todayDays = useAppSelector(selectTodayTimeframeDays)
    const daysInView = useAppSelector(selectNumberOfDaysInView)
    const scrollPos = useAppSelector(selectScrollPos)

    const rows = useAppSelector(selectTimelineRows)
    const cards = useAppSelector(selectTimelineCardsByRowIds)
    const highlightedCards = useAppSelector(selectHighlightedCards)
    const calendarEvents = useAppSelector(selectCalendarEvents)

    const allRows: TimelineRow[] = [
        ...rows,
        {
            id: 'gcal',
            label: 'Lucas\' calendar'
        }
    ]
    const allCardsByRow: timelineCardsByRow = {
        ...cards,
        'gcal': [
            calendarEvents,
        ]
    }

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
                        highlightedCards.map(card => <div
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