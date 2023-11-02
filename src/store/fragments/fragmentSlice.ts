import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import IFragment from '@/models/IFragment'
import { RootState } from '..'
import { grantRewardTokensToCurrentCharacter } from '../actors/actorsSlice'

export interface FragmentsState {
    fragmentSummaryDateSelected: string,
    fragmentIds: string[],
    fragmentsById: Record<string, IFragment>,
}

const initialState: FragmentsState = {
    fragmentSummaryDateSelected: moment().format('YYYY-MM-DD'),
    fragmentIds: [],
    fragmentsById: {},
}

const api_fetchFragments = async function (): Promise<IFragment[]> {
    const result = await fetch('/api/fragments')
    return result.json()
}

const api_updateFragment = async function (fragment: IFragment): Promise<IFragment> {
    const result = await fetch(`/api/fragments/${fragment.id}`, {
        method: 'PATCH',
        body: JSON.stringify(fragment)
    })
    return result.json()
}

export const fetchFragments = createAsyncThunk(
    'fragments/fetch',
    async () => await api_fetchFragments()
)

export const completeFragment = createAsyncThunk(
    'fragment/complete',
    async (fragmentId: string, thunkApi) => {
        const state = thunkApi.getState() as RootState
        const fragment = state.fragments.fragmentsById[fragmentId]

        const fragmentToUpdate = {
            ...fragment,
            isCompleted: true,
            completionDate: moment().format('YYYY-MM-DD'),
            status: 'complete',
        }

        await thunkApi.dispatch(updateFragment(fragmentToUpdate))
        if (fragment.reward) {
            await thunkApi.dispatch(grantRewardTokensToCurrentCharacter(fragment.reward))
        }
    }
)

export const updateFragment = createAsyncThunk(
    'fragment/update',
    async (fragment: IFragment, thunkApi) => {
        thunkApi.dispatch(timelineSlice.actions.fragmentUpdated(fragment))

        const updatedFragment = await api_updateFragment(fragment)
        thunkApi.dispatch(timelineSlice.actions.fragmentUpdated(updatedFragment))

        return updatedFragment
    }
)

export const timelineSlice = createSlice({
    name: 'timeline',
    initialState,
    reducers: {
        newSummaryDateSelected: (state, action) => {
            state.fragmentSummaryDateSelected = action.payload
        },
        fragmentUpdated: (state, action) => {
            console.log('action fragmentUpdated', fragmentUpdated)
            const updatedFragment: IFragment = action.payload

            state.fragmentsById[updatedFragment.id] = updatedFragment

        },
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
export const { newSummaryDateSelected, fragmentUpdated } = timelineSlice.actions

export default timelineSlice.reducer