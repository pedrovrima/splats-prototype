import plotDataProcessing from "./newDataProcessing";
import plot_functions from "./graph_functions";
import data from "./effort_capture_joinner";

const createPlot = (plotInfo, splatRef, effRef, i, variables, maxYHook) => {
  
  const { yMax, fixedY, changeYMaxes } = maxYHook;
  const { stations, binSize } = plotInfo;
  const plotData = plotDataProcessing(data, binSize, stations, variables);
  changeYMaxes(plotData.yMax, i);
  const maxValue = fixedY ? yMax : plotData.yMax;

  plot_functions.createPlot(splatRef, plotData, effRef, maxValue);
};

const updatePlot = (plotInfo, splatRef, effRef, i, variables, maxYHook) => {
  const { yMax, fixedY, changeYMaxes } = maxYHook;
  const { stations, binSize } = plotInfo;

  const plotData = plotDataProcessing(data, binSize, stations, variables);

  changeYMaxes(plotData.yMax, i);
  const maxValue = fixedY ? yMax : plotData.yMax;

  plot_functions.updateStatic(splatRef, plotData, effRef, maxValue);
};

export default { createPlot, updatePlot };
