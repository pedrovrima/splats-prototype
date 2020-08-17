import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import effort_data from "./data/effort";
import capture_data from "./data/capture";
import functions from "./functions";

function App() {
  let [binSize, setBinSize] = useState(10);
  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);
  let [stations, setStations] = useState([]);
  let [effortData, setEffortData] = useState(
    functions.filterStation(effort_data, stations)
  );
  let [captureData, setCaptureData] = useState(
    functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
  );
  let refs = useRef(null);
  const updateBinSize = (bin) => {
    setBinSize(bin);
  };

  const stationChecker = (stations,station_name)=>{
    stations.indexOf(station_name)<0?
    setStations([...stations, station_name]):
    setStations(stations.filter(stat=>stat!==station_name))
  }

  const createBins = (max, size) => {
    let number_of_bins = Math.ceil(max / size);
    let bins = [];
    for (let i = 0; i < number_of_bins; i++) {
      bins.push(5 + i * size);
    }
    return bins;
  };

  useEffect(() => {
    setEffortData(functions.filterStation(effort_data, stations));
  }, [stations]);

  useEffect(() => {
    setCaptureData(
      functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
    );
  }, [effortData]);

  useEffect(() => {
    functions.updateData(
      refs.current,
      captureData,

      groupVariables,

      effortData,
      createBins(365, binSize)
    );
  }, [binSize, groupVariables, captureData]);

  useEffect(() => {
    if (refs.current) {
      functions.createPlot(
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
        <h1
          style={{ margin: "10px" }}
        >{`SWTH/${stations} bin size=${binSize}`}</h1>
        <div ref={refs}> </div>
        <button type="button" onClick={() => updateBinSize(5)}>
          {" "}
          Bin Size=5
        </button>
        <button type="button" onClick={() => updateBinSize(10)}>
          {" "}
          Bin Size=10
        </button>
        <button type="button" onClick={() => updateBinSize(15)}>
          {" "}
          Bin Size=15
        </button>
        <button type="button" onClick={() => updateBinSize(30)}>
          {" "}
          Bin Size=30
        </button>
        <button type="button" onClick={() => updateBinSize(45)}>
          {" "}
          Bin Size=45
        </button>
        <button type="button" onClick={() => updateBinSize(60)}>
          {" "}
          Bin Size=60
        </button>
      </div>
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
      <div>
        <button
          type="button"
          onClick={() => stationChecker(stations,"HOME")}
        >
          HOME
        </button>

        <button
          type="button"
          onClick={() => stationChecker(stations,"PARK")}
        >
          PARK
        </button>

        <button
          type="button"
          onClick={() => stationChecker(stations,"WIIM")}
        >
          WIIM
        </button>
      </div>
    </div>
  );
}

export default App;
