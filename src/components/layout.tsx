import Session from "./session";
import '../main.css'
import NavBar from "@/components/NavBar";

export default function Layout(props: any) {
    return <div className="layout">
        <NavBar />
        <div className="fullHeight">{
            props.children
        }</div>
    </div>
}
