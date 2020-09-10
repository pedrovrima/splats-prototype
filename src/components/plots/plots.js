import React, { useRef, useEffect, useState } from "react";
import useDidMountEffect from "../../functions/didMountHook";
import plot_functions from "../../functions/graph_functions";

const Plots = (props) => {
  let { plotData, yMax,drawPlot } = props;

  const splatsRef = useRef(null);
  const effortRef = useRef(null);

  const [showEffort, setShowEffort] = useState(false);

  const asyncSetPlot = async () => {
    await Promise.all([
      plot_functions.updateStatic(
        splatsRef.current,
        plotData,
        effortRef.current,
        yMax
      ),
    ]);
  };

  useDidMountEffect(() => {
    if(drawPlot){
    asyncSetPlot()};
  }, [plotData,yMax]);

  useEffect(() => {
    if (splatsRef.current && drawPlot) {
      plot_functions.createPlot(
        splatsRef.current,
        plotData,
        effortRef.current,
        yMax
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
