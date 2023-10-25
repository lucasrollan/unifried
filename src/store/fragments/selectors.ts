import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectAllFragments = createSelector(
    (state: RootState) => state.fragments,
    fragmentState =>
        fragmentState.fragmentIds.map(id => fragmentState.fragmentsById[id])
)

export const selectFragmentById =
    (state: RootState, id: string) =>
        state.fragments.fragmentsById[id]