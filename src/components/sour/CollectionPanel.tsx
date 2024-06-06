import { ReactElement, ReactNode } from "react"

type CollectionPanelProps = {
    title?: ReactNode,
    children?: ReactNode,
}

export default function CollectionPanel(props: CollectionPanelProps) {
    return <div className="CollectionPanel">
        {props.title && <h2>{props.title}</h2>}
        {props.children}
    </div>
}