import React from "react";
import { Popover } from "@blueprintjs/core";
import timelineStyle from './Timeline.module.css'
import { TimelineCard } from "@/store/timeline/types";
import { classes } from "./utils";
import styles from './Timeline.module.css'
import TimelineCardDetails from "./TimelineCardDetails";

type TimelineCardProps = {
    card: TimelineCard,
    style: React.CSSProperties,
}

export default function TimelineCard({ card, style }: TimelineCardProps) {
    return (
        <div
            style={style}
            className={
                classes(
                    timelineStyle.timelineCard,
                    card.isHighlighted ? timelineStyle.highlightedCard : '',
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