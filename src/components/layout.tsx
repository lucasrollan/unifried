import '../main.css'
import NavBar from "./NavBar";

export default function Layout(props: any) {
    return <div className="layout">
        <NavBar />
        <div className="fullHeight">{
            props.children
        }</div>
    </div>
}
