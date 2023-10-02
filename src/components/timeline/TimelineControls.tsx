import React, { useEffect } from "react";
import { DayPicker } from 'react-day-picker';

import style from './TimelineControls.module.css'
import { ButtonGroup, Button, Popover, Slider, Icon } from "@blueprintjs/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectNumberOfDaysInView, selectTimeframeLengthDays, selectTimelineEnd, selectTimelineStart, selectTodayTimeframeDays } from "@/store/timeline/selectors";
import { scrollToNow, updateDaysInView, updateEndDate, updateScrollPos, updateStartDate } from "@/store/timeline/timelineSlice";
import moment from "moment";

export default function TimelineControls() {
    const dispatch = useAppDispatch()

    const timelineStart = useAppSelector(selectTimelineStart)
    const timelineEnd = useAppSelector(selectTimelineEnd)
    const daysInView = useAppSelector(selectNumberOfDaysInView)
    const timeframeLengthDays = useAppSelector(selectTimeframeLengthDays)
    const elementsOutsizeOfView = timeframeLengthDays - daysInView

    const todayDays = useAppSelector(selectTodayTimeframeDays)

    const startDate = new Date(timelineStart)
    const endDate = new Date(moment(timelineEnd).subtract(1, 'day').format('YYYY-MM-DD'))

    const setStartDate = (date: Date | undefined) => dispatch(updateStartDate(moment(date).format('YYYY-MM-DD')))
    const setEndDate = (date: Date | undefined) => dispatch(updateEndDate(moment(date).add(1, 'day').format('YYYY-MM-DD')))
    const setDaysInView = (newElementsOutsideOfView: number) => {
        const newElementsInView = timeframeLengthDays - newElementsOutsideOfView
        dispatch(updateDaysInView(newElementsInView))
    }

    const goToNow = () => {
        const todayPosition = todayDays * (window.innerWidth / daysInView)
        const newScroll = todayPosition - window.innerWidth / 4 // place line at 1/4 of the screen
        dispatch(updateScrollPos(newScroll))
    }

    useEffect(() => {
        goToNow()
    }, [])

    return <div className={style.controlPanel}>
        <ButtonGroup>
            <Button icon="locate" title="Go to now" onClick={goToNow} />
            <div className={style.zoomControl + " bp5-button"}>
                <Icon icon="zoom-out" />
                <div className={style.zoomContainer}>
                    <Slider
                        value={elementsOutsizeOfView}
                        labelRenderer={false}
                        min={0}
                        max={timeframeLengthDays - 1}
                        onChange={setDaysInView}
                    />
                </div>
                <Icon icon="zoom-in" />
            </div>
        </ButtonGroup>
        <ButtonGroup>
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