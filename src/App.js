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
import yHook from "./functions/maxYHook";

const d3 = require("d3");

function App() {
  const [yMax, setObjMax] = yHook();

  const [yMaxes,setYMaxes] = useState({})
  const [iCalc,setICalc]=useState(0)

  const setObjY = (yMaxes,key,val)=>    {
    console.log(yMaxes,key)
    setYMaxes({...yMaxes,[key]:val})}

useEffect(()=>setObjMax(yMaxes),[yMaxes])
  

  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);

  const checker = (arr, target) => target.every((v) => arr.includes(v));

  const variableChecker = (selectedVars, variable) => {
    selectedVars.indexOf(variable) < 0
      ? setGroupVariables([...selectedVars, variable])
      : setGroupVariables(selectedVars.filter((stat) => stat !== variable));
  };

  useEffect(() => console.log("here", yMaxes,yMax), [yMax]);
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
      <button className="btn-add" onClick={() => alert(yMax)}>
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
        {regions_data.map((reg, i) => {
          if (reg.region !== "DUNE") {
            return (
              <Container
                key={reg.region}
                this_region_data={reg}
                effort_data={effort_data}
                capture_data={capture_data}
                groupVariables={groupVariables}
                maxYHook={{yMaxes,setObjY}}
                yMaxes={yMaxes}
                i={i}
                yMax={yMax}
                iCalc={iCalc}
                setICalc={setICalc}
                total={regions_data.length-1}
              ></Container>
            );
          }else{
            return
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
