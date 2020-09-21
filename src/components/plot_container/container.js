import React, { useState, useEffect } from "react";
import Plots from "../plots";
import { regions } from "../../data/regions";

import PlotButtons from "../plot_buttons";
const Container = (props) => {
  const { DataHook, variables } = props;

  const {
    plotInfo,
    changeBinSize,
    removePlot,
    addStation,
    removeStation,
    maxYHook,
  } = DataHook;

  const this_region = (plot) =>
    regions.filter((reg) => reg.region === plot.region)[0];

  const regionh1 = (stations, regionData) => {
    if (stations.length === regionData.stations.length) {
      return regionData.region;
    } else {
      return regionData.region + "*";
    }
  };

  return (
    <div className={`flex items-center w-full flex-col`}>
      {plotInfo.map((plot, i) => {
        const regionData = this_region(plot);
        return (
          <div
            className={`bg-white grid grid-cols-12 w-full rounded-lg m-2 p-6 shadow-md`}
          >
            <div className={`col-span-11`}>
              <h1 className="font-sans">
                {plot.region
                  ? regionh1(plot.stations, regionData)
                  : plot.stations.length
                  ? plot.stations.join(", ")
                  : "none"}
              </h1>
            </div>
            <div className="col-span-1 flex justify-end items-start">
              <button type="button" onClick={() => removePlot(i)}>
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 286.054 286.054"
                  className="h-6 text-red-400 fill-current"
                >
                  <g>
                    <path
                      d="M168.352,142.924l25.28-25.28c3.495-3.504,3.495-9.154,0-12.64l-12.64-12.649
		c-3.495-3.486-9.145-3.495-12.64,0l-25.289,25.289l-25.271-25.271c-3.504-3.504-9.163-3.504-12.658-0.018l-12.64,12.649
		c-3.495,3.486-3.486,9.154,0.018,12.649l25.271,25.271L92.556,168.15c-3.495,3.495-3.495,9.145,0,12.64l12.64,12.649
		c3.495,3.486,9.145,3.495,12.64,0l25.226-25.226l25.405,25.414c3.504,3.504,9.163,3.504,12.658,0.009l12.64-12.64
		c3.495-3.495,3.486-9.154-0.009-12.658L168.352,142.924z M143.027,0.004C64.031,0.004,0,64.036,0,143.022
		c0,78.996,64.031,143.027,143.027,143.027s143.027-64.031,143.027-143.027C286.054,64.045,222.022,0.004,143.027,0.004z
		 M143.027,259.232c-64.183,0-116.209-52.026-116.209-116.209s52.026-116.21,116.209-116.21s116.209,52.026,116.209,116.209
		S207.21,259.232,143.027,259.232z"
                    />
                  </g>
                </svg>{" "}
              </button>
            </div>
            <div className="col-span-9">
              <Plots
                i={i}
                maxYHook={maxYHook}
                plotData={plot}
                setBinSize={changeBinSize}
                variables={variables}
              ></Plots>
            </div>

            <div className="col-span-3">
              <PlotButtons
                region={plot.region}
                i={i}
                stationFuncs={{ addStation, removeStation }}
                selectedStations={plot.stations}
                binSize={plot.binSize}
                updateBinSize={changeBinSize(i)}
              ></PlotButtons>
            </div>
          </div>
        );
      })}


    </div>
  );
};

export default Container;
