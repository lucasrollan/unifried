
import FragmentsSummary from '../fragmentsSummary/FragmentsSummary'
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchFragments, newSummaryDateSelected } from "@/store/fragments/fragmentSlice"
import { selectFragmentsRelevantForDate, selectSummaryDateSelected, selectSummaryDateSelectedDescription } from "@/store/fragments/selectors"
import { useEffect } from "react"
import style from './style.module.css'
import moment from 'moment'
import { fetchCharacters, fetchDailyRewardTokens } from '@/store/actors/actorsSlice'
import { selectCurrentCharacter, selectSelectedDateTokens } from '@/store/actors/selectors'

function DaySummaryPage() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchFragments())
        dispatch(fetchCharacters())
        dispatch(fetchDailyRewardTokens())
    }, [dispatch])

    const currentCharacter = useAppSelector(selectCurrentCharacter)

    const selectedDate = useAppSelector(selectSummaryDateSelected)
    const selectedDateDescription = useAppSelector(selectSummaryDateSelectedDescription)
    const selectedDateTokens = useAppSelector(selectSelectedDateTokens)
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
            <div>
                tokens: {currentCharacter?.tokens}
            </div>
            <FragmentsSummary
                title={selectedDate}
                subTitle={selectedDateDescription}
                tokens={selectedDateTokens}
                fragments={fragments}
                relativeToDate={selectedDate}
                onNextPageSelected={handleNextDateSelected}
                onPrevPageSelected={handlePrevDateSelected}
            />
        </div>
    </div>
}

export default DaySummaryPage