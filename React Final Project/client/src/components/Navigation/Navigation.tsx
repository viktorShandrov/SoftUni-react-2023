
import styles from "./Navigation.module.css"
import {Link} from "react-router-dom";
import {useState} from "react";
export default function Navigation(){
    const [currentSectionName,setCurrentSectionName] = useState("")
    const navigateHandler = (e:any)=>{
        setCurrentSectionName(e.target.textContent)
    }

    return(
        <div className={styles.navigationWrapper}>

            <div className={styles.currentSectionLabelC}>
                {currentSectionName.length>0&&currentSectionName.split("").map((char,index)=><h1 key={index} className={styles.currentSectionLabelChar}>{char}</h1>)}
            </div>
            <div className={styles.burgerMenuIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
            </div>

            <section className={styles.logoC}>
                <div className={styles.logoPicC}>
                    <img src="/logo/logo.png" alt=""/>
                </div>
                <div className={styles.logoNameC}>
                    <img src="/logo/name.png" alt=""/>
                </div>

            </section>
            <section className={styles.linksC}>
                <Link onClick={navigateHandler} to={"/main/read"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/Картина5.png" alt=""/>
                        </div>
                        <h1 className={styles.navItemLabel}>Четене</h1>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/AllBooks"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/Картина5.png" alt=""/>
                        </div>
                        <h1 className={styles.navItemLabel}>Kниги</h1>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/news"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/newspaper.png" alt=""/>
                        </div>
                        <h1 className={styles.navItemLabel}>Новини</h1>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/unknownWords"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/Картина1.png" alt=""/>
                        </div>
                        <h1 className={styles.navItemLabel}>Непознати думи</h1>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/test/randomWords"}  className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/Картина4.png" alt=""/>
                        </div>
                        <h1 className={styles.navItemLabel}>Тестове</h1>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/dashboard"}  className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/Картина3.png" alt=""/>
                        </div>
                        <h1 className={styles.navItemLabel}>Чат с изк. интелект</h1>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/dashboard"}  className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/Картина11.png" alt=""/>
                        </div>
                        <h1 className={styles.navItemLabel}>Профил</h1>
                    </article>
                </Link>

            </section>
        </div>
    )
}