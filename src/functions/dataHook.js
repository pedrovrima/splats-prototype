import React, { useState, useEffect } from "react";
import { regions } from "../data/regions";

const newPlotInfo = (stations) => {
  return { stations:[stations], binSize: 10, region: null, yMax:10 };
};

const newRegionPlot = (region) => {
  const regionData = regions.filter((reg) => reg.region === region);
  return {
    stations: regionData[0].stations,
    binSize: 10,
    region: regionData[0].region, yMax:10
  };
};

const DataHook = () => {
  const [plotInfo, setPlotInfo] = useState([]);
  const [variables, setVariables] = useState(["AgeClass", "SexClass"]);

  const [yMaxes, setYMaxes] = useState([20]);
  const [yMax, setYMax] = useState(20);
  const [fixedY, setFixedY] = useState(false);


    useEffect(() => setYMax(Math.max(...plotInfo.map(plot=>plot.yMax))), [plotInfo]);

  const addVariables = (variable) => setVariables(...variables, variable);
  const removeVariable = (variable) =>
    setVariables(variables.filter((vari) => vari !== variable));

  const addPlot = (stations) =>
    setPlotInfo([...plotInfo, newPlotInfo(stations)]);
  const addByRegion = (region) =>
    setPlotInfo([...plotInfo, newRegionPlot(region)]);

  const removePlot = (i) => {
    setPlotInfo([...plotInfo.slice(0, i), ...plotInfo.slice(i + 1)]);
  };

  const addStation = (plot_i, station) => {
    const stations = [...plotInfo[plot_i].stations, station];
    console.log(stations)

    setPlotInfo([
      ...plotInfo.slice(0, plot_i),
      { ...plotInfo[plot_i], stations },
      ...plotInfo.slice(plot_i + 1),
    ]);
  };

  const removeStation = (plot_i, station) => {
    const stations = plotInfo[plot_i].stations.filter(
      (stat) => stat !== station
    );
        console.log(stations)

     setPlotInfo([
      ...plotInfo.slice(0, plot_i),
      { ...plotInfo[plot_i], stations },
      ...plotInfo.slice(plot_i + 1),
    ]);
  };
  const changeBinSize = (plot_i) => (binSize) => {
    setPlotInfo([
      ...plotInfo.slice(0, plot_i),
      { ...plotInfo[plot_i], binSize },
      ...plotInfo.slice(plot_i + 1),
    ]);
  };

  const changeYMaxes = (value, i) => {
    const newPlotInfo = [...plotInfo];
    console.log(newPlotInfo[i].yMax,value)
    newPlotInfo[i].yMax=value
    setPlotInfo(newPlotInfo);
  };


  const maxYHook = { yMax, fixedY, changeYMaxes, setFixedY };

  return {
    plotInfo,
    variables,
    addPlot,
    removePlot,
    addVariables,
    removeVariable,
    addStation,
    removeStation,
    changeBinSize,
    addByRegion,
    maxYHook,
  };
};

export default DataHook;
