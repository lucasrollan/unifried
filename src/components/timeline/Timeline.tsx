import React from "react";
import style from './Timeline.module.css'
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { selectMonthPeriods, selectTimeframeLengthDays, selectTimelineCardsByRowIds, selectTimelineRows, selectWeekPeriods, selectedHighlightedTimelineCards } from "@/store/timeline/selectors";

function classes(...classNames: string[]): string {
    return classNames.filter(Boolean).join(' ')
}

export default function Timeline() {
    const dayWidthPx = useSelector((state: RootState) => state.timeline.dayWidthPx)
    const lengthDays = useSelector(selectTimeframeLengthDays)
    const months = useSelector(selectMonthPeriods)
    const weeks = useSelector(selectWeekPeriods)

    const rows = useSelector(selectTimelineRows)
    const cards = useSelector(selectTimelineCardsByRowIds)
    const highlightedCards = useSelector(selectedHighlightedTimelineCards)

    function scale(size: number): string {
        return `${size * dayWidthPx}px`
    }

    return (
        <div className={style.timeline}>
            <div className={style.viewport} style={{ width: scale(lengthDays) }}>
                {
                    highlightedCards.map(card => (
                        <div className={style.timelineRowLane} key={card.id}>
                            <div
                                className={
                                    classes(
                                        style.timelineCard,
                                        card.isHighlighted ? style.highlightedCard : '',
                                    )
                                }
                                style={{
                                    width: scale(card.timeWindow.daysLength),
                                    left: scale(card.timeWindow.daysSinceStart),
                                }
                            }>
                                <span>{card.label}</span>
                            </div>
                        </div>
                    ))
                }
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
                                {
                                    cards[row.id].map(card => (
                                        <div className={style.timelineRowLane} key={card.id}>
                                            <div
                                                className={ style.timelineCard }
                                                style={{
                                                    width: scale(card.timeWindow.daysLength),
                                                    left: scale(card.timeWindow.daysSinceStart),
                                                }
                                            }>
                                                <span>{card.label}</span>
                                            </div>
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