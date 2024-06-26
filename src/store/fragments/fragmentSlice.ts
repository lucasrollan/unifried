import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import IFragment from '@/models/IFragment'
import { RootState } from '..'
import { characterUpdated, grantRewardTokensToCurrentCharacter } from '../actors/actorsSlice'
import { ActionApiResponse, ApiRequestAction } from '@/pages/api/actions'

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

const api_fetchFragments = async function (dateStart: string, dateEndExclusive: string): Promise<IFragment[]> {
    const params = new URLSearchParams({
        start: dateStart,
        end: dateEndExclusive,
    })

    const result = await fetch(`/api/fragments?${params}`)
    return result.json()
}

const api_updateFragment = async function (fragment: IFragment): Promise<IFragment> {
    const result = await fetch(`/api/fragments/${fragment.id}`, {
        method: 'PATCH',
        body: JSON.stringify(fragment)
    })
    return result.json()
}

const api_createFragment = async function (fragment: IFragment): Promise<IFragment> {
    const body = {
        action: {
            type: 'fragmentCreated',
            payload: {
                fragment
            },
        }
    }
    const result = await fetch(`/api/actions`, {
        method: 'POST',
        body: JSON.stringify(body)
    })
    const resultData = await result.json()
    const newFragment = resultData.updatedEntities?.fragments[0] as IFragment

    return newFragment
}


const api_sendAction = async function (action: ApiRequestAction): Promise<ActionApiResponse> {
    const body = {
        action,
    }
    const result = await fetch(`/api/actions`, {
        method: 'POST',
        body: JSON.stringify(body)
    })
    const resultData = await result.json()

    return resultData
}

export const sendAction = createAsyncThunk(
    'comms/sendAction',
    async (action: ApiRequestAction, thunkApi) => {
        const response = await api_sendAction(action)

        if (response.updatedEntities) {
            if (response.updatedEntities.fragments) {
                response.updatedEntities.fragments.forEach(fragment => {
                    thunkApi.dispatch(fragmentSlice.actions.fragmentUpdated(fragment))
                })
            }
            if (response.updatedEntities.characters) {
                response.updatedEntities.characters.forEach(character => {
                    thunkApi.dispatch(characterUpdated(character))
                })
            }
        }

        return response
    }
)

export const fetchFragments = createAsyncThunk(
    'fragments/fetch',
    async (arg: {start: string, end: string}) => {
        const result = await api_fetchFragments(arg.start, arg.end)
        return result
    }
)

export const initialSummaryFragmentsRequested = createAsyncThunk(
    'fragments/initialSummaryRequested',
    async (arg: void, thunkApi) => {
        const state = thunkApi.getState() as RootState

        const date = state.fragments.fragmentSummaryDateSelected
        const start = moment(date).subtract(3, 'day').format('YYYY-MM-DD')
        const end = moment(date).add(4, 'day').format('YYYY-MM-DD')

        await thunkApi.dispatch(fetchFragments({ start, end }))
    }
)

export const completeFragment = createAsyncThunk(
    'fragment/completed',
    async (fragmentId: string, thunkApi) => {
        const action: ApiRequestAction = {
            type: "fragmentMarkedAsCompleted",
            payload: {
                fragmentId,
            },
        }
        await thunkApi.dispatch(sendAction(action))

        // const state = thunkApi.getState() as RootState
        // const fragment = state.fragments.fragmentsById[fragmentId]

        // if (fragment.role === 'challenge') {
        //     // TODO: Move all of this logic to the API
        // } else {
        //     const fragmentToUpdate = {
        //         ...fragment,
        //         isCompleted: true,
        //         completionDate: moment().format('YYYY-MM-DD'),
        //         status: 'completed',
        //     }

        //     await thunkApi.dispatch(updateFragment(fragmentToUpdate))
        // }

        // if (fragment.reward) {
        //     await thunkApi.dispatch(grantRewardTokensToCurrentCharacter(fragment.reward))
        // }
    }
)

export const updateFragment = createAsyncThunk(
    'fragment/update',
    async (fragment: IFragment, thunkApi) => {
        const action: ApiRequestAction = {
            type: "fragmentUpdated",
            payload: {
                fragment,
            },
        }
        await thunkApi.dispatch(sendAction(action))

        // thunkApi.dispatch(fragmentSlice.actions.fragmentUpdated(fragment))

        // const updatedFragment = await api_updateFragment(fragment)
        // thunkApi.dispatch(fragmentSlice.actions.fragmentUpdated(updatedFragment))

        // return updatedFragment
    }
)

export const createFragment = createAsyncThunk(
    'fragment/created',
    async (fragment: IFragment, thunkApi) => {
        // thunkApi.dispatch(timelineSlice.actions.fragmentUpdated(fragment))

        const newFragment = await api_createFragment(fragment)
        thunkApi.dispatch(fragmentSlice.actions.fragmentUpdated(newFragment))

        return newFragment
    }
)

export const changedSummaryDate = createAsyncThunk(
    'fragments/changedSummaryDate',
    async (date: string, thunkApi) => {
        const state = thunkApi.getState() as RootState

        const previousDate = state.fragments.fragmentSummaryDateSelected
        const diff = moment(previousDate).diff(date, 'day')

        let start
        let end
        if (diff === 1) {
            start = moment(date).subtract(3, 'day').format('YYYY-MM-DD')
            end = moment(start).add(1, 'day').format('YYYY-MM-DD')
        } else if (diff === -1) {
            start = moment(date).add(3, 'day').format('YYYY-MM-DD')
            end = moment(start).add(1, 'day').format('YYYY-MM-DD')
        } else {
            start = moment(date).subtract(3, 'day').format('YYYY-MM-DD')
            end = moment(date).add(4, 'day').format('YYYY-MM-DD')
        }

        thunkApi.dispatch(newSummaryDateSelected(date))
        await thunkApi.dispatch(fetchFragments({ start, end }))
    }
)

export const fragmentSlice = createSlice({
    name: 'fragments',
    initialState,
    reducers: {
        newSummaryDateSelected: (state, action) => {
            state.fragmentSummaryDateSelected = action.payload
        },
        fragmentUpdated: (state, action) => {
            const updatedFragment: IFragment = action.payload

            state.fragmentsById[updatedFragment.id] = updatedFragment
            if (!state.fragmentIds.includes(updatedFragment.id)) {
                state.fragmentIds.push(updatedFragment.id)
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFragments.fulfilled, (state, action) => {
            const fragments = action.payload

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
export const { newSummaryDateSelected, fragmentUpdated } = fragmentSlice.actions

export default fragmentSlice.reducer