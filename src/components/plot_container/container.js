import React, {useState,useEffect} from "react"
import Plots from "../plots"
import functions from "../../functions"
import PlotButtons from "../plot_buttons"

const Container = (props)=>{

    

    const {this_region_data,effort_data,capture_data,groupVariables} = props
    const [binSize,updateBinSize]=useState(10)

    console.log(props)   
    let [selectedStations, setSelectedStations] = useState(this_region_data.stations);
    let [effortData, setEffortData] = useState(
        functions.filterStation(effort_data, selectedStations)
      );
    
      let [captureData, setCaptureData] = useState(
        functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
      );
    
      useEffect(() => {
        setCaptureData(functions.filterCaptures(capture_data, functions.getEffortIds(effortData)))
       }, [effortData]);

       useEffect(()=>{
        setEffortData(        functions.filterStation(effort_data, selectedStations)
        )
       },[selectedStations])
    


    return (<>
    <h3>{this_region_data.region}</h3>

    <div className="grid grid-cols-6">
    <div className="col-span-4">
    <Plots  capture_data={captureData} effortData={effortData} binSize={binSize} groupVariables={groupVariables}></Plots>
    </div>
    <div className="col-span-2">
      <PlotButtons stations={this_region_data.stations} selectedStations={selectedStations} setSelectedStations={setSelectedStations} binSize={binSize} updateBinSize={updateBinSize}></PlotButtons>
    </div>
    </div>
</>)
}


export default Container