import style from './style.module.css'

type ToolCardProps = {
    name: string,
    illustrationUrl: string,
    illustrationDescription: string,
    type: string,
    setLogoUrl: string,
    setName: string,
    setId: string,
    abilities: string[],
    flavour: string,
}

function ToolCard(props: ToolCardProps) {
    const setClassName = `set-${props.setId}`

    return <div className={[style.card, setClassName].join(' ')}>
        <div className={style.name}>{props.name}</div>
        <div className={style.illustration} style={{
            backgroundImage: `url("${props.illustrationUrl}")`
        }}></div>
        <div className={style.categories}>
            <span className={style.type}>{props.type}</span>
            <span className={style.set}>
                <img className={style.setIcon} src={props.setLogoUrl} alt={props.setName} title={props.setName} />
            </span>
        </div>
        <div className={style.abilities}>
            {
                props.abilities.map(ability => <div className={style.ability}>
                    {ability}
                </div>)
            }
            <div className={style.flavour}>{props.flavour}</div>
        </div>
    </div>
}


export default ToolCard


/*
    Card Name: Give each tool a distinct and clear name that reflects its purpose or function. The name should be easily identifiable and descriptive.

    Card Type: Categorize tools based on their function or utility, such as problem-solving techniques, decision-making strategies, creative thinking methods, etc.

    Illustration: Incorporate visually appealing designs or icons related to the tool's concept or use. This could enhance the card's visual appeal and aid in quick recognition.

    Flavor Text (Optional): Consider including a brief description or explanation that provides context for the tool, explaining its purpose or offering an example of its application.

    Card Abilities or Effects: Describe the specific steps or guidelines related to using the tool. This section should provide clear instructions or an overview of how the tool can be applied in relevant situations.

    Card Set Symbol and Number: Include a symbol or identifier for the set the tool belongs to. Number the cards within the set for easy reference.

    Card Border: Utilize a consistent design frame or border for all the tool cards to maintain a cohesive look and feel across the collection.

    Card Number: Assign a unique identification number to each card within the set to aid in organization and reference.
*/