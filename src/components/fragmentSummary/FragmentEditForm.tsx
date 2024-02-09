import IFragment from "@/models/IFragment"
import { Button, ControlGroup, HTMLSelect, InputGroup, Label, TextArea } from "@blueprintjs/core"
import style from "./style.module.css"
import { useState } from "react"

type FragmentEditFormProps = {
    fragmentData: IFragment,
    onUpdated: (fragmentData: IFragment) => void,
    onCancel: () => void,
}

function FragmentEditForm(props: FragmentEditFormProps) {
    const [fragmentData, setFragmentData] = useState<IFragment>({...props.fragmentData})

    const patchFragment = (patch: Partial<IFragment>) => {
        setFragmentData({
            ...fragmentData,
            ...patch,
        })
    }

    const handleCancel = () => {
        setFragmentData(props.fragmentData)
        props.onCancel()
    }

    return <div className={style.editableForm}>
        <div>
            <ControlGroup fill={true} vertical={false}>
                <Label>
                    Criticality
                    <HTMLSelect
                        value={fragmentData.priority}
                        onChange={event => {patchFragment({ priority: parseInt(event.currentTarget.value) })}}
                    >
                        <option value="">--</option>
                        <option value="0">Critical</option>
                        <option value="1">Higher</option>
                        <option value="2">High</option>
                        <option value="3">Mid</option>
                        <option value="4">Low</option>
                        <option value="5">Lowest</option>
                    </HTMLSelect>
                </Label>
                <Label>
                    Status
                    <HTMLSelect
                        value={fragmentData.status}
                        onChange={event => {patchFragment({ status: event.currentTarget.value })}}
                    >
                        <option value="waiting">⏳ Waiting</option>
                        <option value="ongoing">▶️ Ongoing</option>
                        <option value="completed">✅ Done</option>
                        <option value="cancelled">❌ Cancelled</option>
                    </HTMLSelect>
                </Label>
                <Label style={{ width: '20px' }}>
                    Reward
                    <InputGroup
                        placeholder="reward"
                        type="number"
                        value={fragmentData.reward?.toString()}
                        onChange={event => {patchFragment({ reward: parseInt(event.currentTarget.value) })}}
                    />
                </Label>
            </ControlGroup>

            <Label>
                Title
                <InputGroup
                    placeholder="title"
                    value={fragmentData.title}
                    onChange={event => {patchFragment({ title: event.currentTarget.value })}}
                />
            </Label>
            <Label>
                Description
                <TextArea
                    placeholder="description"
                    value={fragmentData.content}
                    fill
                    autoResize
                    onChange={event => {patchFragment({ content: event.currentTarget.value })}}
                />
            </Label>
            <Label>
                Parent
                <HTMLSelect>
                    <option value="">--</option>
                    <option value="ND_IT">Stay in the Netherlands as a EU citizen</option>
                    <option value="Matsu">Buy a car</option>
                </HTMLSelect>
            </Label>
            <ControlGroup>
                <Label style={{ 'width': '33%' }}>
                    Start
                    <InputGroup
                        placeholder="Start"
                        type="date"
                        value={fragmentData.earliestStartDate || fragmentData.earliestStart}
                        onChange={event => {patchFragment({ earliestStartDate: event.currentTarget.value })}}
                    />
                </Label>
                <Label style={{ 'width': '33%' }}>
                    Scheduled
                    <InputGroup
                        placeholder="Scheduled"
                        type="date"
                        value={fragmentData.startDate || fragmentData.start}
                        onChange={event => {patchFragment({ startDate: event.currentTarget.value })}}
                    />
                </Label>
                <Label style={{ 'width': '33%' }}>
                    Due
                    <InputGroup
                        placeholder="Due"
                        type="date"
                        value={fragmentData.endDate || fragmentData.end}
                        onChange={event => {patchFragment({ endDate: event.currentTarget.value })}}
                    />
                </Label>
            </ControlGroup>
        </div>
        <div style={{ textAlign: 'right'}}>
            <Button intent="danger" onClick={handleCancel}>Cancel</Button>
            {' '}
            <Button onClick={() => props.onUpdated(fragmentData)} intent="primary">Save</Button>
        </div>
    </div>
}

export default FragmentEditForm