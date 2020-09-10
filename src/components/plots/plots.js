import React, { useRef, useEffect, useState } from "react";
import useDidMountEffect from "../../functions/didMountHook";
import plot_functions from "../../functions/graph_functions";

const Plots = (props) => {
  console.log(props);
  let { capture_data, effortData, binSize, groupVariables } = props;

  const splatsRef = useRef(null);
  const effortRef = useRef(null);

  console.log(splatsRef)
  const [showEffort, setShowEffort] = useState(false);

  const asyncSetPlot = async()=>{
  await Promise.all([plot_functions.updateStatic(
      splatsRef.current,
      capture_data,
      groupVariables.sort(),
      effortData,
      binSize,
      effortRef.current
    )])

  }

  useDidMountEffect(() => {
    asyncSetPlot()
  }, [binSize, groupVariables, capture_data]);

  useEffect(() => {
    if (splatsRef.current) {
      plot_functions.createPlot(
        splatsRef.current,
        capture_data,
        groupVariables,

        effortData,
        binSize,
        effortRef.current
      );
    }
  }, []);

  return (
    <>
        <div ref={splatsRef} id="graph"/>
        <div
          ref={effortRef}
          className={`${showEffort ? "" : "hidden"}`}
          id="graph"
        />
          {" "}

      <button
        className="btn-add-flex"
        onClick={() => {setShowEffort(!showEffort)}}
      >
        {showEffort ? "Hide" : "Show"} effort
      </button>
    </>
  );
};

export default Plots;
