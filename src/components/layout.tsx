import Session from "./session";

export default function Layout(props: any) {
    return <div>
        <nav>NAVIGATION</nav>
        <div>
            <Session />
        </div>
        <main>{
            props.children
        }</main>
    </div>
}