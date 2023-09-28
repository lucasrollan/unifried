import React, { UIEventHandler, createRef, useRef, useState } from "react"

// horizontal scroll controlled component
type ScrollableProps = {
    position: number,
    onScroll: (newPosition: number) => void,
    children?: React.ReactNode,
    className?: string,
}

export default function createScrollable() {
    let lastKnownPosition = 0

    return function Scrollable (props: ScrollableProps) {
        const handleScroll: UIEventHandler = ev => {
            const newPosition = ev.currentTarget.scrollLeft
            lastKnownPosition = newPosition
            props.onScroll(newPosition)
        }
        const elRef = useRef<HTMLDivElement>(null)

        if (props.position != lastKnownPosition) {
            lastKnownPosition = props.position
            elRef.current?.scrollTo({
                left: props.position,
                behavior: 'smooth',
            })
        }

        return <div
            style={{
                overflowX: 'scroll',
            }}
            className={props.className}
            onScroll={handleScroll}
            ref={elRef}
        >
            {props.children}
        </div>
    }
}