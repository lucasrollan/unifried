import React from "react";
import style from './Timeline.module.css'
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectMonthPeriods, selectWeekPeriods } from "@/store/timeline/selectors";
import { scale } from "./utils";


export default function TimelinePeriods() {
    const dayWidthPx = useSelector((state: RootState) => state.timeline.dayWidthPx)
    const months = useSelector(selectMonthPeriods)
    const weeks = useSelector(selectWeekPeriods)

    return (
        <div className={style.periods}>
            <div className={style.periodLane}>
                {
                    months.map(month => (
                        <div className={style.period} key={month.start.format()} style={{
                            width: scale(month.timeWindow.daysLength, dayWidthPx),
                            left: scale(month.timeWindow.daysSinceStart, dayWidthPx),
                        }}><span>{month.label}</span></div>
                    ))
                }
            </div>
            <div className={style.periodLane}>
                {
                    weeks.map(week => (
                        <div className={style.period} key={week.start.format()} style={{
                            width: scale(week.timeWindow.daysLength, dayWidthPx),
                            left: scale(week.timeWindow.daysSinceStart, dayWidthPx),
                        }}><span>{week.label}</span></div>
                    ))
                }
            </div>
        </div>
    );
}