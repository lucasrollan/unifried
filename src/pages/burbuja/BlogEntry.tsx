import moment from "moment"
import style from './blog.module.css'
import { ReactElement } from "react"

type BlogEntryProps = {
    date: string,
    place: string,
    children: ReactElement,
}

export default function BlogEntry(props: BlogEntryProps) {
    return <div className={style.entry}>
        <h3 className={style.header}>
            {moment(props.date).format('YYYY-MM-DD')}, {props.place}
        </h3>
        <div>
            {props.children}
        </div>
        <div className={style.separator}></div>
    </div>
}