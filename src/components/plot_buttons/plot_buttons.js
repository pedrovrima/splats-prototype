import React, { useState } from "react";
import { regions } from "../../data/regions";
const PlotButtons = (props) => {
  let {
    i,
    updateBinSize,
    binSize,
    region,
    selectedStations,
    stationFuncs,
  } = props;

  const stations = region
    ? regions.filter((reg) => reg.region === region)[0].stations
    : regions.reduce((cont,reg)=>[...cont,...reg.stations],[]);
  console.log(region, selectedStations);
  const [activeMenu, setActiveMenu] = useState("");
  const checker = (arr, target) => target.every((v) => arr.includes(v));

  const stationChecker = (stations, station_name) => {
    stations.indexOf(station_name) < 0
      ? stationFuncs.addStation(i, station_name)
      : stationFuncs.removeStation(i, station_name);
  };

  return (
    <>
      <div className="grid grid-cols-2 ">
        <div className="col-span-1 flex justify-center">
          <button
            className={` ${
              activeMenu === "stations" ? "btn-top-active" : ""
            } btn-top-add`}
            onClick={() => {
              if (activeMenu === "stations") {
                setActiveMenu("");
              } else {
                setActiveMenu("stations");
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
              if (activeMenu === "bins") {
                setActiveMenu("");
              } else {
                setActiveMenu("bins");
              }
            }}
          >
            Bins{" "}
          </button>
        </div>
      </div>
      <div>
        <div
          className={`m-2 p-4 w-full h-64 overflow-y-scroll  ${
            activeMenu === "stations" ? "" : "hidden"
          }`}
        >
          {stations.map((stat) => (
            <button
              key={stat}
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
          className={`m-2 p-4 w-full  ${
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
