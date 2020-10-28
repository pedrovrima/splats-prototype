import React, { useRef } from "react";
import { saveSvgAsPng } from "save-svg-as-png";
import { saveAs } from "file-saver";
import saver from "../../svg_download";
import plot_functions from "../../functions/completePlotFunction";
import createDownloadPlot from "../../functions/createDownloadPlot";

const d3 = require("d3");
const click = async function (
  e,
  plotInfo,
  fakePlot,
  variables,
  maxYHook,
  plot_variable,
  hyCollapse,
  ahyCollapse
) {
  d3.select("#fake").selectAll("svg").remove();

  e.preventDefault();
  createDownloadPlot(
    plotInfo,
    fakePlot,
    variables,
    maxYHook,
    plot_variable,
    hyCollapse,
    ahyCollapse,
    "splats"
  );

    const svg_div = d3.select("#fake");

    const svg = svg_div.node().childNodes[0];
    var svgString = saver.getSVGString(svg);
    saver.svgString2Image(svgString, 2 * 1000, 2 * 400, "png", save); // passes Blob and filesize String to the callback
  function save(dataBlob, filesize) {
    saveAs(dataBlob, "D3 vis exported to PNG.png"); // FileSaver.js function
  }
};

const DownloadButtons = (props) => {
  const {
    plotInfo,
    variables,
    maxYHook,
    plot_variable,
    hyCollapse,
    ahyCollapse,
  } = props;
  const fakePlot = useRef();

  const { stations, binSize } = plotInfo;

  return (
    <>
      <div ref={fakePlot} id="fake" className="hidden"></div>
      <button
        className={`btn-add `}
        type="button"
        onClick={(e) =>
          click(
            e,
            plotInfo,
            fakePlot,
            variables,
            maxYHook,
            plot_variable,
            hyCollapse,
            ahyCollapse
          )
        }
      >
        {" "}
        SPLATs
      </button>
    </>
  );
};
export default DownloadButtons;
