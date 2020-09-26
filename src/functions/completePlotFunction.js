  import dataFuncs from "./newDataProcessing";
import plot_functions from "./graph_functions";
import data from "./effort_capture_joinner";

const createPlot = (plotInfo, splatRef,varRef, effRef, i, variables, maxYHook,variable_name) => {
  console.log(dataFuncs)
  const { yMax, fixedY, changeYMaxes } = maxYHook;
  const { stations, binSize } = plotInfo;
  const plotData = dataFuncs.plotFullProcessing(data, binSize, stations, variables,variable_name);
  changeYMaxes(plotData.yMax, i);
  const maxValue = fixedY ? yMax : plotData.yMax;

  plot_functions.createPlot(splatRef, varRef, effRef, plotData, maxValue);
};

const updatePlot = (plotInfo, splatRef,varRef, effRef, i, variables, maxYHook,variable_name) => {
  const { yMax, fixedY, changeYMaxes } = maxYHook;
  const { stations, binSize } = plotInfo;

  const plotData = dataFuncs.plotFullProcessing(data, binSize, stations, variables,variable_name);

  changeYMaxes(plotData.yMax, i);
  const maxValue = fixedY ? yMax : plotData.yMax;

  plot_functions.updateStatic(splatRef, varRef, effRef, plotData, maxValue);
};




export default { createPlot, updatePlot };
