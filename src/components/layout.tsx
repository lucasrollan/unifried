import React from "react";
import '../main.css'
import NavBar from "./NavBar";
import SessionGuard from "./SessionGuard";

export default function Layout(props: any) {
    return <div className="layout">
        <SessionGuard>
            <NavBar />
            <div className="fullHeight">{
                props.children
            }</div>
        </SessionGuard>
    </div>
}
