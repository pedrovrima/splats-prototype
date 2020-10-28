import React,{useState} from "react"

const YHook = ()=>{
    
    const [yMax,setYMax] = useState(0)

    const objMax = (obj)=>
    Math.max(...Object.keys(obj).map(key=>obj[key]))
    

    const setObjMax=obj=>setYMax(objMax(obj))

    return[yMax,setObjMax]

}


export default YHook