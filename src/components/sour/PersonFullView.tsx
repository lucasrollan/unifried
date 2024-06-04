import { useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import DocumentListFullView from "./DocumentListFullView"

interface PersonFullViewProps {
    iri: string,
}

function PersonFullView (props: PersonFullViewProps) {
    const person = useAppSelector(selectSubjectQuadsGroupedByPredicate(props.iri))

    return (<div className="PersonFullView">
        Person:
        <ul>
            <li>First name(s): {person['http://xmlns.com/foaf/0.1/firstName'] && person['http://xmlns.com/foaf/0.1/firstName'][0].object.id}</li>
            <li>Last name(s): {person['http://xmlns.com/foaf/0.1/lastName'] && person['http://xmlns.com/foaf/0.1/lastName'][0].object.id}</li>
        </ul>
        Documents:
        <DocumentListFullView holderIri={props.iri} />
    </div>)
}

export default PersonFullView