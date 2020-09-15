import React, { useState, useEffect } from "react";
import Plots from "../plots";
import functions from "../../functions";
import PlotButtons from "../plot_buttons";
import didMountHook from "../../functions/didMountHook"

const Container = (props) => {
  const {
    this_region_data,
    yMax,
    plotData,
    binChange,
    fixedY
  } = props;


  
  const [binSize, updateBinSize] = useState(10);
  const binUpdater = (bin)=>{
    updateBinSize(bin)
    binChange(bin)
  }


  let [selectedStations, setSelectedStations] = useState(
    this_region_data.stations)

    const stationUpdater = (stations)=>{
      console.log("tried")
      setSelectedStations(stations)
      binChange(binSize,stations)
    }
  
  
  return (
    <>
      <h3>{this_region_data.region}</h3>

      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <Plots
            plotData={plotData}
            yMax={fixedY?yMax:plotData.yMax}
          ></Plots>
        </div>
        <div className="col-span-2">
          <PlotButtons
            stations={this_region_data.stations}
            selectedStations={selectedStations}
            setSelectedStations={stationUpdater}
            binSize={binSize}
            updateBinSize={binUpdater}
          ></PlotButtons>
        </div>
      </div>
    </>
  );
};

export default Container;
