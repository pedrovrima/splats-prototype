import {plotDataProcessing} from "./newDataProcessing"
import plot_functions from "./graph_functions";
import data from "./effort_capture_joinner"


const createPlot = (plotInfo,splatRef,effRef,yMax,variables )=>{
    console.log(splatRef)
    const {stations, binSize}=plotInfo
    const plotData=plotDataProcessing(data, binSize,stations,variables)
    plot_functions.createPlot(
        splatRef,
        plotData,
        effRef,
        plotData.yMax
      );
}



const updatePlot = (plotInfo,splatRef,effRef,yMax,variables)=>{
    const {stations, binSize}=plotInfo

    const plotData=plotDataProcessing(data, binSize,stations,variables)
    plot_functions.updateStatic(
        splatRef,
        plotData,
        effRef,
        yMax
      );

}


export default {createPlot,updatePlot}