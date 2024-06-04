import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Action, PayloadAction } from '@reduxjs/toolkit'
import moment from 'moment'
import { RootState } from '..'
import ICharacter from '@/models/ICharacter'
import Player from '@/models/Player'
import Party from '@/models/Party'
import { UpdatedRewardTokensResponse } from '@/pages/api/characters/[characterId]/rewardTokens'
import RewardTokensDayEntry from '@/models/RewardTokensDayEntry'
import { groupBy } from 'lodash'

export interface ActorsState {
    rewardTokensByDate: Record<string, RewardTokensDayEntry>,
    currentCharacterId: string,
    characterIds: string[],
    charactersById: Record<string, ICharacter>,
    // partyIds: string[],
    // partiesById: Record<string, Party>,
    // playerIds: string[],
    // playersById: Record<string, Player>,
}

const initialState: ActorsState = {
    rewardTokensByDate: {},
    currentCharacterId: 'recQjKKFnjDC4KJUo',
    characterIds: [],
    charactersById: {},
    // partyIds: [],
    // partiesById: {},
    // playerIds: [],
    // playersById: {},
}

const api_addRewardTokens = async function (characterId: string, amount: number, date: string): Promise<UpdatedRewardTokensResponse> {
    const result = await fetch(`/api/characters/${characterId}/rewardTokens`, {
        method: 'POST',
        body: JSON.stringify({
            amount,
            date,
        })
    })
    return result.json()
}

const api_fetchRewardTokens = async function (characterId: string): Promise<UpdatedRewardTokensResponse> {
    const result = await fetch(`/api/characters/${characterId}/rewardTokens`)
    return result.json()
}

const api_fetchCharacters = async function (): Promise<ICharacter[]> {
    const result = await fetch('/api/characters')
    return result.json()
}

export const grantRewardTokensToCurrentCharacter = createAsyncThunk(
    'characters/current/grantRewardTokens',
    async (amount: number, thunkApi) => {
        const state = thunkApi.getState() as RootState
        const currentCharacterId = state.actors.currentCharacterId
        const currentCharacter = state.actors.charactersById[currentCharacterId]

        const optimisticallyUpdatedCharacter: ICharacter = {
            ...currentCharacter,
            tokens: currentCharacter.tokens + amount,
        }

        thunkApi.dispatch(characterUpdated(optimisticallyUpdatedCharacter))

        const today = moment().format('YYYY-MM-DD')
        const updates = await api_addRewardTokens(currentCharacterId, amount, today)

        thunkApi.dispatch(characterUpdated(updates.character!))
        thunkApi.dispatch(dailyRewardTokensUpdated(updates.rewardTokens))
    }
)

export const fetchCharacters = createAsyncThunk(
    'characters/fetch',
    async () => await api_fetchCharacters()
)

export const fetchDailyRewardTokens = createAsyncThunk(
    'characters/current/rewardTokens/fetch',
    async (arg: void, thunkApi) => {
        const state = thunkApi.getState() as RootState
        const currentCharacterId = state.actors.currentCharacterId

        const dailyTokens = await api_fetchRewardTokens(currentCharacterId)
        thunkApi.dispatch(dailyRewardTokensUpdated(dailyTokens.rewardTokens))
    }
)

export const actorsSlice = createSlice({
    name: 'actors',
    initialState,
    reducers: {
        characterUpdated: (state, action: PayloadAction<ICharacter>) => {
            const updatedCharacter = action.payload

            state.charactersById[updatedCharacter.id] = updatedCharacter
        },
        dailyRewardTokensUpdated: (state, action: PayloadAction<RewardTokensDayEntry[]>) => {
            const dailyTokens = action.payload
            const dailyTokensByDate: Record<string, RewardTokensDayEntry> =
                dailyTokens.reduce((acc, current) => ({
                    ...acc,
                    [current.date]: current,
                }), {})

            state.rewardTokensByDate = {
                ...state.rewardTokensByDate,
                ...dailyTokensByDate,
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCharacters.fulfilled, (state, action) => {
            const characters = action.payload

            characters.forEach(character => {
                const characterId = character.id
                state.charactersById[characterId] = character

                if (!state.characterIds.includes(characterId)) {
                    state.characterIds.push(characterId)
                }
            })
        })
    },
})

// Action creators are generated for each case reducer function
export const { characterUpdated, dailyRewardTokensUpdated } = actorsSlice.actions

export default actorsSlice.reducer