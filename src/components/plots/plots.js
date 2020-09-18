import React, { useRef, useEffect, useState } from "react";
import useDidMountEffect from "../../functions/didMountHook";
import plot_functions from "../../functions/completePlotFunction";


const Plots = (props) => {
  let { plotData,setBinSize,i,variables} = props;

  const splatsRef = useRef(null);
  const effortRef = useRef(null);


  const [showEffort, setShowEffort] = useState(false);



  useDidMountEffect(()=>{
    plot_functions.updatePlot(
      plotData,
      splatsRef.current,

      effortRef.current,
i,variables    )
  },[plotData,variables])

  useEffect(() => {
    if (splatsRef.current) {
      plot_functions.createPlot(
        plotData,
        splatsRef.current,
        
        effortRef.current,
        i,
        variables
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
