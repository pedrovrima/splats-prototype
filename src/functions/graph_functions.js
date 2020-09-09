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

function createPlot(divId, data, variables, effort_data, binSize, effDiv) {
  const c_dimension = container_dimensions();
  const dimensions = plot_dimensions(c_dimension, margins());
  const bins =         functions.createBins(365, binSize)
  


  const d3Data = functions.newCreateD3(data, variables, effort_data, bins);

  createEffort(d3Data.effortData, effDiv, default_dimensions);
  createSplats(divId, d3Data, dimensions);
}

const updateStatic= async(divId, data, variables, effort_data, binSize, effDiv)=> {
  const bins =         functions.createBins(365, binSize)

   const newd3Data = await Promise.all([functions.newCreateD3(data, variables, effort_data, bins)]);
  
   
  updateEffort(newd3Data[0].effortData, effDiv, default_dimensions);

  updateSplats(divId, newd3Data[0], default_dimensions);
  return("")
}

export default { createPlot, updateStatic };
