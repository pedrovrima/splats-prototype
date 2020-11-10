import React, { useRef, useEffect, useState } from "react";
import useDidMountEffect from "../../functions/didMountHook";
import plot_functions from "../../functions/completePlotFunction";

const Plots = (props) => {
  let {
    plotData,
    setBinSize,
    i,
    variables,
    maxYHook,
    plot_variable,
    hyCollapse,
    ahyCollapse,
    data
  } = props;

  const splatsRef = useRef(null);
  const effortRef = useRef(null);
  const variablesRef = useRef(null);
  const abundRef = useRef(null);

  const [showEffort, setShowEffort] = useState(false);
  const [showVariable, setShowVariable] = useState(false);
  const [showAbundance, setShowAbundance] = useState(false);

  const [changeY, setChangeY] = useState(0);

  useDidMountEffect(() => {
    if (maxYHook.fixedY) {
      plot_functions.updatePlot(
        plotData,
        data,
        splatsRef.current,
        variablesRef.current,

        effortRef.current,
        abundRef.current,
        i,
        variables,
        maxYHook,
        plot_variable,
        hyCollapse,
        ahyCollapse
      );
    }
  }, [maxYHook.yMax]);

  useDidMountEffect(() => {
    plot_functions.updatePlot(
      plotData,
      data,
      splatsRef.current,
      variablesRef.current,

      effortRef.current,
      abundRef.current,

      i,
      variables,
      maxYHook,
      plot_variable,
      hyCollapse,
      ahyCollapse
    );
  }, [plotData, variables, maxYHook.fixedY, plot_variable,    hyCollapse,
    ahyCollapse,
]);

  useEffect(() => {
    if (splatsRef.current) {
      plot_functions.createPlot(
        plotData,
        data,
        splatsRef.current,
        variablesRef.current,

        effortRef.current,  
        abundRef.current,

        i,
        variables,
        maxYHook,
        plot_variable,
        hyCollapse,
        ahyCollapse
      );
    }
  }, []);

  return (
    <>
      <div ref={splatsRef} id="graph" />
      <div
        className={`${showVariable ? "" : "hidden"}`}
        ref={variablesRef}
        id="vari"
      ></div>
            <div
        className={`${showAbundance ? "" : "hidden"}`}
        ref={abundRef}
        id="abund"
      ></div>

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
      <button
        className="btn-add-flex"
        onClick={() => {
          setShowAbundance(!showAbundance);
        }}
      >
        {showAbundance? "Hide" : "Show"} abundance
      </button>

      <button
        className="btn-add-flex"
        onClick={() => {
          setShowVariable(!showVariable);
        }}
      >
        {showVariable ? "Hide" : "Show"} variable
      </button>


    </>
  );
};

export default Plots;
