import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectCurrentCharacter = (state: RootState) =>
    state.actors.charactersById[state.actors.currentCharacterId]

export const selectSelectedDateTokens = (state: RootState) =>
    state.actors.rewardTokensByDate[state.fragments.fragmentSummaryDateSelected]?.amount