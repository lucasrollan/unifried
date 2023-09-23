import React from "react";
import style from './Timeline.module.css'
import { useSelector } from "react-redux";
import { RootState, useAppSelector } from "@/store";
import { selectMonthPeriods, selectPregnancyWeekPeriodsFromDates, selectWeekPeriods } from "@/store/timeline/selectors";
import { scale } from "./utils";


export default function TimelinePeriods() {
    const dayWidthPx = useAppSelector((state: RootState) => state.timeline.dayWidthPx)
    const months = useAppSelector(selectMonthPeriods)
    const weeks = useAppSelector(selectWeekPeriods)
    const burbujaWeeks = useAppSelector(selectPregnancyWeekPeriodsFromDates)

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
            <div className={style.periodLane}>
                {
                    burbujaWeeks.map(week => (
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