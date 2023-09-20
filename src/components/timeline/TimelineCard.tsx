import React from "react";
import timelineStyle from './Timeline.module.css'
import { TimelineCard } from "@/store/timeline/types";
import { classes } from "./utils";

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
            <span>{card.label}</span>
        </div>
    )
}