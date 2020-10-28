import dataFuncs from "./newDataProcessing";
import data from "./effort_capture_joinner";
import splatsPlots from "./splats_plot";
import effortPlots from "./effort_plot";
const container_dimensions = (width = 800, height = 500) => {
  return { width, height };
};
const margins = (dimensions) => {
  return {
    top: dimensions.height * 0.03,
    bottom: dimensions.height * 0.1,
    left: dimensions.width * 0.1,
    right: dimensions.width * 0.1,
  };
};

const plot_dimensions = (container_dimensions, margins) => {
  return {
    width: container_dimensions.width - margins.left - margins.right,
    height: container_dimensions.height - margins.bottom - margins.top,
    margins,
  };
};

const downloadPlot = (
  plot,
  ref,
  variables,
  maxYHook,
  variable_name,
  hyCollapse,
  ahyCollapse,plotType
) => {
  const { yMax, fixedY, changeYMaxes } = maxYHook;
  const { stations, binSize } = plot;

  const c_dimension = container_dimensions(ref.clientWidth);
  const dimensions = plot_dimensions(c_dimension, margins(c_dimension));

  const plotData = dataFuncs.plotFullProcessing(
    data,
    binSize,
    stations,
    variables,
    variable_name,
    hyCollapse,
    ahyCollapse
  );

  const svg = plotType==="splats"?splatsPlots.createSplats(
    ref.current,
    plotData.splats,
    dimensions,
    yMax,
    600
  ):effortPlots.createEffort(    ref.current,
plotData.effortData,    dimensions,
"eff",600)
    const now = new Date()
    const text_data = [`Bin Size:${binSize} days`,`Regions:${plot.regions}`,`Date: ${now.toLocaleDateString()} ${now.getHours()}:${now.getMinutes()}`]

  svg.selectAll("extrinfo")
    .data(text_data)
    .enter()
    .append("text")
    .attr("x", dimensions.width + dimensions.margins.left+ dimensions.margins.right+100)
    .attr("y", function (d, i) {
      return 105 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "black")
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("class", "teste")
    .attr("font-family", "Arial, Helvetica, sans-serif");
};

export default downloadPlot;
