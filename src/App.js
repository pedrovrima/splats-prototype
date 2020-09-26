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
import Modal from "./components/modal";
import NewPlot from "./components/new_plot";

// const d3 = require("d3");
function App() {
  const [modal, setModal] = useState(false);
  const dHook = DataHook();

  useEffect(() => {
    dHook.addPlot("HOME");
  }, []);

  let [groupVariables, setGroupVariables] = useState(["AgeClass", "SexClass"]);

  let [plot_variable, setPlotVariable] = useState("Weight");

  // const click = function () {
  //   const svg = d3.select("svg");

  //   var svgString = saver.getSVGString(svg.node());
  //   saver.svgString2Image(svgString, 2 * 1000, 2 * 400, "png", save); // passes Blob and filesize String to the callback

  //   function save(dataBlob, filesize) {
  //     saveAs(dataBlob, "D3 vis exported to PNG.png"); // FileSaver.js function
  //   }
  // };

  return (
    <div className="bg-gray-200 min-h-screen w-full ">
      <Modal active={modal} dHook={dHook} setModal={setModal}></Modal>

      <NavBar
        maxYHook={dHook.maxYHook}
        variables={groupVariables}
        setVariables={setGroupVariables}
        setPlotVariable={setPlotVariable}
      ></NavBar>
      <div className="flex flex-col items-center">
        <div className="flex flex-col   w-10/12 items-center">
          <p className="text-6xl font-extrabold">SWTH</p>
          <Container DataHook={dHook} variables={groupVariables} plot_variable={plot_variable}></Container>
          <NewPlot setModal={setModal}></NewPlot>
        </div>
        {/* <button


type="button"
          className={"btn-add-flex"}
          onClick={() => click()}
        >
          Download
        </button>
      </div> */}
      </div>
    </div>
  );
}

export default App;
