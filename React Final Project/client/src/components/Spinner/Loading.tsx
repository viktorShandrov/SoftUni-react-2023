
import styles from "./Loading.module.css"
import Spinner from "react-bootstrap/Spinner";

export default function Loading(){
    // @ts-ignore
    return(
        <div className={styles.spinner}>
            <div className={styles.logo}>
                <img src="../../../public/logo/logo.png" alt=""/>
                <img src="../../../public/logo/name.png" alt=""/>
            </div>


    {/*// @ts-ignore*/}
            <Spinner>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>


    )
}