
import style from './css/page.module.css'
import rootTheme from './css/root.module.css'

export default function BrandPage() {



    return (
        <div className={rootTheme.root}>
            <div className={style.mainContainer}>
                <h1>這是 h1</h1>
                <h2>這是 h2</h2>
                <h3>這是 h1</h3>
            </div>
        </div>
    )
}