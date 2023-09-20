import React from "react";
import style from './Timeline.module.css'
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectTimelineCardsByRowIds, selectTimelineRows } from "@/store/timeline/selectors";
import TimelineCard from "./TimelineCard";
import TimelinePeriods from "./TimelinePeriods";
import { scale } from "./utils";


export default function Timeline() {
    const dayWidthPx = useSelector((state: RootState) => state.timeline.dayWidthPx)

    const rows = useSelector(selectTimelineRows)
    const cards = useSelector(selectTimelineCardsByRowIds)

    return (
        <div className={style.timeline}>
            <div className={style.viewport}>
                <TimelinePeriods />
                {
                    rows.map(row => (
                         <div className={style.timelineRow} key={row.id}>
                            <h4 className={style.timelineRowTitle}>{row.label}</h4>
                            <div className={style.timelineRowLanes}>
                                {
                                    cards[row.id].map(card => (
                                        <div className={style.timelineRowLane} key={card.id}>
                                            <TimelineCard
                                                card={card}
                                                style={{
                                                    width: scale(card.timeWindow.daysLength, dayWidthPx),
                                                    left: scale(card.timeWindow.daysSinceStart, dayWidthPx),
                                                }}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}