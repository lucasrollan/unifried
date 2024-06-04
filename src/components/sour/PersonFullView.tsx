import { useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import SourEntityList from "./SourEntityList"

interface PersonFullViewProps {
    iri: string,
}

function PersonFullView (props: PersonFullViewProps) {
    const person = useAppSelector(selectSubjectQuadsGroupedByPredicate(props.iri))

    return (<div className="PersonFullView">
        Person:
        {/* TODO: extend foaf:Person to include shacl */}
        {/* <SourPropertyTable iri={props.iri} /> */}
        <ul>
            <li>First name(s): {person['http://xmlns.com/foaf/0.1/firstName'] && person['http://xmlns.com/foaf/0.1/firstName'][0].object.id}</li>
            <li>Last name(s): {person['http://xmlns.com/foaf/0.1/lastName'] && person['http://xmlns.com/foaf/0.1/lastName'][0].object.id}</li>
        </ul>
        Documents:
        <SourEntityList
            graphIri={props.iri} // TODO pass it in the fourth term of the quad instead (after refactor)
            matchTerms={[null, 'http://rollan.info/api/rdf/document#holder', props.iri, null]}
        />
    </div>)
}

export default PersonFullView