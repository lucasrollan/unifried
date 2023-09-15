import React from "react";
import style from './Timeline.module.css'
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectMonthPeriods, selectTimelineCardsByRowIds, selectTimelineRows, selectWeekPeriods } from "@/store/timeline/selectors";

function join(...classNames: string[]): string {
    return classNames.join(' ')
}

const events = [
    {
        start: new Date('2023-09-12'),
        end: new Date('2023-09-15'),
        label: 'Refactor da thing'
    }
]

export default function Timeline() {
    const dayWidthPx = useSelector((state: RootState) => state.timeline.dayWidthPx)
    const months = useSelector(selectMonthPeriods)
    const weeks = useSelector(selectWeekPeriods)

    const rows = useSelector(selectTimelineRows)
    const cards = useSelector(selectTimelineCardsByRowIds)
    console.log(cards)

    function scale(size: number): string {
        return `${size * dayWidthPx}px`
    }

    return (
        <div className={style.timeline}>
            <div className={style.viewport}>
                <div className={style.annotation} style={{
                    width: scale(4),
                    left: scale(36),
                }}>
                    <div className={style.annotationLabel}>Weird week</div>
                </div>
                <div className={style.periods}>
                    <div className={style.periodLane}>
                        {
                            months.map(month => (
                                <div className={style.period} key={month.start.format()} style={{
                                    width: scale(month.timeWindow.daysLength),
                                    left: scale(month.timeWindow.daysSinceStart),
                                }}><span>{month.label}</span></div>
                            ))
                        }
                    </div>
                    <div className={style.periodLane}>
                        {
                            weeks.map(week => (
                                <div className={style.period} key={week.start.format()} style={{
                                    width: scale(week.timeWindow.daysLength),
                                    left: scale(week.timeWindow.daysSinceStart),
                                }}><span>{week.label}</span></div>
                            ))
                        }
                    </div>
                </div>
                {
                    rows.map(row => (
                         <div className={style.timelineRow} key={row.id}>
                            <h4 className={style.timelineRowTitle}>{row.label}</h4>
                            <div className={style.timelineRowLanes}>
                                <div className={style.annotation} style={{
                                    width: scale(1),
                                    left: scale(30),
                                }}>
                                    <div className={style.annotationLabel}>Halloween</div>
                                </div>
                                {
                                    cards[row.id].map(card => (
                                        <div className={style.timelineRowLane} key={card.id}>
                                            <div className={style.timelineCard} style={{
                                                width: scale(card.timeWindow.daysLength),
                                                left: scale(card.timeWindow.daysSinceStart),
                                            }}><span>{card.label}</span></div>
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