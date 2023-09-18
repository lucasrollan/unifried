import '../main.css'

export default function Layout(props: any) {
    return <div className="layout">
        <div className="fullHeight">{
            props.children
        }</div>
    </div>
}
