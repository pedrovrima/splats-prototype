import React,{useRef, useEffect,useState} from 'react';
import './App.css';
import effort_data from "./data/effort"
import capture_data from "./data/capture"
import {createPlot,  updateData} from "./functions"

function App() {
  let [binSize,setBinSize]=useState(10)
  let refs = useRef(null)
  const updateBinSize=(bin)=>{
    setBinSize(bin);}

    const createBins = (max, size) => {
      let number_of_bins = Math.ceil(max / size);
      let bins = [];
      for (let i = 0; i < number_of_bins; i++) {
        bins.push(5 + i * size);
      }
      return bins;
    };
    
    useEffect(()=>{
      updateData(refs.current, capture_data

        ,
        ["AgeClass","SexClass"],
        
          effort_data
        ,
        createBins(365, binSize      ))
    },[binSize])
  
  useEffect(
    () => {
      if (refs.current) {

        createPlot(refs.current, capture_data

        ,
        ["AgeClass","SexClass"],
        
          effort_data
        ,
        createBins(365, binSize)      )

    }},[])
  
  return (<div>
    <h1 style={{margin:"10px"}}>{`SWTH/COAST bin size=${binSize}`}</h1>
        <div ref={refs}> </div>
        <button type="button" onClick={()=>updateBinSize(5)}> Bin Size=5</button>
        <button type="button" onClick={()=>updateBinSize(10)}> Bin Size=10</button>
        <button type="button" onClick={()=>updateBinSize(15)}> Bin Size=15</button>
        <button type="button" onClick={()=>updateBinSize(30)}> Bin Size=30</button>
        <button type="button" onClick={()=>updateBinSize(45)}> Bin Size=45</button>
        <button type="button" onClick={()=>updateBinSize(60)}> Bin Size=60</button>
        </div>
  );
}

export default App;
