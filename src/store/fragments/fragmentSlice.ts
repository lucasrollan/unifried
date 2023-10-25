import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import Fragment from '@/models/Fragment'

export interface FragmentsState {
    fragmentIds: string[],
    fragmentsById: Record<string, Fragment>,
}

const initialState: FragmentsState = {
    fragmentIds: [],
    fragmentsById: {},
}

const api_fetchFragments = async function (): Promise<Fragment[]> {
    const result = await fetch('/api/fragments')
    return result.json()
}

export const fetchFragments = createAsyncThunk(
    'fragments/fetch',
    async () => await api_fetchFragments()
)

export const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFragments.fulfilled, (state, action) => {
            const fragments = action.payload
            console.log('fragments', fragments)

            fragments.forEach(fragment => {
                const fragmentId = fragment.id
                state.fragmentsById[fragmentId] = fragment

                if (!state.fragmentIds.includes(fragmentId)) {
                    state.fragmentIds.push(fragmentId)
                }
            })
        })
    },
})

// Action creators are generated for each case reducer function
export const {  } = timelineSlice.actions

export default timelineSlice.reducer