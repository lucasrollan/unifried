import { useAppDispatch, useAppSelector } from "@/store"
import { BasicQuad } from "@/store/ontologies/BasicQuad"
import { Graph, fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { selectGraphFromIri, selectSubjectQuadsGroupedByPredicate, selectSubjectQuadsGroupedByPredicate2 } from "@/store/ontologies/selectors"
import { groupBy, isEmpty, values } from "lodash"
import { useEffect } from "react"
import SourEntityChip from "./SourEntityChip"
import SourEntityTypeChip from "./SourEntityTypeChip"

interface SourQuadObjectProps {
    predicateIri: string,
    object: string,
}

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label'
const SHACL_LITERAL = 'http://www.w3.org/ns/shacl#Literal'

function SourQuadObject (props: SourQuadObjectProps) {
    if (props.predicateIri === RDF_TYPE) {
        return <SourEntityTypeChip typeIri={props.object} />
    }

    const objectIsIri = /^https?:\/\//.test(props.object)

    if (!objectIsIri) {
        return <span className="SourLiteral">{props.object}</span>
    }

    return <SourEntityChip iri={props.object} />
}

export default SourQuadObject