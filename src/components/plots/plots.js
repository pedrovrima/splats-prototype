import React, { useRef, useEffect, useState } from "react";
import useDidMountEffect from "../../functions/didMountHook";
import plot_functions from "../../functions/graph_functions";

const Plots = (props) => {
  let { plotData, yMax } = props;

  const splatsRef = useRef(null);
  const effortRef = useRef(null);


  const [showEffort, setShowEffort] = useState(false);



  useDidMountEffect(()=>{
    plot_functions.updateStatic(
      splatsRef.current,
      plotData,
      effortRef.current,
      yMax
    )
  },[plotData,yMax])

  useEffect(() => {
    if (splatsRef.current) {
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
