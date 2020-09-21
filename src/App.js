import React, { useRef, useEffect, useState } from "react";
import "./App.css";

import { saveSvgAsPng } from "save-svg-as-png";
import { saveAs } from "file-saver";
import saver from "./svg_download";
import Container from "./components/plot_container";
import useDidMountEffect from "./functions/didMountHook";
import yHook from "./functions/maxYHook";
import DataHook from "./functions/dataHook";
import NavBar from "./components/navbar";
import Modal from "./components/modal"


// const d3 = require("d3");
function App() {
  const dHook = DataHook();
  
  useEffect(() => {
    dHook.addPlot("HOME");
  }, []);

  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);

  // const click = function () {
  //   const svg = d3.select("svg");

  //   var svgString = saver.getSVGString(svg.node());
  //   saver.svgString2Image(svgString, 2 * 1000, 2 * 400, "png", save); // passes Blob and filesize String to the callback

  //   function save(dataBlob, filesize) {
  //     saveAs(dataBlob, "D3 vis exported to PNG.png"); // FileSaver.js function
  //   }
  // };

  return (
    <div className="bg-gray-200 h-full">
      <NavBar
        maxYHook={dHook.maxYHook}
        variables={groupVariables}
        setVariables={setGroupVariables}
      ></NavBar>

      <Container DataHook={dHook} variables={groupVariables}></Container>

      <button type="button" onClick={() => dHook.addPlot("PARK")}>
        PARK
      </button>
      <button type="button" onClick={() => dHook.addByRegion("COAST")}>
        COAST
      </button>

      {/* <button


type="button"
          className={"btn-add-flex"}
          onClick={() => click()}
        >
          Download
        </button>
      </div> */}
      <Modal active="true"></Modal>
    </div>
  );
}

export default App;
