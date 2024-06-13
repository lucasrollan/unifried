import { useAppDispatch, useAppSelector } from "@/store"
import { fetchOntologyGraph } from "@/store/ontologies/ontologiesSlice"
import { selectGraphFromIri } from "@/store/ontologies/selectors"
import { IconName, Tag } from "@blueprintjs/core"
import { groupBy } from "lodash"
import { useEffect } from "react"

const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
const RDFS_LABEL = 'http://www.w3.org/2000/01/rdf-schema#label'
const DASH_SHAPECLASS = 'http://datashapes.org/dash#ShapeClass'
const SHACL_PROPERTYSHAPE = 'http://www.w3.org/ns/shacl#PropertyShape'
const SOCIAL_PERSON = 'http://rollan.info/schema/social#Person'
const DOCUMENT_ID = 'http://rollan.info/schema/document#ID'
const DOCUMENT_PASSPORT = 'http://rollan.info/schema/document#Passport'
const VEHICLE = 'http://rollan.info/schema/schema/vehicle'
const VEHICLE_AUTOMOBILE = 'http://rollan.info/schema/schema/vehicle#Automobile'

interface SourEntityTypeChipProps {
    typeIri: string
}

function SourEntityTypeChip (props: SourEntityTypeChipProps) {
    const dispatch = useAppDispatch()
    let label = ''

    const schemaGraph = useAppSelector(state => selectGraphFromIri(state, props.typeIri))

    if (props.typeIri === DASH_SHAPECLASS) {
        label = 'ShapeClass'
    } else if (props.typeIri === SHACL_PROPERTYSHAPE) {
        label = 'PropertyShape'
    } else if (schemaGraph) {
        const schema = groupBy(
            schemaGraph.quads.filter(quad => quad[0] === props.typeIri),
            '1'
        )
        if (schema[RDFS_LABEL]) {
            label = schema[RDFS_LABEL][0][2]
        } else {
            label = 'missing label ' + props.typeIri
        }
    } else {
        label = 'no schema ' + props.typeIri
    }

    useEffect(() => {
        console.log('schema:', schemaGraph)
        if (!schemaGraph) {
            console.log('fetch schema:', schemaGraph)
            dispatch(fetchOntologyGraph(props.typeIri))
        }
    }, [schemaGraph])

    const handleClick = () => {
        window.location.href = '/sour/pimp'
    }

    const icons: Record<string, IconName> = {
        [SOCIAL_PERSON]: 'person',
        [VEHICLE]: 'drive-time',
        [VEHICLE_AUTOMOBILE]: 'drive-time',
        [DOCUMENT_ID]: 'id-number',
        [DOCUMENT_PASSPORT]: 'id-number',
    }
    const defaultIcon = 'help'
    const icon = icons[props.typeIri] || defaultIcon

    return ((<Tag
        icon={icon}
        onClick={handleClick}
        interactive
        minimal
        round
    >{label}</Tag>))
}

export default SourEntityTypeChip