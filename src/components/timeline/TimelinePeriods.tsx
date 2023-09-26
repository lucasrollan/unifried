import React from "react";
import style from './Timeline.module.css'
import { RootState, useAppSelector } from "@/store";
import { selectDayPeriodsFromDates, selectMonthPeriods, selectNumberOfDaysInView, selectPregnancyWeekPeriodsFromDates, selectWeekPeriods } from "@/store/timeline/selectors";
import { classes, scale } from "./utils";


export default function TimelinePeriods() {
    const daysInView = useAppSelector(selectNumberOfDaysInView)
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
                            width: scale(month.timeWindow.daysLength, daysInView),
                            left: scale(month.timeWindow.daysSinceStart, daysInView),
                        }}><span className={style.periodLabel}>{month.label}</span></div>
                    ))
                }
            </div>
            <div className={style.periodLane}>
                {
                    days.map(day => (
                        <div className={classes(style.period, style[day.style || ''])} key={day.start.format()} style={{
                            width: scale(day.timeWindow.daysLength, daysInView),
                            left: scale(day.timeWindow.daysSinceStart, daysInView),
                        }}><span className={style.periodLabel}>{day.label}</span></div>
                    ))
                }
            </div>
            <div className={style.periodLane}>
                {
                    weeks.map(week => (
                        <div className={style.period} key={week.start.format()} style={{
                            width: scale(week.timeWindow.daysLength, daysInView),
                            left: scale(week.timeWindow.daysSinceStart, daysInView),
                        }}><span className={style.periodLabel}>{week.label}</span></div>
                    ))
                }
            </div>
            <div className={style.periodLane}>
                {
                    burbujaWeeks.map(week => (
                        <div className={style.period} key={week.start.format()} style={{
                            width: scale(week.timeWindow.daysLength, daysInView),
                            left: scale(week.timeWindow.daysSinceStart, daysInView),
                        }}><span className={style.periodLabel}>{week.label}</span></div>
                    ))
                }
            </div>
        </div>
    );
}