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


        const setLocalStore = (spp,data)=>{
            setStorageData({...storageData,[spp]:data})
        }

        return {storageData,setLocalStore}
        

}


export default LocalStorageHook