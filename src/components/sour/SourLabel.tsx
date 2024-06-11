import { useAppDispatch, useAppSelector } from "@/store"
import { fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { selectGraphFromIri, selectSubjectQuadsGroupedByPredicate, selectSubjectQuadsGroupedByPredicate2 } from "@/store/ontologies/selectors"
import { groupBy, isEmpty } from "lodash"
import { useEffect } from "react"

interface SourLabelProps {
    iri: string,
}

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label'

function SourLabel (props: SourLabelProps) {
    const dispatch = useAppDispatch()
    let label = ''

    const schemaGraph = useAppSelector(state => selectGraphFromIri(state, props.iri))

    if (props.iri === RDF_TYPE) {
        label = 'type'
    } else if (schemaGraph) {
        const schema = groupBy(
            schemaGraph.quads.filter(quad => quad[0] === props.iri),
            '1'
        )
        if (schema[RDFS_LABEL]) {
            label = schema[RDFS_LABEL][0][2]
        } else {
            label = 'missing label ' + props.iri
        }
    } else {
        label = 'no schema ' + props.iri
    }

    useEffect(() => {
        console.log('schema:', schemaGraph)
        if (!schemaGraph) {
            console.log('fetch schema:', schemaGraph)
            dispatch(fetchOntologyGraph(props.iri))
        }
    }, [schemaGraph])

    return (<span className="SourLabel">
        {label}
    </span>)
}

export default SourLabel