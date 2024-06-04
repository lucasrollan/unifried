import { useAppSelector } from "@/store"
import { selectQuadsThatMatchTerms } from "@/store/ontologies/selectors"
import DocumentFullView from "./DocumentFullView"

interface DocumentListFullViewProps {
    holderIri: string,
}

function DocumentListFullView (props: DocumentListFullViewProps) {
    const docLinks = useAppSelector(
        state =>
            selectQuadsThatMatchTerms(state, [null, 'http://rollan.info/api/rdf/document#holder', props.holderIri, null])
    )
    console.log('docLinks for', props.holderIri, '=', docLinks)

    return (<div className="DocumentListFullView">
        {docLinks.map(d => <DocumentFullView iri={d.subject.id} />)}
    </div>)
}

export default DocumentListFullView