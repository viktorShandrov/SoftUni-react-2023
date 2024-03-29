
import styles from "./AddBook.module.css"
import {useEffect, useState} from "react";
import {request} from "../../functions";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from 'react-toastify';


export default function AddBook() {
    const {bookId} = useParams()
    const navigate = useNavigate()
    const [formValues, setFormValues] = useState({
        name: "",
        author: "",
        resume: "",
        releaseDate: "",
        genre: "",
        priceInCents:0
    })

    const [createdBook,setCreatedBook] = useState(null)

    const formValueChangeHandler = (e: any) => {
        setFormValues(() => {
            return {
                ...formValues,
                [e.target.name]: e.target.value
            }

        })
    }
    useEffect(() => {
        if (bookId) {
            request(`books/${bookId}`).subscribe(
                (res: any) => {
                    setFormValues(res.book)
                },
            )
        }
    }, [bookId])

    const createBookHandler = () => {
        request("books/create", "POST", {bookData: formValues},
        ).subscribe(
            (res: any) => {
                setCreatedBook(res)
            }
        )
    }
    const editBookHandler = () => {
        request(`books/${bookId}/edit`, "POST", {bookData: formValues}).subscribe(
            () => {
                toast.success("Book edit is successful")
                navigate("/main/AllBooks")
            },
        )
    }

















    const [imageUpload, setImageUpload] = useState(null);

    // const imagesListRef = ref(storage, "images/");
    const uploadFile = () => {
        if (imageUpload == null) return;
        console.log(imageUpload)

        const formData = new FormData();
        formData.append('image', imageUpload);


        // @ts-ignore
        request(`books/addImageToBook/${createdBook._id}`,"POST",formData,{},true).subscribe(
            ()=>{
                toast.success("Image successfully attached")
            }
        )


        // @ts-ignore
        // const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        // uploadBytes(imageRef, imageUpload).then((snapshot) => {
        //     getDownloadURL(snapshot.ref).then(url=>{
        //         // @ts-ignore
        //         request(`books/addImageToBook/${createdBook._id}`,"POST",{imageUrl:url}).subscribe(
        //             ()=>{
        //                 toast.success("Image successfully attached")
        //             }
        //         )
        //
        //     })
        // });
    };


















        return (
            <>
                <h1>Create/Edit book</h1>
                <div className={styles.formWrapper}>
                    <div className={styles.formC}>
                        <input name={"name"} placeholder={"Име на книга"} value={formValues.name}
                               onChange={formValueChangeHandler}/>
                        <input name={"author"} placeholder={"Автор"} value={formValues.author}
                               onChange={formValueChangeHandler}/>
                        <textarea name={"resume"} placeholder={"Резюме"} value={formValues.resume}
                                  onChange={formValueChangeHandler}/>
                        <input name={"genre"} placeholder={"Жанр"} value={formValues.genre}
                               onChange={formValueChangeHandler}/>
                        <input type={"number"} name={"priceInCents"} placeholder={"цента в стотики"} value={formValues.priceInCents}
                               onChange={formValueChangeHandler}/>
                        <input type={"date"} name={"releaseDate"} placeholder={"Дата на издаване"}
                               value={formValues.releaseDate} onChange={formValueChangeHandler}/>
                        {!bookId &&
                            <button onClick={createBookHandler} className={styles.submitBtn}>Създай</button>
                        }
                        {bookId &&
                            <button onClick={editBookHandler} className={styles.editBtn}>Редактирай</button>
                        }








                        <div className="App">
                            <input

                                type="file"
                                onChange={(event) => {
                                    // @ts-ignore
                                    setImageUpload(event.target.files[0]);
                                }}
                            />
                            <button
                                disabled={!createdBook}
                                onClick={uploadFile}
                            >
                                Закачи снимка
                            </button>

                        </div>







                    </div>
                </div>
            </>
        )
    }
