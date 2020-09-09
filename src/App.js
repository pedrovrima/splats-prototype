import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import effort_data from "./data/effort";
import capture_data from "./data/capture";
import functions from "./functions";
import plot_functions from "./functions/graph_functions";
import regions_data from "./data/regions";
import { saveSvgAsPng } from "save-svg-as-png";
import { saveAs } from "file-saver";
import saver from "./svg_download";
import Container from "./components/plot_container";
import useDidMountEffect from "./functions/didMountHook";

const d3 = require("d3");

function App() {
  let stations = [...new Set(effort_data.map((eff) => eff.station))].sort();
  let [binSize, setBinSize] = useState(10);
  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);
  let [selectedStations, setSelectedStations] = useState([
    "PARK",
    "JACR",
    "HOME",
    "NAVR",
    "CABL",
    "GATE",
    "GELL",
    "HOUS",
    "KAHN",
    "LEST",
    "MOMA",
    "SAC2",
    "SACR",
    "SHAY",
  ]);
  let [effortData, setEffortData] = useState(
    functions.filterStation(effort_data, selectedStations)
  );
  let [captureData, setCaptureData] = useState(
    functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
  );

  useDidMountEffect(() => {
    setEffortData(functions.filterStation(effort_data, selectedStations));
  }, [selectedStations]);

  let refs = useRef(null);
  let effrefs = useRef(null);

  let buttonRef = useRef(null);
  const updateBinSize = (bin) => {
    setBinSize(bin);
  };

  useEffect(() => {
    setCaptureData(
      functions.filterCaptures(capture_data, functions.getEffortIds(effortData))
    );
  }, [effortData]);

  const checker = (arr, target) => target.every((v) => arr.includes(v));

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

  const regionChecker = (stations, regions) => {
    !checker(stations, regions)
      ? setSelectedStations([...new Set([...stations, ...regions])])
      : setSelectedStations(stations.filter((stat) => !regions.includes(stat)));
  };

  const click = function () {
    const svg = d3.select("svg");

    var svgString = saver.getSVGString(svg.node());
    saver.svgString2Image(svgString, 2 * 1000, 2 * 400, "png", save); // passes Blob and filesize String to the callback

    function save(dataBlob, filesize) {
      saveAs(dataBlob, "D3 vis exported to PNG.png"); // FileSaver.js function
    }
  };

  return (
    <div>
      <div>
        <h1>SWTH</h1>
        <h3>Bird Classes</h3>
      <div>
        <button
          className={`btn-add ${
            checker(groupVariables, ["AgeClass"]) ? "btn-active" : ""
          }`}
          type="button"
          onClick={() => variableChecker(groupVariables, "AgeClass")}
        >
          Age
        </button>

        <button
          className={`btn-add ${
            checker(groupVariables, ["SexClass"]) ? "btn-active" : ""
          }`}
          type="button"
          onClick={() => variableChecker(groupVariables, "SexClass")}
        >
          Sex
        </button>
      </div>
        {regions_data.map((reg) => (
          <Container
            this_region_data={reg}
            effort_data={effort_data}
            capture_data={capture_data}
            binSize={binSize}
            groupVariables={groupVariables}
          ></Container>
        ))}
        <button
          type="button"
          className={"btn-add-flex"}
          onClick={() => click()}
        >
          Download
        </button>

      </div>
  
    </div>
  );
}

export default App;
