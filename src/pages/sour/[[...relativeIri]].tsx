'use client'
import { useEffect, useState } from "react";
import SourEntity from "@/components/sour/SourEntity";

export default function SourPage() {
    const [iri, setIri] = useState<string>('')

    useEffect(() => {
        const pathname = window.location.pathname.replace(/^\/sour/, '')
        const newIri = `http://rollan.info/api/rdf${pathname}`
        setIri(newIri)
    }, [iri])

/**
 * Each component will get and filter its data from redux
 * for example: to list all the documents of a person, use
 * <DocumentList object={person.subject}} />
 * which is a connected component that will search for all the documents that have holder=object
 *
 * there could be a more generic <RenderEntity subject={subject} />
 * that has a map of type IRI to React component, like
 * renderers = {
 *      'http://rollan.info/api/schema/document#Passport': Passport
 * }
 *
 * even better, there could be a Quad describing how a type should be rendered
 * ui:RenderPassport a ui:RenderRule ;
 *      ui:targetType doc:Passport ;
 *      ui:renderer 'Passport' .
 */


    return <div>
        <h1>SOUR</h1>
        <SourEntity iri={iri} />
    </div>
}

