import React from "react";
import { DayPicker } from 'react-day-picker';

import style from './TimelineControls.module.css'
import { ButtonGroup, Button, Popover } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectTimelineEnd, selectTimelineStart } from "@/store/timeline/selectors";
import { updateEndDate, updateStartDate } from "@/store/timeline/timelineSlice";
import moment from "moment";

export default function TimelineControls() {
    const dispatch = useAppDispatch()

    const timelineStart = useAppSelector(selectTimelineStart)
    const timelineEnd = useAppSelector(selectTimelineEnd)

    const startDate = new Date(timelineStart)
    const endDate = new Date(moment(timelineEnd).subtract(1, 'day').format('YYYY-MM-DD'))

    const setStartDate = (date: Date | undefined) => dispatch(updateStartDate(moment(date).format('YYYY-MM-DD')))
    const setEndDate = (date: Date | undefined) => dispatch(updateEndDate(moment(date).add(1, 'day').format('YYYY-MM-DD')))

    return <div className={style.controlPanel}>
        <ButtonGroup >
            <Popover
                content={
                        <DayPicker
                        mode="single"
                        required
                        showOutsideDays
                        defaultMonth={startDate}
                        selected={startDate}
                        onSelect={setStartDate}
                    />
                }
            >
                <Button icon="calendar">{moment(startDate).format('D MMM, YYYY')}</Button>
            </Popover>
            <Popover
                content={
                        <DayPicker
                        mode="single"
                        required
                        defaultMonth={endDate}
                        fromDate={startDate}
                        selected={endDate}
                        onSelect={setEndDate}
                    />
                }
            >
                <Button>{moment(endDate).format('D MMM, YYYY')}</Button>
            </Popover>
        </ButtonGroup>
    </div>
}