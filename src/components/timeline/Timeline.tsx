import React from "react";
import style from './Timeline.module.css'
import { useAppDispatch, useAppSelector } from "@/store";
import { selectNumberOfDaysInView, selectTimeframeLengthDays, selectTimelineCardsByRowIds, selectTimelineRows, selectTodayTimeframeDays } from "@/store/timeline/selectors";
import TimelineCard from "./TimelineCard";
import TimelinePeriods from "./TimelinePeriods";
import { scale } from "./utils";
import { fetchTimelineEntries, fetchTimelineRows } from "@/store/timeline/timelineSlice";
import TimelineControls from "./TimelineControls";

export default function Timeline() {
    const dispatch = useAppDispatch()
    dispatch(fetchTimelineEntries()) // TODO: This is re-triggering the fetch on every render
    dispatch(fetchTimelineRows()) // TODO: This is re-triggering the fetch on every render

    const daysLength = useAppSelector(selectTimeframeLengthDays)
    const todayDays = useAppSelector(selectTodayTimeframeDays)
    const daysInView = useAppSelector(selectNumberOfDaysInView)

    const rows = useAppSelector(selectTimelineRows)
    const cards = useAppSelector(selectTimelineCardsByRowIds)

    return (
        <div className={style.timeline}>
            <div className={style.viewport} style={{ minWidth: scale(daysLength, daysInView) }}>
                <div className={style.timelineContent}>
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
            </div>
            <TimelineControls />
        </div>
    );
}