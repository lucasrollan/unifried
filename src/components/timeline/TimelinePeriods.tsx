import React from "react";
import style from './Timeline.module.css'
import { RootState, useAppSelector } from "@/store";
import { selectDayPeriodsFromDates, selectMonthPeriods, selectPregnancyWeekPeriodsFromDates, selectWeekPeriods } from "@/store/timeline/selectors";
import { classes, scale } from "./utils";


export default function TimelinePeriods() {
    const dayWidthPx = useAppSelector((state: RootState) => state.timeline.dayWidthPx)
    const months = useAppSelector(selectMonthPeriods)
    const weeks = useAppSelector(selectWeekPeriods)
    const burbujaWeeks = useAppSelector(selectPregnancyWeekPeriodsFromDates)
    const days = useAppSelector(selectDayPeriodsFromDates)

    return (
        <div className={style.periods}>
            <div className={style.periodLane}>
                {
                    months.map(month => (
                        <div className={style.period} key={month.start.format()} style={{
                            width: scale(month.timeWindow.daysLength, dayWidthPx),
                            left: scale(month.timeWindow.daysSinceStart, dayWidthPx),
                        }}><span className={style.periodLabel}>{month.label}</span></div>
                    ))
                }
            </div>
            <div className={style.periodLane}>
                {
                    days.map(day => (
                        <div className={classes(style.period, style[day.style || ''])} key={day.start.format()} style={{
                            width: scale(day.timeWindow.daysLength, dayWidthPx),
                            left: scale(day.timeWindow.daysSinceStart, dayWidthPx),
                        }}><span className={style.periodLabel}>{day.label}</span></div>
                    ))
                }
            </div>
            <div className={style.periodLane}>
                {
                    weeks.map(week => (
                        <div className={style.period} key={week.start.format()} style={{
                            width: scale(week.timeWindow.daysLength, dayWidthPx),
                            left: scale(week.timeWindow.daysSinceStart, dayWidthPx),
                        }}><span className={style.periodLabel}>{week.label}</span></div>
                    ))
                }
            </div>
            <div className={style.periodLane}>
                {
                    burbujaWeeks.map(week => (
                        <div className={style.period} key={week.start.format()} style={{
                            width: scale(week.timeWindow.daysLength, dayWidthPx),
                            left: scale(week.timeWindow.daysSinceStart, dayWidthPx),
                        }}><span className={style.periodLabel}>{week.label}</span></div>
                    ))
                }
            </div>
        </div>
    );
}