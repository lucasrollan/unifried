import { useAppDispatch, useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate, selectSubjectsQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import { useEffect } from "react"
import { fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { keyBy, keys, values } from "lodash"

interface SourPropertyTableProps {
    iri: string,
}

function SourPropertyTable (props: SourPropertyTableProps) {
    const dispatch = useAppDispatch()

    const entity = useAppSelector(selectSubjectQuadsGroupedByPredicate(props.iri))
    console.log('entity', props.iri, entity)
    // const entityPredicateIris = keys(entity)
    // const entityPredicateSchemas = useAppSelector(selectSubjectsQuadsGroupedByPredicate(entityPredicateIris))


    // const entitySchemaIri = entity['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].object.id

    // const entitySchema = useAppSelector(selectSubjectQuadsGroupedByPredicate(entitySchemaIri))
    // const entityProperties = entitySchema['http://www.w3.org/ns/shacl#property'] || []
    // const entityPropertyIris = entityProperties.map(property => property.object.id)

    // const entityPropertySchemas = useAppSelector(selectSubjectsQuadsGroupedByPredicate(entityPropertyIris))
    // const entityPropertySchemasByIri = keyBy(entityPropertySchemas,
    //     propertySchema => propertySchema['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0].subject.id
    // )

    // useEffect(() => {
    //     dispatch(fetchOntologyGraph(entitySchemaIri))
    // }, [entitySchemaIri])

    return (<div style={{border: '1px solid gray'}} className="SourPropertyTable">
        <ul>
            {
                values(entity).flat().map(quad =>
                    <li key={quad.predicate.id}>{quad.predicate.id}: {quad.object.id}</li>
                )
            }
            {/* {
                entityProperties.map(property => {
                    const propertySchema = entityPropertySchemasByIri[property.object.id]
                    const label = propertySchema['http://www.w3.org/2000/01/rdf-schema#label'][0].object.id
                    const path = propertySchema['http://www.w3.org/ns/shacl#path'][0].object.id
                    const value = entity[path][0].object.id
                    return (
                        <li>
                            {label}: {value}
                        </li>
                    )
                })
            } */}
        </ul>
    </div>)
}

export default SourPropertyTable