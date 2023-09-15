import React from "react";
import style from './Timeline.module.css'

function join(...classNames: string[]): string {
    return classNames.join(' ')
}

const dayWidthPx = 25
function scale(size: number): string {
    return `${size * dayWidthPx}px`
}

const events = [
    {
        start: new Date('2023-09-12'),
        end: new Date('2023-09-15'),
        label: 'Refactor da thing'
    }
]

export default function Timeline() {
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
                        <div className={style.period} style={{
                            width: scale(31),
                            left: scale(0),
                        }}><span>October</span></div>
                        <div className={style.period} style={{
                            width: scale(30),
                            left: scale(31),
                        }}><span>November</span></div>
                        <div className={style.period} style={{
                            width: scale(31),
                            left: scale(61),
                        }}><span>December</span></div>
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