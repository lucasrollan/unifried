import IFragment from "@/models/IFragment"
import { Button, Card, ControlGroup, HTMLSelect, Icon, IconName, InputGroup, Label, TextArea } from "@blueprintjs/core"
import style from "./style.module.css"
import { useAppSelector } from "@/store"
import { selectFragmentById } from "@/store/fragments/selectors"
import { getIndicatorIcon, getTimeDescription } from "./details"
import moment from "moment"
import { useState } from "react"

type EditableFragmentSummaryProps = {
    fragment: IFragment,
    relativeToDate: string,
    onCompleted: () => void
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
                        <div className={style.editableForm}>
                            <div>
                                <ControlGroup fill={true} vertical={false}>
                                    <Label>
                                        Criticality
                                        <HTMLSelect>
                                            <option value="" selected={!props.fragment.priority && props.fragment.priority !== 0}>--</option>
                                            <option value="0" selected={props.fragment.priority === 0}>Critical</option>
                                            <option value="1" selected={props.fragment.priority === 1}>Higher</option>
                                            <option value="2" selected={props.fragment.priority === 2}>High</option>
                                            <option value="3" selected={props.fragment.priority === 3}>Mid</option>
                                            <option value="4" selected={props.fragment.priority === 4}>Low</option>
                                            <option value="5" selected={props.fragment.priority === 5}>Lowest</option>
                                        </HTMLSelect>
                                    </Label>
                                    <Label>
                                        Status
                                        <HTMLSelect>
                                            <option value="waiting" selected={props.fragment.priority === 0}>⏳ Waiting</option>
                                            <option value="ongoing" selected={props.fragment.priority === 1}>▶️ Ongoing</option>
                                            <option value="done" selected={props.fragment.priority === 2}>✅ Done</option>
                                            <option value="cancelled" selected={props.fragment.priority === 3}>❌ Cancelled</option>
                                        </HTMLSelect>
                                    </Label>
                                    <Label style={{ width: '20px' }}>
                                        Reward
                                        <InputGroup placeholder="reward" type="number" value={props.fragment.reward?.toString()} />
                                    </Label>
                                </ControlGroup>

                                <Label>
                                    Title
                                    <InputGroup placeholder="title" value={props.fragment.title} />
                                </Label>
                                <Label>
                                    Description
                                    <TextArea placeholder="description" value={props.fragment.content} fill autoResize />
                                </Label>
                                <Label>
                                    Parent
                                    <HTMLSelect>
                                        <option value="ND_IT">Stay in the Netherlands as a EU citizen</option>
                                        <option value="Matsu">Buy a car</option>
                                    </HTMLSelect>
                                </Label>
                                <ControlGroup>
                                    <Label style={{ 'width': '33%' }}>
                                        Start
                                        <InputGroup placeholder="Start" value={props.fragment.content} />
                                    </Label>
                                    <Label style={{ 'width': '33%' }}>
                                        Scheduled
                                        <InputGroup placeholder="Scheduled" value={props.fragment.content} />
                                    </Label>
                                    <Label style={{ 'width': '33%' }}>
                                        Due
                                        <InputGroup placeholder="Due" value={props.fragment.content} />
                                    </Label>
                                </ControlGroup>
                            </div>
                            <div style={{ textAlign: 'right'}}>
                                <Button intent="danger" onClick={() => setIsEditing(false)}>Cancel</Button>
                                {' '}
                                <Button intent="primary">Save</Button>
                            </div>
                        </div>
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