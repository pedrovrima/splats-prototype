import functions from "./index";
import effortPlots from "./effort_plot";
import splatsPlots from "./splats_plot";
import { default_dimensions } from "./plot_parts";
import varPlots from "./var_plots"
const { createEffort, updateEffort } = effortPlots;
const { createSplats, updateSplats } = splatsPlots;
const {createVariable, updateVariable} = varPlots;

const container_dimensions = (width = 800, height = 300) => {
  return { width, height };
};
const margins = (top = 10, bottom = 30, left = 60, right = 60) => {
  return { top, bottom, left, right };
};

const plot_dimensions = (container_dimensions, margins) => {
  return {
    width: container_dimensions.width - margins.left - margins.right,
    height: container_dimensions.height - margins.bottom - margins.top,
    margins,
  };
};

function createPlot(splatRef, varRef, effRef, plotData,yHook ) {
  const c_dimension = container_dimensions();
  const dimensions = plot_dimensions(c_dimension, margins());
  


  createEffort(effRef,plotData.effortData,  default_dimensions);
  createSplats(splatRef, plotData.splats, dimensions,yHook);
  createVariable(varRef,plotData.vari,dimensions,yHook)
}

const updateStatic= async(splatRef, varRef, effRef, plotData, yHook)=> {

  
   
  updateEffort(effRef,plotData.effortData, default_dimensions);

  updateSplats(splatRef, plotData.splats, default_dimensions,yHook);
  updateVariable(varRef, plotData.vari, default_dimensions,yHook);

  return("")
}

export default { createPlot, updateStatic };
