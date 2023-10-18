import React from "react";
import { Popover } from "@blueprintjs/core";
import { TimelineCard } from "@/store/timeline/types";
import { classes } from "./utils";
import styles from './Timeline.module.css'
import TimelineCardDetails from "./TimelineCardDetails";

type TimelineCardProps = {
    card: TimelineCard,
    style: React.CSSProperties,
}

export default function TimelineEphemerisCard({ card, style }: TimelineCardProps) {
    return (
        <div
            style={style}
            className={
                classes(
                    styles.timelineEphemerisCard,
                    card.isHighlighted ? styles.highlightedCard : '',
                    styles[card.color || ''],
                )
            }
        >
            <Popover
                interactionKind="hover"
                placement="top"
                content={<TimelineCardDetails card={card} />}
                targetTagName="div"
                hoverOpenDelay={50}
            >
                <div className={styles.timelineCardLabel}>{card.label}</div>
            </Popover>
        </div>
    )
}