import { useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import { values } from "lodash"
import SourLabel from "./SourLabel"

interface SourPropertyTableProps {
    iri: string,
}

function SourPropertyTable (props: SourPropertyTableProps) {

    const entity = useAppSelector(state => selectSubjectQuadsGroupedByPredicate(state, props.iri))

    return (<div style={{border: '1px solid gray'}} className="SourPropertyTable">
        <ul>
            {
                values(entity).flat().map(quad =>
                    <li key={quad.predicate.id}><SourLabel iri={quad.predicate.id} />: {quad.object.id}</li>
                )
            }
        </ul>
    </div>)
}

export default SourPropertyTable