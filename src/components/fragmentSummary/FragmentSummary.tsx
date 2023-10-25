import Fragment from "@/models/Fragment"
import { Card, Icon, IconName } from "@blueprintjs/core"
import style from "./style.module.css"
import { useAppSelector } from "@/store"
import { selectFragmentById } from "@/store/fragments/selectors"

type FragmentSummaryProps = {
    fragment: Fragment,
}

function FragmentSummary (props: FragmentSummaryProps) {
    const parent = useAppSelector(state =>
        props.fragment.parentId && selectFragmentById(state, props.fragment.parentId))

    return <Card>
        <div className={style.layout}>
            <div className={style.indicator}>
                <Icon icon={getIndicatorIcon(props.fragment)} size={14} />
            </div>
            <div className={style.mainBody}>
                <h3>{props.fragment.title}</h3>
                { props.fragment.content
                    && <div>{props.fragment.content}</div>}
                { props.fragment.location
                    && <div><Icon icon="map-marker" />{props.fragment.location}</div>}
                { parent
                    && <div><Icon icon="symbol-triangle-up" />{parent.title}</div>}
            </div>
            {
                props.fragment.reward &&
                <div className={style.reward}>
                    <span  className={style.rewardAmount}>{props.fragment.reward}</span>
                    {' '}
                    <img  className={style.rewardIcon} src="/icons/65516_cash_currency_icon.png" />
                </div>
            }

        </div>
    </Card>
}

const priorityIndicatorIcons: Record<number, IconName> = {
    0: 'high-priority',
    1: 'double-chevron-up',
    2: 'chevron-up',
    3: 'minus',
    4: 'chevron-down',
    5: 'double-chevron-down',
}
function getIndicatorIcon(fragment: Fragment): IconName | undefined {
    if (fragment.role === 'event') {
        return 'calendar'
    }
    if (fragment.priority !== undefined) {
        return priorityIndicatorIcons[fragment.priority]
    }
}

export default FragmentSummary