import React, {useState,useEffect} from "react"



const LocalStorageHook =  ()=>{
        const [storageData,setStorageData] = useState ()

        useEffect(()=>{
            const localData = localStorage.getItem("userProgress");
            setStorageData(JSON.parse(localData))
            console.log(storageData)
        },[])
        

        useEffect(() => {
            localStorage.setItem("userProgress",JSON.stringify(storageData))
        },[storageData])

        return {storageData,setStorageData}
        

}


export default LocalStorageHook