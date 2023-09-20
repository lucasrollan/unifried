import { Moment } from "moment";

export type TimelineCard = {
    id: string,
    label: string,
    start: Moment,
    end: Moment,
    isHighlighted?: boolean,
    timeWindow: { // how this period relates to the selected time window
        daysSinceStart: number,
        daysLength: number,
    }
}
