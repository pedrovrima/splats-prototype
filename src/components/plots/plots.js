import React, { useRef, useEffect, useState } from "react";
import useDidMountEffect from "../../functions/didMountHook";
import plot_functions from "../../functions/graph_functions";

const Plots = (props) => {
  console.log(props);
  let { capture_data, effortData, binSize, groupVariables } = props;

  const splatsRef = useRef(null);
  const effortRef = useRef(null);

  const [showEffort, setShowEffort] = useState(false);
  let [loading,setLoading]=useState(false)

  const setLoadingIntercept = (state)=>{
    console.log("setting",state)
    
    setLoading(state)
    console.log(loading)
  }

  const asyncSetPlot = async()=>{
    setLoadingIntercept(!loading)
  await Promise.all([plot_functions.updateStatic(
      splatsRef.current,
      capture_data,
      groupVariables.sort(),
      effortData,
      binSize,
      effortRef.current
    )]).then(()=>{
      console.log("I waited")
      setLoadingIntercept(false)
    })


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
      <div 
      style={{ position:"relative" }}
      >
        <div ref={splatsRef} id="graph"/>
        <div
          ref={effortRef}
          className={`${showEffort ? "" : "hidden"}`}
          id="graph"
        />
          {" "}

        <div
          style={{
            position: "absolute",
            top: 0,
            height: "100%",
            width: "100%",
            zIndex: 999,
            backgroundColor: "blue",
            opacity:.25
          }}
          className={`${loading?"":"hidden"}`}
        ></div>
      </div>
      <button
        className="btn-add-flex"
        onClick={() => setShowEffort(!showEffort)}
      >
        {showEffort ? "Hide" : "Show"} effort
      </button>
    </>
  );
};

export default Plots;
