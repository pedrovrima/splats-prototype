import dataFuncs from "./newDataProcessing";
import plot_functions from "./graph_functions";
import data from "./effort_capture_joinner";

const createPlot = (
  plotInfo,
  splatRef,
  varRef,
  effRef,
  abdRef,
  i,
  variables,
  maxYHook,
  variable_name,
  hyCollapse,
  ahyCollapse
) => {
  const { yMax, fixedY, changeYMaxes } = maxYHook;
  const { stations, binSize } = plotInfo;
  const plotData = dataFuncs.plotFullProcessing(
    data,
    binSize,
    stations,
    variables,
    variable_name,
    hyCollapse,
    ahyCollapse
  );
  changeYMaxes(plotData.yMax, i);
  const maxValue = fixedY ? yMax : plotData.yMax;

  plot_functions.createPlot(splatRef, varRef, effRef,  abdRef, plotData, maxValue);
};

const updatePlot = (
  plotInfo,
  splatRef,
  varRef,
  effRef,
  abdRef,
  i,
  variables,
  maxYHook,
  variable_name,
  hyCollapse,
  ahyCollapse
) => {
  const { yMax, fixedY, changeYMaxes } = maxYHook;
  const { stations, binSize } = plotInfo;

  const plotData = dataFuncs.plotFullProcessing(
    data,
    binSize,
    stations,
    variables,
    variable_name,
    hyCollapse,
    ahyCollapse
  );

  changeYMaxes(plotData.yMax, i);
  const maxValue = fixedY ? yMax : plotData.yMax;

  plot_functions.updateStatic(splatRef, varRef, effRef,  abdRef, plotData, maxValue);
};

export default { createPlot, updatePlot };
