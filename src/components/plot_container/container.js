import React, { useState, useEffect } from "react";
import Plots from "../plots";
import PlotButtons from "../plot_buttons"
const Container = (props) => {
  const { DataHook, variables} = props;

  const { plotInfo, changeBinSize,removePlot,addStation,removeStation } = DataHook;

  return (
    <div className={`flex items-center flex-col`}>
      {plotInfo.map((plot, i) => (
          
        <div
          className={`bg-white grid grid-cols-12  w-10/12  rounded-lg m-2 p-6 shadow-md`}
        >
          <div className={`col-span-11`}>  
          <h1 className="font-sans">{plot.region?plot.region:plot.stations}</h1>
          </div>
          <div className="col-span-1 align-baseline">
          <button type="button" onClick={()=>removePlot(i)}>Remove</button>
</div>
          <div className="col-span-9">
          <Plots i={i} plotData={plot} setBinSize={changeBinSize} variables={variables}></Plots>

          </div>
          
          
                    <div className="col-span-3">
        <PlotButtons region={plot.region} i={i} stationFuncs={{addStation,removeStation}} selectedStations={plot.stations} binSize={plot.binSize}  updateBinSize={changeBinSize(i)}></PlotButtons>
        </div>
        </div>
      ))}
    </div>
  );
};

export default Container;
