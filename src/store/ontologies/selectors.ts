import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"
import { groupBy, isNull, values } from "lodash"
import { OptionalTermsBasicQuad, extractGraphFromIri, projectBasicQuadToQuad } from "./BasicQuad"

export const selectAllQuads = (state: RootState) =>
    values(state.ontologies.graphsByIri)
        .flatMap(graph => graph?.quads || [])

export const selectQuadsThatMatchTerms = createSelector(
    (state: RootState, terms: OptionalTermsBasicQuad = [null, null, null, null]) => terms,
    selectAllQuads,
    (terms, quads) =>
        quads
            .filter(quad =>
                (isNull(terms[0]) || quad[0] === terms[0])
                && (isNull(terms[1]) || quad[1] === terms[1])
                && (isNull(terms[2]) || quad[2] === terms[2])
                && (isNull(terms[3]) || quad[3] === terms[3]))
            .map(projectBasicQuadToQuad)
)

export const selectGraphFromIri = createSelector(
    (state: RootState) => state.ontologies.graphsByIri,
    (state: RootState, iri: string) => extractGraphFromIri(iri),
    (graphsByIri, graphIri) =>
        graphsByIri[graphIri]
)

export const selectQuadsFromGraphThatMatchTerms = createSelector(
    selectGraphFromIri,
    (state: RootState, graphIri: string, terms: OptionalTermsBasicQuad = [null, null, null, null]) => terms,
    (graph, terms) =>
        (graph?.quads || [])
            .filter(quad =>
                (isNull(terms[0]) || quad[0] === terms[0])
                && (isNull(terms[1]) || quad[1] === terms[1])
                && (isNull(terms[2]) || quad[2] === terms[2])
                && (isNull(terms[3]) || quad[3] === terms[3]))
            .map(projectBasicQuadToQuad)
)


export const selectQuadsBySubject = createSelector(
    (state: RootState, subjectIri: string) => subjectIri,
    (state: RootState, subjectIri: string) => selectGraphFromIri(state, subjectIri),
    (subjectIri, graph) =>
        (graph?.quads || [])
            .filter(quad =>
                quad[0] === subjectIri)
            .map(projectBasicQuadToQuad)
)

export const selectQuadsByPredicate = createSelector(
    (state: RootState, predicate: string) => predicate,
    selectAllQuads,
    (predicate, quads) =>
        quads
            .filter(quad =>
                quad[1] === predicate)
            .map(projectBasicQuadToQuad)
)

export const selectQuadsByObject = createSelector(
    (state: RootState, object: string) => object,
    selectAllQuads,
    (object, quads) =>
        quads
            .filter(quad =>
                quad[2] === object)
            .map(projectBasicQuadToQuad)
)

export const selectSubjectQuadsGroupedByPredicate = createSelector(
        selectQuadsBySubject,
        quads =>
            groupBy(quads, 'predicate.id')
    )

export const selectSubjectsQuadsGroupedByPredicate = createSelector(
    (state: RootState,) => state,
    (state: RootState, subjects: string[]) => subjects,
    (state, subjects) =>
        subjects.map(subject => selectSubjectQuadsGroupedByPredicate(state, subject))
)

export const selectSubjectQuadsGroupedByPredicate2 = createSelector(
    selectAllQuads,
    (state: RootState, subjectIri: string) => subjectIri,
    (allQuads, subjectIri) =>
        groupBy(
            allQuads.filter(quad => quad[0] === subjectIri),
            '1'
        )
)