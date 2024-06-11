import { Tag } from "@blueprintjs/core"

interface PersonTypeChipProps {
}

function PersonTypeChip (props: PersonTypeChipProps) {
    const handleClick = () => {
        window.location.href = '/sour/pimp'
    }

    return (<Tag
        icon="person"
        onClick={handleClick}
        interactive
        round
    >Person</Tag>)
}

export default PersonTypeChip