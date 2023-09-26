import React from "react";
import style from './Timeline.module.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch, useAppSelector } from "@/store";
import { selectTimeframeLengthDays, selectTimelineCardsByRowIds, selectTimelineRows, selectTodayTimeframeDays } from "@/store/timeline/selectors";
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
    const dayWidthPx = useSelector((state: RootState) => state.timeline.dayWidthPx)


    const rows = useSelector(selectTimelineRows)
    const cards = useSelector(selectTimelineCardsByRowIds)

    return (
        <div className={style.timeline}>
            <div className={style.viewport} style={{ width: scale(daysLength, dayWidthPx) }}>
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
                                                                    width: scale(card.timeWindow.daysLength, dayWidthPx),
                                                                    left: scale(card.timeWindow.daysSinceStart, dayWidthPx),
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
                        left: scale(todayDays, dayWidthPx)
                    }} />
                </div>
            </div>
            <TimelineControls />
        </div>
    );
}