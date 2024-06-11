import { useAppDispatch, useAppSelector } from "@/store"
import { BasicQuad } from "@/store/ontologies/BasicQuad"
import { Graph, fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { selectGraphFromIri, selectSubjectQuadsGroupedByPredicate, selectSubjectQuadsGroupedByPredicate2 } from "@/store/ontologies/selectors"
import { Tag } from "@blueprintjs/core"
import { groupBy, isEmpty, values } from "lodash"
import { useEffect } from "react"

interface SourEntityChipProps {
    iri: string,
}

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label'
const SHACL_LITERAL = 'http://www.w3.org/ns/shacl#Literal'
const SOCIAL_PERSON = 'http://rollan.info/api/rdf/social#Person'
const SOCIAL_FIRST_NAME = 'http://rollan.info/api/rdf/social#firstName'
const SOCIAL_LAST_NAME = 'http://rollan.info/api/rdf/social#lastName'
const GEO_COUNTRY = 'http://rollan.info/api/rdf/geography#Country'
const GEO_NAME = 'http://rollan.info/api/rdf/geography#name'

const flagsByCountry: Record<string, string> = {
    'http://rollan.info/api/rdf/geography#IT': '🇮🇹',
    'http://rollan.info/api/rdf/geography#AR': '🇦🇷',
    'http://rollan.info/api/rdf/geography#NL': '🇳🇱',
}

function SourEntityChip (props: SourEntityChipProps) {
    const dispatch = useAppDispatch()

    const object = useAppSelector(state => selectSubjectQuadsGroupedByPredicate2(state, props.iri))

    console.log('object:', object)
    //if not object => fetch object
    useEffect(() => {
        console.warn('WILL FETCH -- THIS SUCKS BTW')
        console.log('fetch object:', props.iri)
        dispatch(fetchOntologyGraph(props.iri))
    }, [isEmpty(object)]) //TODO: this sucks

    const objectTypeQuads = object[RDF_TYPE]
    if (!objectTypeQuads) {
        return 'NO TYPE'
    }
    const objectType = objectTypeQuads[0][2]

    switch (objectType) {
        case SOCIAL_PERSON:
            return <Tag
                icon="person"
                minimal
                interactive
                round
            >
                {object[SOCIAL_LAST_NAME][0][2]}, {object[SOCIAL_FIRST_NAME][0][2]}
            </Tag>
        case GEO_COUNTRY:
            return <Tag
                minimal
                interactive
                round
            >
                <span style={{
                    fontSize: '16px',
                    lineHeight: '12px',
                    position: 'relative',
                    top: '2px',
                }}>
                    {flagsByCountry[props.iri]}
                </span>{' '}
                {object[GEO_NAME][0][2]}
            </Tag>
    }

    return <span>Tag for {objectType}: iri={props.iri}</span>
}

export default SourEntityChip