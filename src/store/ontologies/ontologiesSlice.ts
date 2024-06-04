import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Parser, Quad, NamedNode } from "n3"
import { BasicQuad, extractGraphFromIri, extractGraphsFromBasicQuads, extractPredicateGraphsFromBasicQuads, projectQuadToBasicQuad } from './BasicQuad'
import { Dictionary } from "@reduxjs/toolkit"
import { forEach, keys, mapValues } from 'lodash'
import { RootState } from '..'


export interface OntologiesState {
    graphsByIri: Dictionary<Graph>,
}

export type Graph = {
    iri: string,
    prefixes: Dictionary<string>,
    quads: Array<BasicQuad>
}

const initialState: OntologiesState = {
    graphsByIri: {},
}

async function parseOntologyGraph(doc: string, iri: string): Promise<Graph> {
    const parser = new Parser();
    const graph: Graph = {
        iri: extractGraphFromIri(iri),
        prefixes: {},
        quads: [],
    }

    const promise: Promise<Graph> = new Promise((resolve, reject) => {
        parser.parse(
            doc,
            (error, quad, prefixes) => {
                if (error) {
                    reject(error)
                }

                if (quad) {
                    const graphIri = new NamedNode(iri)
                    const quadWithGraph = new Quad(quad.subject, quad.predicate, quad.object, graphIri)
                    graph.quads.push(projectQuadToBasicQuad(quadWithGraph))
                } else {
                    graph.prefixes = mapValues(prefixes, v => v.value)

                    resolve(graph)
                }
            });
    })

    return promise
}

const api_fetchOntologyGraph = async function (iri: string): Promise<Graph> {
    let content = ''

    if (/rollan\.info/.test(iri)) {
        const localizedIri = iri.replace('rollan.info', 'localhost:3000')
        const normalizedIri = localizedIri.replace(/#.*$/, '')
        const result = await fetch(normalizedIri)
        content = await result.text()
    } else {
        // const result = await fetch(`http://localhost:3000/api/rdf/proxy?iri=${iri}`)
        // content = await result.text()
    }

    const graph = await parseOntologyGraph(content, iri)
    return graph
}

export const fetchOntologyGraph = createAsyncThunk(
    'ontologies/fetch',
    async (iri: string, thunkApi) => {
        const result = await api_fetchOntologyGraph(iri)
        console.log('ontologies/fetch result for', iri, result)

        const referencedGraphs = extractPredicateGraphsFromBasicQuads(result.quads)
        console.log('referencedGraphs', referencedGraphs)
        const state = thunkApi.getState() as RootState
        const graphsByIri = state.ontologies.graphsByIri

        for (let graphIri of referencedGraphs) {
            if (graphIri !== iri && !graphsByIri[iri]) {
                // Not the one that we just fetched, and not already fetched
                console.log('will fetch referenced graph', graphIri)
                thunkApi.dispatch(fetchOntologyGraph(graphIri))
            }
        }

        // TODO: fetch graphs referenced by the current graph
        // TODO: if the response was cached, don't process it again
        // TODO: How do I deal with local modifications that were not yet persisted?

        return result
    }
)

export const ontologiesSlice = createSlice({
    name: 'ontologies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchOntologyGraph.fulfilled, (state, action) => {
            const fetchedGraph = action.payload

            console.log('graph', fetchedGraph)

            state.graphsByIri[fetchedGraph.iri] = fetchedGraph
        })
    },
})

// Action creators are generated for each case reducer function
export const { } = ontologiesSlice.actions

export default ontologiesSlice.reducer