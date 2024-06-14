import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Parser, Quad, NamedNode } from "n3"
import { BasicQuad, extractGraphFromIri, projectQuadToBasicQuad } from './BasicQuad'
import { Dictionary } from "@reduxjs/toolkit"
import { mapValues } from 'lodash'
import { RootState } from '..'

export interface OntologiesState {
    graphsByIri: Dictionary<Graph>,
    graphStatusByIri: Dictionary<GraphStatus>,
}

export type Graph = {
    iri: string,
    prefixes: Dictionary<string>,
    quads: Array<BasicQuad>,
}

export type GraphStatus = {
    iri: string,
    fetching?: boolean,
    fetchedSucceeded?: boolean,
}

const initialState: OntologiesState = {
    graphsByIri: {},
    graphStatusByIri: {},
}

async function parseOntologyGraph(doc: string, iri: string): Promise<Graph> {
    const parser = new Parser();
    const graphIriString = extractGraphFromIri(iri)
    const graph: Graph = {
        iri: graphIriString,
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
                    const graphIri = new NamedNode(graphIriString)
                    const quadWithGraph = new Quad(quad.subject, quad.predicate, quad.object, graphIri)
                    graph.quads.push(projectQuadToBasicQuad(quadWithGraph))
                } else {
                    graph.prefixes = mapValues(prefixes, v => v.value)

                    console.log('document', doc, 'graph', graph)
                    resolve(graph)
                }
            });
    })

    return promise
}

const api_fetchOntologyGraph = async function (iri: string): Promise<Graph> {
    let content = ''
    let requestUrl: URL

    let normalizedIri = iri.replace(/#.*$/, '')

    if (normalizedIri.startsWith('http://rollan.info')) {
        requestUrl = new URL(normalizedIri.replace('http://rollan.info', ''), window.location.href)
    } else {
        const encodedIri = encodeURI(normalizedIri)
        requestUrl = new URL('/api/resource', window.location.href)
        requestUrl.searchParams.set('iri', encodedIri)
    }

    const result = await fetch(requestUrl)
    content = await result.text()

    const graph = await parseOntologyGraph(content, normalizedIri)
    return graph
}

export const fetchOntologyGraph = createAsyncThunk(
    'ontologies/fetch',
    async (iri: string, thunkApi) => {
        const normalizedIri = iri.replace(/#.*$/, '')
        console.log('fetching graph', normalizedIri)

        const state = thunkApi.getState() as RootState
        const graph = state.ontologies.graphsByIri[normalizedIri]
        const graphStatus = state.ontologies.graphStatusByIri[normalizedIri]

        if (graph || graphStatus?.fetching) {
            console.log('No need to fetch', normalizedIri)
            return
        }

        thunkApi.dispatch(fetchOntologyGraphStarted(normalizedIri))

        try {
            const result = await api_fetchOntologyGraph(normalizedIri)

            return result
        } catch(e) {
            console.error(e)
            thunkApi.dispatch(fetchOntologyGraphFailed(normalizedIri))
        }
    }
)

export const ontologiesSlice = createSlice({
    name: 'ontologies',
    initialState,
    reducers: {
        fetchOntologyGraphStarted: (state, action) => {
            state.graphStatusByIri[action.payload] = {
                iri: action.payload,
                fetching: true,
                fetchedSucceeded: undefined,
            }
        },
        fetchOntologyGraphFailed: (state, action) => {
            const graphStatus = state.graphStatusByIri[action.payload]
            if (graphStatus) {
                graphStatus.fetching = false
                graphStatus.fetchedSucceeded = false
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOntologyGraph.fulfilled, (state, action) => {
            const fetchedGraph = action.payload
            console.log('------------ FETCHED GRAPH', fetchedGraph)

            if (fetchedGraph) {
                state.graphsByIri[fetchedGraph.iri] = {
                    ...fetchedGraph,
                }
                state.graphStatusByIri[fetchedGraph.iri] = {
                    iri: fetchedGraph.iri,
                    fetching: false,
                    fetchedSucceeded: true,
                }
            }
        })
    },
})

// Action creators are generated for each case reducer function
export const { fetchOntologyGraphStarted, fetchOntologyGraphFailed } = ontologiesSlice.actions

export default ontologiesSlice.reducer