import { useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate } from "@/store/ontologies/selectors"
import SourEntityList from "./SourEntityList"
import SourPropertyTable from "./SourPropertyTable"

interface DocumentFullViewProps {
    iri: string,
}

function DocumentFullView (props: DocumentFullViewProps) {
    const doc = useAppSelector(state => selectSubjectQuadsGroupedByPredicate(state, props.iri))

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