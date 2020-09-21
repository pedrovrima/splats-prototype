import React, { useRef, useEffect, useState } from "react";
import useDidMountEffect from "../../functions/didMountHook";
import plot_functions from "../../functions/completePlotFunction";

const Plots = (props) => {
  let { plotData, setBinSize, i, variables, maxYHook } = props;

  const splatsRef = useRef(null);
  const effortRef = useRef(null);

  const [showEffort, setShowEffort] = useState(false);
  const [changeY, setChangeY] = useState(0);

  



  useDidMountEffect(() => {
    if(maxYHook.fixedY){
    plot_functions.updatePlot(
      plotData,
      splatsRef.current,

      effortRef.current,
      i,
      variables,
      maxYHook
    );
  }
  }, [ maxYHook.yMax]);




  useDidMountEffect(() => {
    plot_functions.updatePlot(
      plotData,
      splatsRef.current,

      effortRef.current,
      i,
      variables,
      maxYHook
    );
  }, [plotData, variables, maxYHook.fixedY]);

  useEffect(() => {
    if (splatsRef.current) {
      plot_functions.createPlot(
        plotData,
        splatsRef.current,

        effortRef.current,
        i,
        variables,
        maxYHook
        // yMax
      );
    }
  }, []);

  return (
    <>
      <div ref={splatsRef} id="graph" />
      <div
        ref={effortRef}
        className={`${showEffort ? "" : "hidden"}`}
        id="graph"
      />{" "}
      <button
        className="btn-add-flex"
        onClick={() => {
          setShowEffort(!showEffort);
        }}
      >
        {showEffort ? "Hide" : "Show"} effort
      </button>
    </>
  );
};

export default Plots;
