import { useAppSelector } from "@/store"
import { selectSubjectQuadsGroupedByPredicate } from "@/store/ontologies/selectors"

interface AttachmentFullViewProps {
    iri: string,
}

function AttachmentFullView (props: AttachmentFullViewProps) {
    const attachment = useAppSelector(state => selectSubjectQuadsGroupedByPredicate(state, props.iri))

    const fileFormat = attachment['http://rollan.info/schema/document#fileFormat'][0].object.id
    const fileIri = attachment['http://rollan.info/schema/document#fileName'][0].object.id
    const fileUrl = new URL('/api/resourceFile', window.location.href)
    fileUrl.searchParams.set('iri', fileIri)

    return (<div style={{border: '1px solid green'}} className="AttachmentFullView">
        {
            fileFormat === 'pdf'
                ? (<embed
                    src={fileUrl.toString()}
                    type="application/pdf"
                    height="1000px"
                    width="100%"
                />)
                : (<img src={fileUrl.toString()} />)
        }

    </div>)
}

export default AttachmentFullView