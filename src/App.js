import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import effort_data from "./data/effort";
import capture_data from "./data/capture";
import functions from "./functions";
import plot_functions from "./functions/graph_functions"
import useDidMountEffect from "./didMountHook";

function App() {
  const stationUpdater = station =>      plot_functions.updateStations(
    refs.current,
    capture_data,
    groupVariables,
    station,
    createBins(365, binSize))

  let stations = [...new Set(effort_data.map(eff=>eff.station)) ].sort()
  console.log(stations)
  let [binSize, setBinSize] = useState(10);
  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);
  let [selectedStations, setSelectedStations] = useState([]);
  let [effortData, setEffortData] = useState(
    functions.filterStation(effort_data, selectedStations)
  );
  let [captureData, setCaptureData] = useState(
    functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
  );
  let refs = useRef(null);
  const updateBinSize = (bin) => {
    setBinSize(bin);
  };

  const stationChecker = (stations, station_name) => {
    stations.indexOf(station_name) < 0
      ? setSelectedStations([...stations, station_name])
      : setSelectedStations(stations.filter((stat) => stat !== station_name));
  };

  const createBins = (max, size) => {
    let number_of_bins = Math.ceil(max / size);
    let bins = [];
    for (let i = 0; i < number_of_bins; i++) {
      bins.push(5 + i * size);
    }
    return bins;
  };

  useDidMountEffect(() => {
    setEffortData(functions.filterStation(effort_data, selectedStations));
  }, [selectedStations]);


  useDidMountEffect(() => {
    plot_functions.updateStatic(
      refs.current,
      capture_data,
      groupVariables,
      effortData,
      createBins(365, binSize)
    );
  }, [binSize,groupVariables]);


  useEffect(() => {
   stationUpdater(effortData)
  }, [effortData]);




  useEffect(() => {
    if (refs.current) {
      plot_functions.createPlot(
        refs.current,
        captureData,
        groupVariables,

        effortData,
        createBins(365, binSize)
      );
    }
  }, []);


  return (
    <div>
      <div>
        <h1>SWTH</h1>
        <h2
          style={{ margin: "10px" }}
        >{`${selectedStations} bin size=${binSize}`}</h2>
        <div ref={refs}> </div>
        <h3>Bin size</h3>
        <button type="button" onClick={() => updateBinSize(5)}>
          {" "}
          5
        </button>
        <button type="button" onClick={() => updateBinSize(10)}>
          {" "}
          10
        </button>
        <button type="button" onClick={() => updateBinSize(15)}>
          {" "}
          15
        </button>
        <button type="button" onClick={() => updateBinSize(30)}>
          {" "}
          30
        </button>
        <button type="button" onClick={() => updateBinSize(45)}>
          {" "}
          45
        </button>
        <button type="button" onClick={() => updateBinSize(60)}>
          {" "}
          60
        </button>
      </div>
      <h3>Bird Classes</h3>
      <div>

        <button type="button" onClick={() => setGroupVariables(["AgeClass"])}>
          Age
        </button>

        <button type="button" onClick={() => setGroupVariables(["SexClass"])}>
          Sex
        </button>

        <button
          type="button"
          onClick={() => setGroupVariables(["AgeClass", "SexClass"])}
        >
          Age and Sex
        </button>
      </div>
      <h3>Stations</h3> <button type="button" onClick={()=>setSelectedStations([])}>remove all</button>
      <div>
        {stations.map(stat=>{
          return(
            <button type="button" onClick={() => stationChecker(selectedStations, stat)}>
            {stat}
          </button>
  
          )
        })}

      </div>
    </div>
  );
}

export default App;
