import Fragment from "@/models/Fragment";
import { IconName } from "@blueprintjs/core";
import moment, { Moment } from "moment";

const priorityIndicatorIcons: Record<number, IconName> = {
    0: 'high-priority',
    1: 'double-chevron-up',
    2: 'chevron-up',
    3: 'minus',
    4: 'chevron-down',
    5: 'double-chevron-down',
}
export function getIndicatorIcon(fragment: Fragment): IconName | undefined {
    if (fragment.role === 'event') {
        return 'calendar'
    }
    if (fragment.priority !== undefined) {
        return priorityIndicatorIcons[fragment.priority]
    }
}

export function getTimeDescription(fragment: Fragment): string[] {
    const startDate = fragment.startDate ? moment(fragment.startDate) : undefined
    const start = fragment.start ? moment(fragment.start) : undefined
    const endDate = fragment.endDate ? moment(fragment.endDate) : undefined
    const end = fragment.end ? moment(fragment.end) : undefined
    const earliestStartDate = fragment.earliestStartDate ? moment(fragment.earliestStartDate) : undefined
    const earliestStart = fragment.earliestStart ? moment(fragment.earliestStart) : undefined

    if (!startDate && !endDate) {
        return []
    }

    if (fragment.role === 'task') {
        let parts = []
        if (earliestStartDate) {
            parts.push(`start ${formatDateWithOptionalTime(earliestStartDate, earliestStart)}`)
        }
        if (startDate) {
            parts.push(`scheduled ${formatDateWithOptionalTime(startDate, start)}`)
        }
        if (endDate) {
            parts.push(`due ${formatDateWithOptionalTime(endDate, end)}`)
        }

        return parts
    } else if (fragment.role === 'event' && startDate && endDate) {
        if (start && end) { // has times
            if (startDate.isSame(endDate, 'day')) {
                return [formatSameDayTimeRange(start, end)]
            } else {
                return [formatDifferentDayTimeRange(start, end)]
            }
        } else {
            if (endDate.diff(start, 'day') === 1) {
                return [formatDate(startDate)]
            } else {
                return [formatDateRange(startDate, endDate)]
            }
        }
    }
    return ['time and time again']
}

function formatDateWithOptionalTime(date: Moment, dateTime?: Moment) {
    if (dateTime) {
        return formatDateTime(dateTime)
    } else {
        return formatDate(date)
    }
}
function formatDate(date: Moment) {
    return date.format('MMM Do')
}
function formatTime(date: Moment) {
    return date.format('kk:mm')
}
function formatDateTime(date: Moment) {
    return `${formatDate(date)} at ${formatTime(date)}`
}
function formatDateRange(start: Moment, end: Moment) {
    const inclusiveEnd = moment(end).subtract(1, 'day')
    return `${formatDate(start)} - ${formatDate(inclusiveEnd)}`
}
function formatSameDayTimeRange(start: Moment, end: Moment) {
    return `${formatDate(start)} from ${formatTime(start)} to ${formatTime(end)}`
}
function formatDifferentDayTimeRange(start: Moment, end: Moment) {
    return `from ${formatDateTime(start)} to ${formatDateTime(end)}`
}

function isFullDay(fragment: Fragment) {
    return (fragment.earliestStartDate && !fragment.earliestStartDate)
        || (fragment.startDate && !fragment.start)
        || (fragment.endDate && !fragment.end)
}