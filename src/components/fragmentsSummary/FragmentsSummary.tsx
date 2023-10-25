import Fragment from "@/models/Fragment"
import FragmentSummary from "../fragmentSummary/FragmentSummary"
import style from './style.module.css'

type FragmentsSummaryProps = {
    fragments: Fragment[],
}

function FragmentsSummary (props: FragmentsSummaryProps) {

    return <div>
        <h1>day summary</h1>
        <div className={style.list}>
            {
                props.fragments.map(fragment =>
                    <div className={style.item} key={fragment.id}>
                        <FragmentSummary fragment={fragment} />
                    </div>
                )
            }
        </div>
    </div>
}

export default FragmentsSummary