import React, { useState } from "react";

const PlotButtons = (props) => {
  let {
    updateBinSize,
    binSize,
    stations,
    selectedStations,
    setSelectedStations,
  } = props;
  const [activeMenu, setActiveMenu] = useState("");
  const [open,setOpen]=useState(false)
  const checker = (arr, target) => target.every((v) => arr.includes(v));

  const stationChecker = (stations, station_name) => {
    stations.indexOf(station_name) < 0
      ? setSelectedStations([...stations, station_name])
      : setSelectedStations(stations.filter((stat) => stat !== station_name));
  };

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="col-span-1 flex justify-center">
          <button
            className={` ${
              activeMenu === "stations"   ? "btn-top-active" : ""
            } btn-top-add`}
            onClick={() => {
                    if(activeMenu==="stations"){
                      setActiveMenu("")

                    }else{
                      
                      setActiveMenu("stations")
                    }
          }}
          >
            Stations{" "}
          </button>
        </div>

        <div className="col-span-1 flex justify-center">
          <button
            className={`${
              activeMenu === "bins" ? "btn-top-active" : ""
            } btn-top-add`}
            onClick={() => {
              if(activeMenu==="bins"){setActiveMenu("")}else{
                setActiveMenu("bins")
              }
    }}          >
            Bins{" "}
          </button>
        </div>
      </div>
      <div>
        <div
          className={`m-2 p-6 w-full  ${
            activeMenu === "stations" ? "" : "hidden"
          }`}
        >
          {stations.map((stat) => (
            <button
              className={`btn-add ${
                checker(selectedStations, [stat]) ? "btn-active" : ""
              }`}
              type="button"
              onClick={() => stationChecker(selectedStations, stat)}
            >
              {stat}
            </button>
          ))}
        </div>

        <div
          className={`m-2 p-6 flex justify-between ${
            activeMenu === "bins" ? "" : "hidden"
          }`}
        >
          <button
            className={`btn-add ${binSize === 5 ? "btn-active" : ""}`}
            type="button"
            onClick={() => updateBinSize(5)}
          >
            {" "}
            5
          </button>
          <button
            className={`btn-add ${binSize === 10 ? "btn-active" : ""}`}
            type="button"
            onClick={() => updateBinSize(10)}
          >
            {" "}
            10
          </button>
          <button
            className={`btn-add ${binSize === 15 ? "btn-active" : ""}`}
            type="button"
            onClick={() => updateBinSize(15)}
          >
            {" "}
            15
          </button>
          <button
            className={`btn-add ${binSize === 30 ? "btn-active" : ""}`}
            type="button"
            onClick={() => updateBinSize(30)}
          >
            {" "}
            30
          </button>
          <button
            className={`btn-add ${binSize === 45 ? "btn-active" : ""}`}
            type="button"
            onClick={() => updateBinSize(45)}
          >
            {" "}
            45
          </button>
          <button
            className={`btn-add ${binSize === 60 ? "btn-active" : ""}`}
            type="button"
            onClick={() => updateBinSize(60)}
          >
            {" "}
            60
          </button>
        </div>
      </div>
    </>
  );
};

export default PlotButtons;
