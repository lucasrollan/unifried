
import FragmentsSummary from '../fragmentsSummary/FragmentsSummary'
import { useAppDispatch, useAppSelector } from "@/store"
import { changedSummaryDate, createFragment, initialSummaryFragmentsRequested } from "@/store/fragments/fragmentSlice"
import { selectFragmentsRelevantForDate, selectSummaryDateSelected, selectSummaryDateSelectedDescription } from "@/store/fragments/selectors"
import { useEffect } from "react"
import style from './style.module.css'
import moment from 'moment'
import { fetchCharacters, fetchDailyRewardTokens } from '@/store/actors/actorsSlice'
import { selectCurrentCharacter, selectSelectedDateTokens } from '@/store/actors/selectors'
import CharacterSummary from '../characterSummaryBanner'
import { Button } from '@blueprintjs/core'
import IFragment from '@/models/IFragment'

function DaySummaryPage() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(initialSummaryFragmentsRequested())
        dispatch(fetchDailyRewardTokens())
    }, [dispatch])

    const selectedDate = useAppSelector(selectSummaryDateSelected)
    const selectedDateDescription = useAppSelector(selectSummaryDateSelectedDescription)
    const selectedDateTokens = useAppSelector(selectSelectedDateTokens)
    const fragments = useAppSelector(selectFragmentsRelevantForDate)

    const handleNextDateSelected = () => {
        const newDate = moment(selectedDate).add(1, 'day').format('YYYY-MM-DD')
        dispatch(changedSummaryDate(newDate))
    }
    const handlePrevDateSelected = () => {
        const newDate = moment(selectedDate).subtract(1, 'day').format('YYYY-MM-DD')
        dispatch(changedSummaryDate(newDate))
    }

    const handleNewFragmentClicked = () => {
        const newFragment: IFragment = {
            id: 'TEMP:::TEMP:::TEMP',
            role: 'task',
            title: 'the title',
            createdDate: '',
            isCompleted: false,
            modifiedDate: '',
            startDate: moment().format('YYYY-MM-DD'),
        }
        dispatch(createFragment(newFragment))
    }

    return <div className={style.page}>
        <div className={style.pageMain}>
            <CharacterSummary />
            <FragmentsSummary
                title={selectedDate}
                subTitle={selectedDateDescription}
                tokens={selectedDateTokens}
                fragments={fragments}
                relativeToDate={selectedDate}
                onNextPageSelected={handleNextDateSelected}
                onPrevPageSelected={handlePrevDateSelected}
            />
            <div className={style.bannerContainer}>
                <div className={style.banner}>
                    <Button minimal onClick={handleNewFragmentClicked}>+</Button>
                </div>
            </div>
        </div>
    </div>
}

export default DaySummaryPage