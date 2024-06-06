import { useAppDispatch, useAppSelector } from "@/store"
import { selectQuadsFromGraphThatMatchTerms } from "@/store/ontologies/selectors"
import PersonFullView from "./PersonFullView"
import DocumentFullView from "./DocumentFullView"
import AttachmentFullView from "./AttachmentFullView"
import { fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { useEffect } from "react"

export type SourEntityProps = {
    iri: string
}

const RDFS_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
const SOUR_PERSON = 'http://rollan.info/api/rdf/social#Person'
const SOUR_DOCUMENT_ID = 'http://rollan.info/api/rdf/document#ID'
const SOUR_DOCUMENT_SCAN = 'http://rollan.info/api/rdf/document#Scan'

export default function SourEntity (props: SourEntityProps) {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (props.iri) {
            dispatch(fetchOntologyGraph(props.iri))
        }
    }, [props.iri])

    const entityTypes = useAppSelector(state =>
        selectQuadsFromGraphThatMatchTerms(state, props.iri, [props.iri, RDFS_TYPE, null, null])
    )

    const type = entityTypes[0]?.object.id

    switch (type) {
        case SOUR_PERSON:
            return <PersonFullView iri={props.iri} />
        case SOUR_DOCUMENT_ID:
            return <DocumentFullView iri={props.iri} />
        case SOUR_DOCUMENT_SCAN:
            return <AttachmentFullView iri={props.iri} />
        default:
            break;
    }
}