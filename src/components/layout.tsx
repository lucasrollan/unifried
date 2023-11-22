import React from "react";

export default function Layout(props: any) {
    return <div className="fullHeight">{
        props.children
    }</div>
}
