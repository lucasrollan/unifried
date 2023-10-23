import { useAppDispatch, useAppSelector } from "@/store"
import { fetchFragments } from "@/store/fragments/fragmentSlice"
import { selectAllFragments } from "@/store/fragments/selectors"
import { useEffect } from "react"


function DaySummary () {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchFragments())
    }, [dispatch])

    const fragments = useAppSelector(selectAllFragments)

    return <div>
        <h1>day summary</h1>
        <div>
            {
                fragments.map(fragment => <div key={fragment.id}>
                    {fragment.title}
                </div>)
            }
        </div>
    </div>
}

export default DaySummary