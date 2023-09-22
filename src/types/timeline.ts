export type TimelineRow = {
    id: string,
    label: string,
}

export type TimelineEntry = {
    id: string,
    label: string,
    start: string,
    end: string,
    rowId: string,
    isHighlighted?: boolean,
}