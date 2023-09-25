import React from "react";
import { DayPicker } from 'react-day-picker';

import style from './TimelineControls.module.css'
import { ButtonGroup, Button, Popover } from "@blueprintjs/core";

export default function TimelineControls() {
    const [startDate, setStartDate] = React.useState<Date | undefined>(new Date());
    const [endDate, setEndDate] = React.useState<Date | undefined>(new Date());

    return <div className={style.controlPanel}>
        <ButtonGroup >
            <Popover
                content={
                        <DayPicker
                        mode="single"
                        required
                        selected={startDate}
                        onSelect={setStartDate}
                    />
                }
            >
                <Button icon="calendar">From</Button>
            </Popover>
            <Popover
                content={
                        <DayPicker
                        mode="single"
                        required
                        selected={endDate}
                        onSelect={setEndDate}
                    />
                }
            >
                <Button icon="calendar">To</Button>
            </Popover>
        </ButtonGroup>
    </div>
}