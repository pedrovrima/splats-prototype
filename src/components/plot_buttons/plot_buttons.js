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
    regionFuncs
  } = props;


  



  const setStations = (region) => {
    return region
      ? regions.filter((reg) => reg.region === region)[0].stations
      : [];
  };

  const flatten = (arr) => arr.reduce((cont, arr) => [...cont, ...arr], []);

  const allStations = regions.reduce((cont, reg) => [...cont, ...reg.stations],[])

  const regionStations = flatten(region.map((reg) => setStations(reg)));
  const [activeMenu, setActiveMenu] = useState("");
  const checker = (arr, target) => target.every((v) => arr.includes(v));

  const stationChecker = (stations, station_name) => {
    stations.indexOf(station_name) < 0
      ? stationFuncs.addStation(i, station_name)
      : stationFuncs.removeStation(i, station_name);
  };


  const regionChecker = (regions, this_regions) => {
    regions.indexOf(this_regions) < 0
      ? regionFuncs.addRegion(i, this_regions)
      : regionFuncs.removeRegion(i, this_regions);
  };



  return (
    <>
      <div className="grid grid-cols-3 ">
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

        <div className="col-span-1 flex justify-center">
          <button
            className={`${
              activeMenu === "regions" ? "btn-top-active" : ""
            } btn-top-add`}
            onClick={() => {
              if (activeMenu === "regions") {
                setActiveMenu("");
              } else {
                setActiveMenu("regions");
              }
            }}
          >
            Regions{" "}
          </button>
        </div>
      </div>
      <div>
        <div
          className={`m-2 p-4 w-full h-64 overflow-y-scroll  ${
            activeMenu === "regions" ? "" : "hidden"
          }`}
        >
          {regions.map((reg) => (
            <button
              key={reg.region}
              className={`btn-add ${
                checker(region, [reg.region]) ? "btn-active" : ""
              }`}
              type="button"
              onClick={() => regionChecker(region, reg.region)}
            >
              {reg.region}
            </button>
          ))}
        </div>
        <div
          className={`m-2 p-4 w-full h-64 overflow-y-scroll  ${
            activeMenu === "stations" ? "" : "hidden"
          }`}
        >

          {
            region.map(reg=>(
              <>
            <h3 className="ml-0 mt-2 mb-1  text-gray-900">{reg}</h3>
              {setStations(reg).sort().map((stat) => (
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
              </>
            ))
          }
            <h3 className="ml-0 mt-2 mb-1  text-gray-900">Other Stations</h3>

          {

          allStations.sort().map((stat) => {
            if(regionStations.indexOf(stat)<0)
            {return (
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
          )}})}
        </div>

        <div
          className={`m-2 p-4 w-full  ${activeMenu === "bins" ? "" : "hidden"}`}
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
