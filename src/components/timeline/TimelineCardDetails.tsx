import React from "react";
import { TimelineCard } from "@/store/timeline/types";
import style from './Timeline.module.css'

type TimelineCardDetailsProps = {
    card: TimelineCard,
}

export default function TimelineCardDetails({ card }: TimelineCardDetailsProps) {
    const isFullDay = card.start.hours() === 0 && card.start.minutes() === 0
        && card.end.hours() === 0 && card.end.minutes() === 0

    const isOneDay = isFullDay && card.end.diff(card.start, 'day', true) === 1

    let dateText = <div></div>
    if (isOneDay) {
        dateText = <div><b>{card.start.format('D MMM YYYY')}</b></div>
    } else if (isFullDay) {
        dateText = <div><b>{card.start.format('D MMM YYYY')}</b> - <b>{card.end.format('D MMM YYYY')}</b></div>
    } else {
        if (card.start.isSame(card.end, 'day')) {
            dateText = <div><b>{card.start.format('D MMM YYYY, HH:mm')}</b> - <b>{card.end.format('HH:mm')}</b></div>
        } else {
            dateText = <div><b>{card.start.format('D MMM YYYY, HH:mm')}</b> - <b>{card.end.format('D MMM YYYY, HH:mm')}</b></div>
        }
    }

    return (
        <div
            className={style.timelineCardDetails}
        >
            <h3>{card.label}</h3>
            <div>
                {dateText}
            </div>
        </div>
    )
}