import { useAppDispatch, useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate, selectSubjectsQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import { useEffect } from "react"
import { fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { keyBy } from "lodash"
import SourEntityList from "./SourEntityList"
import SourPropertyTable from "./SourPropertyTable"

interface DocumentFullViewProps {
    iri: string,
}

function DocumentFullView (props: DocumentFullViewProps) {
    const dispatch = useAppDispatch()

    const doc = useAppSelector(selectSubjectQuadsGroupedByPredicate(props.iri))
    const docSchemaIri = doc['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].object.id

    const docSchema = useAppSelector(selectSubjectQuadsGroupedByPredicate(docSchemaIri))
    const docProperties = docSchema['http://www.w3.org/ns/shacl#property'] || []
    const docPropertyIris = docProperties.map(property => property.object.id)

    const docPropertySchemas = useAppSelector(selectSubjectsQuadsGroupedByPredicate(docPropertyIris))
    const docPropertySchemasByIri = keyBy(docPropertySchemas,
        propertySchema => propertySchema['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].subject.id
    )

    useEffect(() => {
        dispatch(fetchOntologyGraph(docSchemaIri))
    }, [docSchemaIri])

    return (<div style={{border: '1px solid gray'}} className="DocumentFullView">
            Details:
            <SourPropertyTable iri={props.iri} />
            Attachments:
            <SourEntityList
                matchTerms={[null, 'http://rollan.info/api/rdf/document#scanOf', props.iri, null]}
            />
        </div>)
}

export default DocumentFullView