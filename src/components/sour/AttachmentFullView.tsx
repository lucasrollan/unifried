import { useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate } from "@/store/ontologies/selectors"

interface AttachmentFullViewProps {
    iri: string,
}

function AttachmentFullView (props: AttachmentFullViewProps) {
    const attachment = useAppSelector(state => selectSubjectQuadsGroupedByPredicate(state, props.iri))

    const fileFormat = attachment['http://rollan.info/api/rdf/document#fileFormat'][0].object.id

    return (<div style={{border: '1px solid green'}} className="AttachmentFullView">
        {
            fileFormat === 'pdf'
                ? (<embed
                    src={attachment['http://rollan.info/api/rdf/document#fileName'][0].object.id}
                    type="application/pdf"
                    height="1000px"
                    width="100%"
                />)
                : (<img src={attachment['http://rollan.info/api/rdf/document#fileName'][0].object.id} />)
        }

    </div>)
}

export default AttachmentFullView