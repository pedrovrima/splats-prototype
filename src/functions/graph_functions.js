import functions from "./index";
import effortPlots from "./effort_plot";
import splatsPlots from "./splats_plot";
import { default_dimensions } from "./plot_parts";
import varPlots from "./var_plots"
const { createEffort, updateEffort } = effortPlots;
const { createSplats, updateSplats } = splatsPlots;
const {createVariable, updateVariable} = varPlots;

const container_dimensions = (width = 800, height = 500) => {
  return { width, height };
};
const margins = (dimensions) => {
  return { top:dimensions.height*0.03, bottom:dimensions.height*0.1, left:dimensions.width*0.1, right:dimensions.width*0.1 };
};

const plot_dimensions = (container_dimensions, margins) => {

  return {
    width: container_dimensions.width - margins.left - margins.right,
    height: container_dimensions.height - margins.bottom - margins.top,
    margins,
  };
};

function createPlot(splatRef, varRef, effRef, abundRef,plotData,yHook ) {
  const c_dimension = container_dimensions(splatRef.clientWidth);
  const dimensions = plot_dimensions(c_dimension, margins(c_dimension));
  
  console.log(plotData.effortData)

  createEffort(abundRef,plotData.abundanceData,dimensions,"abund")
  createEffort(effRef,plotData.effortData,  dimensions,"eff");
  createSplats(splatRef, plotData.splats, dimensions,yHook);
  createVariable(varRef,plotData.vari,dimensions,yHook)
}

const updateStatic= async(splatRef, varRef, effRef,abundRef, plotData, yHook)=> {
  const c_dimension = container_dimensions(splatRef.clientWidth);
  const dimensions = plot_dimensions(c_dimension, margins(c_dimension));

  

  updateEffort(effRef,plotData.effortData, dimensions,"eff");
  updateEffort(abundRef,plotData.abundanceData,dimensions,"abund")

  updateSplats(splatRef, plotData.splats, dimensions,yHook);
  updateVariable(varRef, plotData.vari, dimensions,yHook);

  return("")
}

export default { createPlot, updateStatic };
