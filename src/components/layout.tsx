import Session from "./session";
import '../main.css'
import NavBar from "./navbar";

export default function Layout(props: any) {
    return <div>
        <NavBar />
        <div>
            <Session />
        </div>
        <main>{
            props.children
        }</main>
    </div>
}