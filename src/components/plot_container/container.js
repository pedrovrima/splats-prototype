import React, { useState, useEffect } from "react";
import Plots from "../plots";
import functions from "../../functions";
import PlotButtons from "../plot_buttons";
import didMountHook from "../../functions/didMountHook"

const Container = (props) => {
  const {
    this_region_data,
    effort_data,
    capture_data,
    groupVariables,
    maxYHook,
    yMaxes,
    yMax,
    iCalc,
    setICalc,
    i,
    total
  } = props;


  
  const [binSize, updateBinSize] = useState(10);
  const [drawPlot,setDrawplot]=useState(true)

  let [selectedStations, setSelectedStations] = useState(
    this_region_data.stations
  );
  let [effortData, setEffortData] = useState(
    functions.filterStation(effort_data, selectedStations)
  );

  let [captureData, setCaptureData] = useState(
    functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
  );


  const [plotData,setPlotData]=useState(  functions.newCreateD3(captureData, groupVariables, effort_data, binSize))

//   useEffect(()=>    {  
//     if(i===iCalc){  
//     maxYHook.setObjY(yMaxes,this_region_data.region,plotData.yMax)}
//       setICalc(iCalc+1)
//     }
// ,[iCalc]  )



  useEffect(()=>    {  
    maxYHook.setObjY(yMaxes,this_region_data.region,plotData.yMax)}
    
,[plotData]  )


useEffect(()=>{
  if(iCalc===(total-1)){setDrawplot(true)}
},[iCalc])
  
  didMountHook(()=>{
    setPlotData(functions.newCreateD3(captureData, groupVariables, effort_data, binSize))
  },[captureData, groupVariables, binSize])

  didMountHook(() => {
    setCaptureData(
      functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
    );
  }, [effortData]);

  didMountHook(() => {
    setEffortData(functions.filterStation(effort_data, selectedStations));
  }, [selectedStations]);



  return (
    <>
      <h3>{this_region_data.region}</h3>

      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <Plots
            plotData={plotData}
            capture_data={captureData}
            effortData={effortData}
            binSize={binSize}
            groupVariables={groupVariables}
            yMax={yMax}
            drawPlot={drawPlot}
          ></Plots>
        </div>
        <div className="col-span-2">
          <PlotButtons
            stations={this_region_data.stations}
            selectedStations={selectedStations}
            setSelectedStations={setSelectedStations}
            binSize={binSize}
            updateBinSize={updateBinSize}
          ></PlotButtons>
        </div>
      </div>
    </>
  );
};

export default Container;
