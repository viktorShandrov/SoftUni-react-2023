
import styles from "./Navigation.module.css"
import {Link} from "react-router-dom";
import {useRef, useState} from "react";
export default function Navigation(){
    const [currentSectionName,setCurrentSectionName] = useState("")
    const navigationWrapperRef = useRef(null)
    const navigateHandler = (e:any)=>{
        setCurrentSectionName(e.target.textContent)
        burgerMenuClickHandler()
    }

    const burgerMenuClickHandler = ()=>{
        // @ts-ignore
        if(navigationWrapperRef.current.classList.contains(styles.opened)){
            // @ts-ignore
            navigationWrapperRef.current.classList.remove(styles.opened)
        }else{
            // @ts-ignore
            navigationWrapperRef.current.classList.add(styles.opened)
        }
    }

    return(
        <div ref={navigationWrapperRef} className={styles.navigationWrapper}>

            <div className={styles.currentSectionLabelC}>
                {currentSectionName.length>0&&currentSectionName.split("").map((char,index)=><h6 key={index} className={styles.currentSectionLabelChar}>{char}</h6>)}
            </div>
            <div onClick={burgerMenuClickHandler}  className={styles.burgerMenuIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
            </div>

                <Link onClick={navigateHandler} to={"/main/hero"} >
                    <section className={styles.logoC}>
                            <div className={styles.logoPicC}>
                                <img src="/logo/logo.png" alt=""/>
                            </div>
                            <div className={styles.logoNameC}>
                                <img src="/logo/name.png" alt=""/>
                            </div>


                    </section>
                </Link>
            <section className={styles.linksC}>
                <Link onClick={navigateHandler} to={"/main/read"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/nav%20icons%20new/read.png" alt=""/>
                        </div>
                        <h6 className={styles.navItemLabel}>Четене</h6>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/AllBooks"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/nav%20icons%20new/books.png" alt=""/>
                        </div>
                        <h6 className={styles.navItemLabel}>Kниги</h6>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/news"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/nav%20icons%20new/news.png" alt=""/>
                        </div>
                        <h6 className={styles.navItemLabel}>Новини</h6>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/unknownWords"} className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/nav%20icons%20new/dictionary.png" alt=""/>
                        </div>
                        <h6 className={styles.navItemLabel}>Непознати думи</h6>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/test/randomWords"}  className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/nav%20icons%20new/test.png" alt=""/>
                        </div>
                        <h6 className={styles.navItemLabel}>Тестове</h6>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/dashboard"}  className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/Navigation%20Icons/chat.png" alt=""/>
                        </div>
                        <h6 className={styles.navItemLabel}>Чат с изк. интелект</h6>
                    </article>
                </Link>
                <Link onClick={navigateHandler} to={"/main/dashboard"}  className={styles.linkItem} >
                    <article className={styles.linkC}>
                        <div className={styles.imageC}>
                            <img src="/nav%20icons%20new/prodile.png" alt=""/>
                        </div>
                        <h6 className={styles.navItemLabel}>Профил</h6>
                    </article>
                </Link>

            </section>
        </div>
    )
}