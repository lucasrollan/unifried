import IFragment from "@/models/IFragment"
import style from './style.module.css'
import { AnchorButton } from "@blueprintjs/core"
import { useAppDispatch } from "@/store"
import { completeFragment, updateFragment } from "@/store/fragments/fragmentSlice"
import EditableFragmentSummary from "../fragmentSummary/EditableFragmentSummary"

type FragmentsSummaryProps = {
    title: string,
    subTitle?: string,
    tokens?: number,
    fragments: IFragment[],
    relativeToDate: string,
    onPrevPageSelected: () => void,
    onNextPageSelected: () => void,
}

function FragmentsSummary (props: FragmentsSummaryProps) {
    const dispatch = useAppDispatch()
    const handleFragmentCompleted = (fragmentId: string) => {
        dispatch(completeFragment(fragmentId))
    }

    const handleFragmentUpdated = (fragmentData: IFragment) => {
        dispatch(updateFragment(fragmentData))
    }

    return <div>
        <div className={style.header}>
            <AnchorButton icon='chevron-left' minimal onClick={props.onPrevPageSelected} />
            <div className={style.titleContainer}>
                <h3>{props.title}</h3>
                <div className={style.subtitle}>{props.subTitle}</div>
                {
                    props.tokens
                        ? <div className={style.subtitle}>Tokens: {props.tokens}</div>
                        : ''
                }
            </div>
            <AnchorButton icon='chevron-right' minimal onClick={props.onNextPageSelected} />
        </div>
        <div className={style.list}>
            {
                props.fragments.map(fragment =>
                    <div className={style.item} key={fragment.id}>
                        <EditableFragmentSummary
                            fragment={fragment}
                            relativeToDate={props.relativeToDate}
                            onCompleted={() => handleFragmentCompleted(fragment.id)}
                            onUpdated={handleFragmentUpdated}
                        />
                    </div>
                )
            }
        </div>
    </div>
}

export default FragmentsSummary