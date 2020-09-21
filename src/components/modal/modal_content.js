import React from "react";
import regions from "../../data/regions";

const ModalContent = (props) => {
  const stations = regions.regions
    .map((reg) => reg.stations)
    .flat()
    .sort();


    const {dHook,setModal}=props

  return (
    <div className="grid grid-cols-2  gap-3 h-64 ">
      <div className=" m-1">
        <p className="text-xl font-bold">Regions</p>
              </div>
      <div>
        <p className="text-xl font-bold ">Stations</p>
      </div>
      <div className="border-r-2 overflow-scroll">       {regions.regions.map((reg) => (
          <button onClick={() => {setModal(false);dHook.addByRegion(reg.region)}} className="bg-indigo-600 rounded-lg p-3 proportional-nums text-white m-2">{reg.region}</button>
        ))}
 </div>
      <div className="overflow-scroll">
        {stations.map((stat) => (
          <button onClick={() => {setModal(false);dHook.addPlot(stat)}} className="bg-indigo-600 rounded-lg p-3 proportional-nums text-white m-2">{stat}</button>
        ))}
      </div>
    </div>
  );
};

export default ModalContent;
