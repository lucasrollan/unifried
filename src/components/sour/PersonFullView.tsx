import SourEntityList from "./SourEntityList"
import SourPropertyTable from "./SourPropertyTable"

interface PersonFullViewProps {
    iri: string,
}

function PersonFullView (props: PersonFullViewProps) {
    return (<div className="PersonFullView">
        <SourPropertyTable iri={props.iri} />
        Documents:
        <SourEntityList
            graphIri={props.iri} // TODO pass it in the fourth term of the quad instead (after refactor)
            matchTerms={[null, 'http://rollan.info/schema/document#holder', props.iri, null]}
        />
    </div>)
}

export default PersonFullView