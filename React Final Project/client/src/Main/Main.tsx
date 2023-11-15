import StoryList from "../Story-list/StoryList";
import Story from "../Story/Story";
import TranslationContainer from "../TranslationContainer/TranslationContainer";
import {Link, Route, Routes} from "react-router-dom";
import ChapterList from "../ChapterList/ChapterList";
import styles from "./Main.module.css"
import {useContext, useState} from "react";
import {userContext} from "../App";
export default  function Main(){

    const {user,setUser} = useContext(userContext)

    return(
        <>
            <div className={styles.navC}>
                <nav className={styles.nav}>
                    {user&&
                        <>
                            <Link to={"/user/login"} className={styles.navItem}>Read</Link>
                            <Link to={"/user/login"} className={`${styles.navItem} ${styles.booksNav}`}>Books</Link>
                            <div className={styles.booksMenu}>
                                <Link to={"/main/AllBooks"} className={styles.navItem}>All books</Link>
                                <Link to={"/user/login"} className={styles.navItem}>My books</Link>
                            </div>
                            <Link to={"/main/unknownWords"} className={styles.navItem}>My unknown words</Link>
                            <Link to={"/user/login"} className={`${styles.navItem} ${styles.testsNav}`}>Tests</Link>
                            <div className={styles.testsMenu}>
                                <Link to={"/user/login"} className={styles.navItem}>My tests</Link>
                                <Link to={"/main/test/randomWords"} className={styles.navItem}>Random words</Link>
                                <Link to={"/main/test/textWords"} className={styles.navItem}>Words from text</Link>
                                <Link to={"/main/test/textQuestions"} className={styles.navItem}>Chapter plot</Link>
                            </div>
                        </>

                    }

                    {!user&&
                        <>
                            <Link to={"/user/login"} className={styles.navItem}>Login</Link>
                            <Link to={"/user/register"} className={styles.navItem}>Register</Link>
                        </>

                    }

                </nav>
            </div>

            <main className={styles.main}>
                <Routes>
                    <Route path={"/"} element={<StoryList />}/>
                    <Route path={"/:bookId/:chapterId?/:textToTranslate?"} element={<ChapterList />}/>

                </Routes>
                <Routes>
                    <Route path={"/:bookId/:chapterId/:textToTranslate?"} element={<Story />}/>
                </Routes>
                <Routes>
                    <Route path={"/:bookId/:chapterId/:textToTranslate"} element={<TranslationContainer/>}/>
                </Routes>


            </main>



         </>


    )
}