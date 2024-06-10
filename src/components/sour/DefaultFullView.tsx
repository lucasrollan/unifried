import SourPropertyTable from "./SourPropertyTable"

interface DefaultFullViewProps {
    iri: string,
}

function DefaultFullView (props: DefaultFullViewProps) {
    return (<div className="DefaultFullView">
        Default:
        <SourPropertyTable iri={props.iri} />
    </div>)
}

export default DefaultFullView