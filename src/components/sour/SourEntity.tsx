import { useAppDispatch, useAppSelector } from "@/store"
import { selectQuadsFromGraphThatMatchTerms } from "@/store/ontologies/selectors"
import PersonFullView from "./PersonFullView"
import DocumentFullView from "./DocumentFullView"
import AttachmentFullView from "./AttachmentFullView"
import { fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { useEffect, useState } from "react"
import DefaultFullView from "./DefaultFullView"
import { BasicQuad, OptionalTermsBasicQuad } from "@/store/ontologies/BasicQuad"

export type SourEntityProps = {
    iri: string
}

const RDFS_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
const SOUR_PERSON = 'http://rollan.info/schema/social#Person'
const SOUR_DOCUMENT_ID = 'http://rollan.info/schema/document#ID'
const SOUR_DOCUMENT_PASSPORT = 'http://rollan.info/schema/document#Passport'
const SOUR_DOCUMENT_SCAN = 'http://rollan.info/schema/document#Scan'
const SOUR_AUTOMOBILE = 'http://rollan.info/schema/schema/vehicle#Automobile'

export default function SourEntity (props: SourEntityProps) {
    const dispatch = useAppDispatch()
    const [ searchTerms, setSearchTerms ] = useState<OptionalTermsBasicQuad>([null, null, null, null])

    useEffect(() => {
        if (props.iri) {
            dispatch(fetchOntologyGraph(props.iri))
        }
        setSearchTerms([props.iri, RDFS_TYPE, null, null])

    }, [props.iri])

    const entityTypes = useAppSelector(state =>
        selectQuadsFromGraphThatMatchTerms(state, props.iri, searchTerms)
    )

    const type = entityTypes[0]?.object.id
    let element

    switch (type) {
        case SOUR_PERSON:
            element = <PersonFullView iri={props.iri} />
            break
        case SOUR_DOCUMENT_ID:
            element = <DocumentFullView iri={props.iri} />
            break
        case SOUR_DOCUMENT_PASSPORT:
            element = <DocumentFullView iri={props.iri} />
            break
        case SOUR_DOCUMENT_SCAN:
            element = <AttachmentFullView iri={props.iri} />
            break
        default:
            element = <DefaultFullView iri={props.iri} />
            break
    }

    return <div className="SourEntity" style={{ marginLeft: '12px' }}>
        {element}
    </div>
}