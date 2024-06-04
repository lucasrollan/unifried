import { useAppDispatch, useAppSelector } from "@/store"
import { selectGraphFromIri, selectSubjectQuadsGroupedByPredicate, selectSubjectsQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import AttachmentListFullView from "./AttachmentListFullView"
import { useEffect, useState } from "react"
import { fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { Dictionary } from "@reduxjs/toolkit"
import { Quad } from "n3"
import { keyBy } from "lodash"
import { extractGraphFromIri } from "@/store/ontologies/BasicQuad"

interface DocumentFullViewProps {
    iri: string,
}

function DocumentFullView (props: DocumentFullViewProps) {
    const dispatch = useAppDispatch()

    console.group(`Rendering document ${props.iri}`)

    const graph = useAppSelector(state => selectGraphFromIri(state, props.iri))
    console.log('graphIri', extractGraphFromIri(props.iri))
    console.log('graph', graph)

    const doc = useAppSelector(selectSubjectQuadsGroupedByPredicate(props.iri))
    console.log('doc', doc)
    const docSchemaIri = doc['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].object.id
    console.log('docSchemaIri', docSchemaIri)

    const docSchema = useAppSelector(selectSubjectQuadsGroupedByPredicate(docSchemaIri))
    console.log('docSchema', docSchema)
    const docProperties = docSchema['http://www.w3.org/ns/shacl#property'] || []
    console.log('docProperties', docProperties)
    const docPropertyIris = docProperties.map(property => property.object.id)
    console.log('docPropertyIris', docPropertyIris)

    const docPropertySchemas = useAppSelector(selectSubjectsQuadsGroupedByPredicate(docPropertyIris))
    console.log('docPropertySchemas', docPropertySchemas)
    const docPropertySchemasByIri = keyBy(docPropertySchemas,
        propertySchema => propertySchema['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].subject.id
    )
    console.log('docPropertySchemasByIri', docPropertySchemasByIri)

    console.groupEnd()

    useEffect(() => {
        dispatch(fetchOntologyGraph(docSchemaIri))
    }, [docSchemaIri])
    return (<div style={{border: '1px solid gray'}} className="DocumentFullView">
            Details:
            {
                <ul>
                    {
                        docProperties.map(property => {
                            const propertySchema = docPropertySchemasByIri[property.object.id]
                            console.log('property', property)
                            console.log('propertySchema', propertySchema)
                            const label = propertySchema['http://www.w3.org/2000/01/rdf-schema#label'][0].object.id
                            const path = propertySchema['http://www.w3.org/ns/shacl#path'][0].object.id
                            const value = doc[path][0].object.id
                            return (
                                <li>
                                    {label}: {value}
                                </li>
                            )
                        })
                    }
                </ul>
            }
            Attachments:
            <AttachmentListFullView documentIri={props.iri} />
        </div>)
}

export default DocumentFullView