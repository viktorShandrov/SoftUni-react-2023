import {useState} from "react";

export default function useForm(initialValue:any){
    const [formValues,setFormValues] = useState(initialValue)
    const onFormChange=(e:any)=>{

        setFormValues((state:any)=>{
            return {
                ...state,
                [e.target.name]:e.target.value
            }
        })
    }
    const resetForm = () =>{
        setFormValues(initialValue)
    }
    return[
        formValues,
        onFormChange,
        resetForm
    ]
}