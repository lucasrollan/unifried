export type TimelineRow = {
    id: string,
    label: string,
    entryIds: string[],
}

export type TimelineEntry = {
    id: string,
    label: string,
    start: string,
    end: string,
    isHighlighted?: boolean,
}