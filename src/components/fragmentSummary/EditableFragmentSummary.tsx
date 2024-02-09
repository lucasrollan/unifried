import IFragment from "@/models/IFragment"
import { Button, Card, ControlGroup, HTMLSelect, Icon, IconName, InputGroup, Label, TextArea } from "@blueprintjs/core"
import style from "./style.module.css"
import { useAppSelector } from "@/store"
import { selectFragmentById } from "@/store/fragments/selectors"
import { getIndicatorIcon, getTimeDescription } from "./details"
import moment from "moment"
import { useState } from "react"
import FragmentEditForm from "./FragmentEditForm"

type EditableFragmentSummaryProps = {
    fragment: IFragment,
    relativeToDate: string,
    onCompleted: () => void
    onUpdated: (fragmentData: IFragment) => void
}

function EditableFragmentSummary(props: EditableFragmentSummaryProps) {
    const parent = useAppSelector(state =>
        props.fragment.parentId && selectFragmentById(state, props.fragment.parentId))
    const wasCompletedToday = props.fragment.isCompleted && props.fragment.completionDate
        ? moment(props.fragment.completionDate).isSame(props.relativeToDate, 'day')
        : false

    const [isEditing, setIsEditing] = useState(false)

    const timeParts = getTimeDescription(props.fragment)

    const isCompleted = props.fragment.isCompleted

    return <Card className={isCompleted ? style.completed : ''}>
        <div className={style.summary}>
            <div className={style.header}>

                <div className={style.indicator}>
                    <Icon icon={getIndicatorIcon(props.fragment)} size={14} />
                </div>
                <div className={style.title}>
                    <h4 onClick={() => {if (!isEditing) setIsEditing(true)}}>{props.fragment.title}</h4>
                </div>
                <div className={style.status}>
                    {
                        props.fragment.isCompleted
                            ? <div style={{ color: 'green' }}>
                                {
                                    wasCompletedToday
                                        ? <Icon icon="tick-circle" />
                                        : <Icon icon="double-chevron-right" />
                                }
                            </div>
                            : <div className={style.reward} onClick={props.onCompleted}>
                                {
                                    props.fragment.reward !== undefined &&
                                    <>
                                        <span className={style.rewardAmount}>{props.fragment.reward}</span>
                                        {' '}
                                        <img className={style.rewardIcon} src="/icons/65516_cash_currency_icon.png" />
                                    </>
                                }
                            </div>
                    }
                </div>
            </div>
            {
                isEditing
                    ? (
                        <FragmentEditForm
                            fragmentData={props.fragment}
                            onCancel={() => setIsEditing(false)}
                            onUpdated={props.onUpdated}
                        />
                    ) : (
                        <div className={style.mainBody}>
                            {
                                (props.fragment.content || props.fragment.location || parent || timeParts.length) &&
                                <div className={style.details}>
                                    {props.fragment.content
                                        && <div>{props.fragment.content}</div>}
                                    {timeParts.length > 0
                                        && timeParts.map(part =>
                                            <div key={part}><Icon icon="time" /> {part}</div>
                                        )}
                                    {props.fragment.location
                                        && <div><Icon icon="map-marker" /> {props.fragment.location}</div>}
                                    {parent
                                        && <div><Icon icon="symbol-triangle-up" /> {parent.title}</div>}
                                </div>
                            }
                        </div>
                    )
            }



        </div>
    </Card>
}

export default EditableFragmentSummary