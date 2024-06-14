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
            selectQuadsThatMatchTerms(state, props.matchTerms)
    )

    return (<div className="SourEntityList">
        {entities.map(a => <SourEntity iri={a.subject.id} key={a.subject.id} />)}
    </div>)
}

export default SourEntityList