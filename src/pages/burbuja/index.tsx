import Blog from './blog.mdx'
import style from './blog.module.css'

export default function BurbujaBlog () {
    return <div>
        <h1 className={style.hero}>Bitacora de una Burbuja</h1>
        <Blog />
    </div>
}