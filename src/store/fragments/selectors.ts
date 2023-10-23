import { RootState } from "@/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectAllFragments = createSelector(
    (state: RootState) => state.fragments,
    fragmentState =>
        fragmentState.fragmentIds.map(id => fragmentState.fragmentsById[id])
)
