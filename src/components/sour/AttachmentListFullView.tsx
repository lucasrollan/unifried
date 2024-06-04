import { useAppSelector } from "@/store"
import { selectQuadsThatMatchTerms } from "@/store/ontologies/selectors"
import AttachmentFullView from "./AttachmentFullView"

interface AttachmentListFullViewProps {
    documentIri: string,
}

function AttachmentListFullView (props: AttachmentListFullViewProps) {
    const attachments = useAppSelector(
        state =>
            selectQuadsThatMatchTerms(state, [null, 'http://rollan.info/api/rdf/document#scanOf', props.documentIri, null])
    )

    return (<div className="AttachmentListFullView">
        {attachments.map(a => <AttachmentFullView iri={a.subject.id} />)}
    </div>)
}

export default AttachmentListFullView