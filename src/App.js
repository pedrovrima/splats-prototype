import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import effort_data from "./data/effort";
import capture_data from "./data/capture";
import functions from "./functions";
import plot_functions from "./functions/graph_functions"
import useDidMountEffect from "./didMountHook";
import regions_data from "./data/regions"
function App() {
  const stationUpdater = station =>      plot_functions.updateStations(
    refs.current,
    capture_data,
    groupVariables.sort(),
    station,
    createBins(365, binSize))

  let stations = [...new Set(effort_data.map(eff=>eff.station)) ].sort()
  console.log(stations)
  let [binSize, setBinSize] = useState(10);
  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);
  let [selectedStations, setSelectedStations] = useState(["PARK", "JACR", "HOME", "NAVR", "CABL","GATE","GELL","HOUS","KAHN","LEST","MOMA","SAC2","SACR","SHAY"]);
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


  const checker = (arr, target) => target.every(v => arr.includes(v));

  const stationChecker = (stations, station_name) => {
    stations.indexOf(station_name) < 0
      ? setSelectedStations([...stations, station_name])
      : setSelectedStations(stations.filter((stat) => stat !== station_name));
  };

  const variableChecker = (selectedVars, variable) => {
    selectedVars.indexOf(variable) < 0
      ? setGroupVariables([...selectedVars, variable])
      : setGroupVariables(selectedVars.filter((stat) => stat !== variable));
  };



  const regionChecker = (stations, regions)=>{
    !checker(stations,regions)? 
    setSelectedStations([...new Set([...stations, ...regions])]):
    setSelectedStations(stations.filter((stat) => !regions.includes(stat)))
  
  }

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
      groupVariables.sort(),
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
        <h3>Bin size (days)</h3>
        <button className={`btn-add ${binSize===5?"btn-active":""}`} type="button" onClick={() => updateBinSize(5)}>
          {" "}
          5
        </button>
        <button className={`btn-add ${binSize===10?"btn-active":""}`} type="button" onClick={() => updateBinSize(10)}>
          {" "}
          10
        </button>
        <button className={`btn-add ${binSize===15?"btn-active":""}`} type="button" onClick={() => updateBinSize(15)}>
          {" "}
          15
        </button>
        <button className={`btn-add ${binSize===30?"btn-active":""}`} type="button" onClick={() => updateBinSize(30)}>
          {" "}
          30
        </button>
        <button className={`btn-add ${binSize===45?"btn-active":""}`} type="button" onClick={() => updateBinSize(45)}>
          {" "}
          45
        </button>
        <button className={`btn-add ${binSize===60?"btn-active":""}`} type="button" onClick={() => updateBinSize(60)}>
          {" "}
          60
        </button>
      </div>
      <h3>Bird Classes</h3>
      <div>

        <button className={`btn-add ${checker(groupVariables,["AgeClass"])?"btn-active":""}`} type="button" onClick={() => variableChecker(groupVariables,"AgeClass")}>
          Age
        </button>

        <button className={`btn-add ${checker(groupVariables,["SexClass"])?"btn-active":""}`} type="button" onClick={() => variableChecker(groupVariables,"SexClass")}>
          Sex
        </button>

       
      </div>
      <h3>Regions</h3> <button className="btn-remove" type="button" onClick={()=>setSelectedStations([])}>remove all</button>
      <div>
        {regions_data.map(region=>{
          return(
            <button className={`btn-add ${checker(selectedStations,region.stations)?"btn-active":""}`} type="button" onClick={() => regionChecker(selectedStations, region.stations)}>
            {region.region}
          </button>
  
          )
        })}

      </div>


      <h3>Stations</h3> <button className="btn-remove" type="button" onClick={()=>setSelectedStations([])}>remove all</button>
      <div>
        {stations.map(stat=>{
          return(
            <button className={`btn-add ${checker(selectedStations,[stat])?"btn-active":""}`} type="button" onClick={() => stationChecker(selectedStations, stat)}>
            {stat}
          </button>
  
          )
        })}

      </div>
    </div>
  );
}

export default App;
