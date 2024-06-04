import { useAppSelector } from "@/store"
import { selectQuadsFromGraphThatMatchTerms, selectQuadsThatMatchTerms } from "@/store/ontologies/selectors"
import SourEntity from "./SourEntity"

interface SourEntityListProps {
    matchTerms?: [string | null, string | null, string | null, string | null],
    graphIri?: string
}

function SourEntityList (props: SourEntityListProps) {
    const entities = useAppSelector(
        state =>
            props.graphIri
                // TODO: the graph is already the fourth element in the quad. no need to have two methods
                ? selectQuadsFromGraphThatMatchTerms(state, props.graphIri, props.matchTerms)
                : selectQuadsThatMatchTerms(state, props.matchTerms)
    )

    return (<div className="SourEntityList">
        {entities.map(a => <SourEntity iri={a.subject.id} />)}
    </div>)
}

export default SourEntityList