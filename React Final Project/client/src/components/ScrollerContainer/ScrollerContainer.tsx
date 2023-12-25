
import styles from "./ScrollerContainer.module.css"
import BookElement from "../AllBooks/BookElement/BookElement";
import {useRef, useState} from "react";
export default function ScrollerContainer({children}){


    const [scrollerClickPosition,setScrollerClickPosition] = useState(0)
    const scroller = useRef(null)
    const scrollerData = useRef(null)
    const rightArrowClick = ()=>{
        const value = (scrollerClickPosition+1) * scroller.current.getBoundingClientRect().width

        if(value < scrollerData.current.getBoundingClientRect().width){
            // @ts-ignore
            scrollerData.current.style.transform = `translateX(-${value}px)`
            setScrollerClickPosition(oldValue => oldValue+1)

        }
    }
    const leftArrowClick = ()=>{
        if(scrollerClickPosition-1>=0){
            // @ts-ignore
            scrollerData.current.style.transform = `translateX(-${(scrollerClickPosition-1) * scroller.current.getBoundingClientRect().width}px)`
            setScrollerClickPosition(oldValue => oldValue-1)
        }

    }



    return(
        <div ref={scroller} className={styles.scrollerContainer}>
            <i onClick={leftArrowClick} className={`${"fa-solid fa-angle-left"} ${styles.arrowLeft}`}></i>
            <i onClick={rightArrowClick} className={`${"fa-solid fa-angle-right"} ${styles.arrowRight}`}></i>
            <div  className={styles.itemsContainer}>
                <div ref={scrollerData} className={styles.itemsC}>
                    {children}
                </div>
            </div>
        </div>
    )
}