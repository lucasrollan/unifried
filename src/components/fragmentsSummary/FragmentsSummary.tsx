import Fragment from "@/models/Fragment"
import FragmentSummary from "../fragmentSummary/FragmentSummary"
import style from './style.module.css'
import { AnchorButton } from "@blueprintjs/core"
import { useAppDispatch } from "@/store"
import { completeFragment } from "@/store/fragments/fragmentSlice"

type FragmentsSummaryProps = {
    title: string,
    subTitle?: string,
    fragments: Fragment[],
    relativeToDate: string,
    onPrevPageSelected: () => void,
    onNextPageSelected: () => void,
}

function FragmentsSummary (props: FragmentsSummaryProps) {
    const dispatch = useAppDispatch()
    const handleFragmentCompleted = (fragmentId: string) => {
        console.log('FRAGMENT WILL BE COMPLETED')
        dispatch(completeFragment(fragmentId))
    }

    return <div>
        <div className={style.header}>
            <AnchorButton icon='chevron-left' minimal onClick={props.onPrevPageSelected} />
            <div className={style.titleContainer}>
                <h3>{props.title}</h3>
                <div className={style.subtitle}>{props.subTitle}</div>
            </div>
            <AnchorButton icon='chevron-right' minimal onClick={props.onNextPageSelected} />
        </div>
        <div className={style.list}>
            {
                props.fragments.map(fragment =>
                    <div className={style.item} key={fragment.id}>
                        <FragmentSummary
                            fragment={fragment}
                            relativeToDate={props.relativeToDate}
                            onCompleted={() => handleFragmentCompleted(fragment.id)}
                        />
                    </div>
                )
            }
        </div>
    </div>
}

export default FragmentsSummary