import { Literal, Quad } from "n3"

export type BasicQuad = [string, string, string, string]
export type OptionalTermsBasicQuad = [string | null, string | null, string | null, string | null]

export function projectBasicQuadToQuad(basicQuad: BasicQuad): Quad {
    return new Quad(
        new Literal(basicQuad[0]),
        new Literal(basicQuad[1]),
        new Literal(basicQuad[2]),
        new Literal(basicQuad[3]),
    )
}

export function projectQuadToBasicQuad(quad: Quad): BasicQuad {
    return [
        normalizeIri(quad.subject.value),
        normalizeIri(quad.predicate.value),
        normalizeIri(quad.object.value),
        normalizeIri(quad.graph.value),
    ]
}

export function extractGraphFromIri(iri: string) {
    return iri.replace(/#.*$/, '')
}

export function normalizeIri(iri: string) {
    return iri
        .replace(/#$/, '')
        .replace(/\/$/, '')
}

export function extractGraphsFromBasicQuads(quads: BasicQuad[]) {
    const graphs = new Set<string>()

    quads.forEach(quad => {
        graphs.add(extractGraphFromIri(quad[0]))
        graphs.add(extractGraphFromIri(quad[1]))
        graphs.add(extractGraphFromIri(quad[2]))
        graphs.add(extractGraphFromIri(quad[3]))
    })

    return Array.from(graphs).filter(value => (/^https?:\/\//).test(value))
}


export function extractPredicateGraphsFromBasicQuads(quads: BasicQuad[]) {
    const graphs = new Set<string>()

    quads.forEach(quad => {
        graphs.add(extractGraphFromIri(quad[1]))
    })

    return Array.from(graphs)
}