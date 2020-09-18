import React,{useState} from "react"
import {regions} from "../data/regions"



const newPlotInfo = (stations)=>{
    return({stations,binSize:10,region:null})
}


const newRegionPlot= (region)=>{
    const regionData=regions.filter(reg=>reg.region===region)
    return({stations:regionData[0].stations,binSize:10,region:regionData[0].region})
}


const DataHook = ()=>{

const [plotInfo,setPlotInfo]=useState([])
const [variables,setVariables] = useState(["AgeClass","SexClass"])


const addVariables=(variable)=>setVariables(...variables,variable)
const removeVariable=(variable)=>setVariables(variables.filter(vari=>vari!==variable))


const addPlot=(stations)=>setPlotInfo([...plotInfo,newPlotInfo(stations)])
const addByRegion = (region)=>setPlotInfo([...plotInfo,newRegionPlot(region)])

const removePlot=(i)=>{
    setPlotInfo([...plotInfo.slice(0,i),...plotInfo.slice(i+1)])
}


const addStation = (plot_i,station)=>{
    const stations = [...plotInfo[plot_i].stations,station]
    setPlotInfo([...plotInfo.slice(0,plot_i),{...plotInfo[plot_i],stations},...plotInfo.slice(plot_i+1)])
}
const removeStation = (plot_i,station)=>{
    const stations = plotInfo[plot_i].stations.filter(stat=>stat!==station)
    setPlotInfo([...plotInfo.slice(0,plot_i),{...plotInfo[plot_i],stations},...plotInfo.slice(plot_i+1)])
}
const changeBinSize =(plot_i,)=> (binSize)=>{
    setPlotInfo([...plotInfo.slice(0,plot_i),{...plotInfo[plot_i],binSize},...plotInfo.slice(plot_i+1)])

}



return {plotInfo,variables,addPlot,removePlot,addVariables,removeVariable,addStation,removeStation,changeBinSize,addByRegion}

}

export default DataHook