import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { effort_data } from "./data/effort";
import { capture_data } from "./data/capture";
import functions from "./functions";
import plot_functions from "./functions/graph_functions";
import regions_data from "./data/regions";
import { saveSvgAsPng } from "save-svg-as-png";
import { saveAs } from "file-saver";
import saver from "./svg_download";
import Container from "./components/plot_container";
import useDidMountEffect from "./functions/didMountHook";
import yHook from "./functions/maxYHook";
import dataHook from "./functions/regionDataHook";

const d3 = require("d3");
function App() {

  const { regionsData, changeGroups, changeInRegion } = dataHook();

  const getYmax = (data) => data.map((datum) => datum.yMax);

  const [yMaxes, setYMaxes] = useState(getYmax(regionsData));
  const [yMax, setYMax] = useState(Math.max(...yMaxes));
  const [iCalc, setICalc] = useState(0);
  const [fixedY,setFixedY]=useState(false)
  const setObjY = (yMaxes, key, val) => {
    setYMaxes({ ...yMaxes, [key]: val });
  };

  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);

  useDidMountEffect(() => {
    changeGroups(groupVariables);
  }, [groupVariables]);



  useDidMountEffect(() => {
    setYMaxes(getYmax(regionsData));
  }, [regionsData]);



  useDidMountEffect(() => {
    setYMax(Math.max(...yMaxes));
  }, [yMaxes]);





  const checker = (arr, target) => target.every((v) => arr.includes(v));

  const variableChecker = (selectedVars, variable) => {
    selectedVars.indexOf(variable) < 0
      ? setGroupVariables([...selectedVars, variable])
      : setGroupVariables(selectedVars.filter((stat) => stat !== variable));
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
<label 
    htmlFor="toogleA"
    className="flex items-center cursor-pointer"
  >
    <div class="relative">
      <input id="toogleA" onClick={()=>setFixedY(!fixedY)} type="checkbox" class="hidden" />
      <div
        className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"
      ></div>
      <div
        className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"
      ></div>
    </div>
    <div
      className="ml-3 text-gray-700 font-medium"
    >
      Toggle Me!
    </div>
  </label>      <button className="btn-add" onClick={() => changeInRegion("COAST",30)}>
        yMax
      </button>
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
        {regions_data.regions.map((reg, i) => {
          if (reg.region !== "DUNE") {
            return (
              <Container
                key={reg.region}
                this_region_data={reg}
                effort_data={effort_data}
                capture_data={capture_data}
                groupVariables={groupVariables}
                fixedY={fixedY}
                maxYHook={{ yMaxes, setObjY }}
                yMaxes={yMaxes}
                i={i}
                yMax={yMax}
                iCalc={iCalc}
                setICalc={setICalc}
                total={regions_data.length - 1}
                plotData={regionsData[i]}
                binChange = {(bin,stations)=>changeInRegion(reg.region,bin,stations)}
              ></Container>
            );
          } else {
            return;
          }
        })}
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
