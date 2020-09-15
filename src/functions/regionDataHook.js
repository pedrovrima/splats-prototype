import React, { useState, useEffect } from "react";
import { data, binProcessing, groupProcessing } from "./dataProcessing";
import { regions } from "../data/regions";

const DataHook = (props) => {


console.log(data)
  const [groupedData, setGroupedData] = useState(groupProcessing(data, ["AgeClass","SexClass"], "change"))
  const [regionsData, setRegionsData] = useState(
    regions.map((reg) => binProcessing(groupedData, reg.region, 10))
  );




  const changeGroups = (groups) => {
    const groupped_data = groupProcessing(data, groups)
    setGroupedData(groupped_data);
    setRegionsData(regions.map((reg) => binProcessing(groupped_data,reg.region,10)));
  };

  const changeInRegion = (region, bin,stations) => {
    const regionIndex=Object.keys(groupedData.groupped_data).indexOf(region)
    const region_data=binProcessing(groupedData, region, bin,stations);
    console.log(Object.keys(groupedData))
    const new_regionData = [...regionsData.slice(0,regionIndex),region_data,...regionsData.slice(regionIndex+1)]
   console.log(new_regionData)
    setRegionsData(new_regionData)
  };

  return { regionsData, changeGroups,changeInRegion };
};

export default DataHook;
