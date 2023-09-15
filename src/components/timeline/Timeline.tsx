import React from "react";
import style from './Timeline.module.css'
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectMonthPeriods } from "@/store/timeline/selectors";

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
    console.log(months)

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
                        <div className={style.period} style={{
                            width: scale(7),
                            left: scale(1),
                        }}><span>Week 40</span></div>
                        <div className={style.period} style={{
                            width: scale(7),
                            left: scale(8),
                        }}><span>Week 41</span></div>
                        <div className={style.period} style={{
                            width: scale(7),
                            left: scale(15),
                        }}><span>Week 42</span></div>
                    </div>
                </div>
                <div className={style.timelineRow}>
                    <h4 className={style.timelineRowTitle}>Celebrations</h4>
                    <div className={style.timelineRowLanes}>
                        <div className={style.annotation} style={{
                            width: scale(1),
                            left: scale(30),
                        }}>
                            <div className={style.annotationLabel}>Halloween</div>
                        </div>
                        <div className={style.timelineRowLane}>
                            <div className={style.timelineCard} style={{
                                width: scale(5),
                                left: scale(26),
                            }}><span>Witch week</span></div>
                        </div>
                        <div className={style.timelineRowLane}>
                            <div className={style.timelineCard} style={{
                                width: scale(5),
                                left: scale(28),
                            }}><span>Skeleton week</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}