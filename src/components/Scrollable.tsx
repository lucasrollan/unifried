import React, { WheelEventHandler, useRef } from "react"

// horizontal scroll controlled component
type ScrollableProps = {
    position: number,
    maxPosition: number,
    onScroll: (newPosition: number) => void,
    children?: React.ReactNode,
    className?: string,
}

export default function createScrollable() {
    let lastKnownPosition = 0

    return function Scrollable (props: ScrollableProps) {
        const handleScroll: WheelEventHandler<HTMLDivElement> = (ev) => {
            ev.preventDefault()

            const delta = ev.deltaX + ev.deltaY
            // const delta = ev.deltaY
            if (delta) {
                let newPosition = lastKnownPosition + delta
                if (newPosition < 0) {
                    newPosition = 0
                } else if (newPosition > props.maxPosition) {
                    newPosition = props.maxPosition
                }

                if (newPosition !== lastKnownPosition) {
                    lastKnownPosition = newPosition
                    props.onScroll(newPosition)
                }
            }
        }
        const elRef = useRef<HTMLDivElement>(null)

        if (props.position != lastKnownPosition) {
            // lastKnownPosition = props.position
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
            onWheel={handleScroll}
            ref={elRef}
        >
            {props.children}
        </div>
    }
}