import React from "react";
import timelineStyle from './Timeline.module.css'
import { TimelineCard } from "@/store/timeline/types";
import { classes } from "./utils";
import styles from './Timeline.module.css'

type TimelineCardProps = {
    card: TimelineCard,
    style: React.CSSProperties,
}

export default function TimelineCard({ card, style }: TimelineCardProps) {
    return (
        <div
            className={
                classes(
                    timelineStyle.timelineCard,
                    card.isHighlighted ? timelineStyle.highlightedCard : ''
                )
            }
            style={style}
        >
            <span className={styles.timelineCardLabel}>{card.label}</span>
        </div>
    )
}