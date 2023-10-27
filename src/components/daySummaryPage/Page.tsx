
import FragmentsSummary from '../fragmentsSummary/FragmentsSummary'
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchFragments } from "@/store/fragments/fragmentSlice"
import { selectAllFragments, selectFragmentsRelevantForDate } from "@/store/fragments/selectors"
import { useEffect } from "react"
import style from './style.module.css'

function DaySummaryPage() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchFragments())
    }, [dispatch])

    const dateString = (new Date()).toISOString()
    const fragments = useAppSelector(state => selectFragmentsRelevantForDate(state, dateString))

    return <div className={style.page}>
        <div className={style.pageMain}>
            <FragmentsSummary fragments={fragments} />
        </div>
    </div>
}

export default DaySummaryPage