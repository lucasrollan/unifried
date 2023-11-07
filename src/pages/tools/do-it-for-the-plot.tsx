import ToolCard from "@/components/ToolCard"

function Page() {
    return <main style={{ padding: '20px' }}>
        <h1>Do it for the plot</h1>
        <div style={{ display: 'flex', marginBottom: '20px'}}>
            <div>
                {/* <img src="/magic-card-template.png" style={{width: '63.5mm', position: 'absolute', opacity: 0.5}} /> */}
                <ToolCard
                    name="Do it for the plot"
                    illustrationUrl="/tool-cards/art/do-it-for-the-plot.png"
                    illustrationDescription="Drawing of a book being written by a feather"
                    type="Decision making tool"
                    setLogoUrl="/tool-cards/sets/decision-making/icon.png"
                    setName="Narrative devices"
                    setId="narrative-devices"
                    abilities={[
                        "When hesitating to make decisions or face obstacles, consider the interesting life story that may result of going for it."
                    ]}
                    flavour="Every choice shapes the chapters of our story. Write a tale worth living."
                />
            </div>
            <div style={{ flex: '1', marginLeft: '20px', marginBottom: '20px' }}>
                <h2>Summary</h2>
                <p>&quot;Do It for the Plot&quot; is a decision-making tool within the &quot;Narrative Devices&quot; set, designed to encourage individuals to consider the broader storyline or ultimate goal when making decisions or facing challenges. Emphasizing the importance of the overarching narrative, this tool aids in creating a cohesive and purposeful approach to decision-making.</p>
                <h3>Abilities/Effects</h3>
                <p>Envisioning the bigger picture is the core ability of this tool. By utilizing &quot;Do It for the Plot,&quot; individuals can step back from immediate choices and evaluate them in the context of the larger story they are shaping. This perspective shift allows for better alignment of decisions with long-term objectives, ensuring actions contribute positively to the overall narrative.</p>
                <h3>Application</h3>
                <p>Utilize this tool in situations where critical decisions or choices need to be made. By employing the &quot;Do It for the Plot&quot; strategy, individuals can reframe their thinking to consider the future implications of their actions, guiding decisions that align with the overarching goals or desired outcomes.</p>
            </div>
        </div>
        <div  style={{ clear: 'left' }}>
            <h2>In detail</h2>
            <p>Imagine a story, like a book or a movie, where every action or decision made by the characters contributes to the plot&apos;s development. In real life, the choices we make and the actions we take shape our personal narratives or life stories.</p>
            <p>The &quot;Do It for the Plot&quot; strategy encourages individuals to take a step back and think about the long-term implications or consequences of their choices. Instead of just focusing on immediate results or short-term gains, this approach prompts people to consider how their decisions fit into the larger story of their lives or their goals.</p>
            <p>For instance, when faced with a decision, one might ask themselves: &quot;How does this choice contribute to my long-term goals or the bigger narrative of what I want to achieve?&quot; This mindset enables a person to align their actions with their larger objectives and aspirations.</p>
            <p>The strategy is not just about considering immediate gratification or quick fixes; rather, it emphasizes making choices that contribute positively to the overall direction of one&apos;s life or the objectives they are aiming to accomplish. It's about creating a coherent and purposeful approach to decision-making, aligning actions with the broader narrative or desired outcomes.</p>
            <p>In essence, &quot;Do It for the Plot&quot; is a way of thinking that encourages individuals to make decisions that contribute positively to their long-term goals and personal narrative, fostering a more purposeful and meaningful direction in life.</p>
        </div>
    </main>
}

export default Page