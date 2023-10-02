import React, { useCallback, useEffect } from "react";
import style from './Timeline.module.css'
import { useAppDispatch, useAppSelector } from "@/store";
import { selectHighlightedCards, selectNumberOfDaysInView, selectScrollDays, selectTimeframeLengthDays, selectTimelineCardsByRowIds, selectTimelineRows, selectTodayTimeframeDays } from "@/store/timeline/selectors";
import TimelineCard from "./TimelineCard";
import TimelinePeriods from "./TimelinePeriods";
import { classes, scale } from "./utils";
import { fetchTimelineEntries, fetchTimelineRows, updateViewportScrollDays } from "@/store/timeline/timelineSlice";
import TimelineControls from "./TimelineControls";
import createScrollable from "../Scrollable";

const Scrollable = createScrollable()

export default function Timeline() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchTimelineEntries())
        dispatch(fetchTimelineRows())
    }, [dispatch])

    const daysLength = useAppSelector(selectTimeframeLengthDays)
    const todayDays = useAppSelector(selectTodayTimeframeDays)
    const daysInView = useAppSelector(selectNumberOfDaysInView)
    const scrollDays = useAppSelector(selectScrollDays)

    const rows = useAppSelector(selectTimelineRows)
    const cards = useAppSelector(selectTimelineCardsByRowIds)
    const highlightedCards = useAppSelector(selectHighlightedCards)

    const dayWidthPx = window.innerWidth / daysInView
    const maxScroll = (daysLength - daysInView) * dayWidthPx

    const handleScroll = useCallback(
        (newPos: number) => {
            const scrollDays = newPos / dayWidthPx
            console.log('handleScroll', newPos, scrollDays)
            dispatch(updateViewportScrollDays(scrollDays))
        },
        [daysInView, dayWidthPx]
    )

    return (
        <div className={style.timeline}>
            <Scrollable
                className={style.viewport}
                position={scrollDays * daysLength}
                maxPosition={maxScroll}
                onScroll={handleScroll}
            >
                <div className={style.timelineContent}
                    style={{ width: scale(daysLength, daysInView) }}
                >
                    {
                        highlightedCards.map(card => <div
                            className={classes(style.timelineHighlight, style[card.color || ''])}
                            style={{
                                width: scale(card.timeWindow.daysLength, daysInView),
                                left: scale(card.timeWindow.daysSinceStart, daysInView),
                            }}
                        />)
                    }
                    <div className={style.timelineRows}>
                        {
                            rows.map(row => (
                                <div className={style.timelineRow} key={row.id}>
                                    <h4>
                                        <span className={style.timelineRowTitle}>{row.label}</span>
                                    </h4>
                                    <div className={style.timelineRowLanes}>
                                        {
                                            (cards[row.id] || []).map((lane, laneIndex) => (
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