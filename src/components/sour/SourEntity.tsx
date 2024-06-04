import { useAppSelector } from "@/store"
import { selectQuadsFromGraphThatMatchTerms, selectSubjectQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import PersonFullView from "./PersonFullView"
import DocumentFullView from "./DocumentFullView"
import AttachmentFullView from "./AttachmentFullView"

export type SourEntityProps = {
    iri: string
}

const RDFS_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
const FOAF_PERSON = 'http://xmlns.com/foaf/0.1/Person'
const SOUR_DOCUMENT_ID = 'http://rollan.info/api/rdf/document#ID'
const SOUR_DOCUMENT_SCAN = 'http://rollan.info/api/rdf/document#Scan'

export default function SourEntity (props: SourEntityProps) {
    const entityTypes = useAppSelector(state =>
        selectQuadsFromGraphThatMatchTerms(state, props.iri, [props.iri, RDFS_TYPE, null, null])
    )

    const type = entityTypes[0]?.object.id

    switch (type) {
        case FOAF_PERSON:
            return <PersonFullView iri={props.iri} />
        case SOUR_DOCUMENT_ID:
            return <DocumentFullView iri={props.iri} />
        case SOUR_DOCUMENT_SCAN:
            return <AttachmentFullView iri={props.iri} />
        default:
            break;
    }
}