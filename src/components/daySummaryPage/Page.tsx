
import FragmentsSummary from '../fragmentsSummary/FragmentsSummary'
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchFragments, newSummaryDateSelected } from "@/store/fragments/fragmentSlice"
import { selectFragmentsRelevantForDate, selectSummaryDateSelected } from "@/store/fragments/selectors"
import { useEffect } from "react"
import style from './style.module.css'
import moment from 'moment'

function DaySummaryPage() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchFragments())
    }, [dispatch])

    const selectedDate = useAppSelector(selectSummaryDateSelected)
    const fragments = useAppSelector(selectFragmentsRelevantForDate)

    const handleNextDateSelected = () => {
        const newDate = moment(selectedDate).add(1, 'day').format('YYYY-MM-DD')
        dispatch(newSummaryDateSelected(newDate))
    }
    const handlePrevDateSelected = () => {
        const newDate = moment(selectedDate).subtract(1, 'day').format('YYYY-MM-DD')
        dispatch(newSummaryDateSelected(newDate))
    }

    return <div className={style.page}>
        <div className={style.pageMain}>
            <FragmentsSummary
                title={selectedDate}
                fragments={fragments}
                relativeToDate={selectedDate}
                onNextPageSelected={handleNextDateSelected}
                onPrevPageSelected={handlePrevDateSelected}
            />
        </div>
    </div>
}

export default DaySummaryPage