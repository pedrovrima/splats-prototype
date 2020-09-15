import functions from "./index";
import effortPlots from "./effort_plot";
import splatsPlots from "./splats_plot";
import { default_dimensions } from "./plot_parts";

const { createEffort, updateEffort } = effortPlots;
const { createSplats, updateSplats } = splatsPlots;

const container_dimensions = (width = 1000, height = 400) => {
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

function createPlot(divId, d3Data, effDiv,yHook) {
  const c_dimension = container_dimensions();
  const dimensions = plot_dimensions(c_dimension, margins());
  

  

  createEffort(d3Data.effortData, effDiv, default_dimensions);
  createSplats(divId, d3Data, dimensions,yHook);
}

const updateStatic= async(divId, d3Data, effDiv,yHook)=> {

  
   
  updateEffort(d3Data.effortData, effDiv, default_dimensions);

  updateSplats(divId, d3Data, default_dimensions,yHook);
  return("")
}

export default { createPlot, updateStatic };
