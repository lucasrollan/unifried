import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Parser, Quad, NamedNode } from "n3"
import { BasicQuad, extractGraphFromIri, projectQuadToBasicQuad } from './BasicQuad'
import { Dictionary } from "@reduxjs/toolkit"
import { mapValues } from 'lodash'


export interface OntologiesState {
    graphsByIri: Dictionary<Graph | null>, // null means it is being fetched
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

                    console.log('document', doc, 'graph', graph)
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
        console.warn('SKIPPED EXTERNAL DOC', iri)
    }

    const graph = await parseOntologyGraph(content, iri)
    return graph
}

export const fetchOntologyGraph = createAsyncThunk(
    'ontologies/fetch',
    async (iri: string, thunkApi) => {
        const normalizedIri = iri.replace(/#.*$/, '')
        thunkApi.dispatch(fetchOntologyGraphStarted(iri))

        try {
            const result = await api_fetchOntologyGraph(normalizedIri)

            return result
        } catch(e) {
            thunkApi.dispatch(fetchOntologyGraphFailed(iri))
        }
    }
)

export const ontologiesSlice = createSlice({
    name: 'ontologies',
    initialState,
    reducers: {
        fetchOntologyGraphStarted: (state, action) => {
            state.graphsByIri[action.payload] = null
        },
        fetchOntologyGraphFailed: (state, action) => {
            state.graphsByIri[action.payload] = undefined
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOntologyGraph.fulfilled, (state, action) => {
            const fetchedGraph = action.payload

            if (fetchedGraph) {
                state.graphsByIri[fetchedGraph.iri] = fetchedGraph
            }
        })
    },
})

// Action creators are generated for each case reducer function
export const { fetchOntologyGraphStarted, fetchOntologyGraphFailed } = ontologiesSlice.actions

export default ontologiesSlice.reducer