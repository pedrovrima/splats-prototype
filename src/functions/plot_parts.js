const d3 = require("d3");


// Container creation

// Dimensions
const container_dimensions = (width = 1000, height = 400) => {
    return { width, height };
  };

//   Margins
  const margins = (top = 10, bottom = 30, left = 60, right = 60) => {
    return { top, bottom, left, right };
  };
  

// All togheter now  
  const plot_dimensions = (container_dimensions, margins) => {
    return {
      container_dimensions, margins,
      width: container_dimensions.width - margins.left - margins.right,
      height: container_dimensions.height - margins.bottom - margins.top,
    };
  };


  const default_dimensions = plot_dimensions(container_dimensions(),margins())
  
  console.log(default_dimensions)
// Colors


const create_color = (groups) => {
    const color = d3
      .scaleOrdinal()
      .domain(groups)
      .range(["#D64B4B", "#D6914B", "#D6D64B", "#4BD74B", "#4BD8D8", "#4C4CD9"]);
    return color;
  };
  



//   Axis


const xAxis = (width) => d3.scaleLinear().domain([0, 365]).range([0, width]);
const yAxis = (y_data, height) =>
  d3
    .scaleLinear()
    .domain([
      0,
      d3.max(y_data, function (d) {
        return +d;
      }) * 1.2,
    ])
    .range([height, 0])
    .nice();


const Axis=(dimensions,y_data)=>{
    return{y:yAxis(y_data,dimensions.height),x:xAxis(dimensions.width)
    }
}    


// Append axis

const addXAxis= (svg,x,height)=>{
    svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "xAxis")
    .call(d3.axisBottom(x).ticks(365 / 5))
      .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
}


const addYAxis=(svg,y)  =>svg
.append("g")
.attr("class", "yAxis")
.call(d3.axisLeft(y));


const addAxis=(svg,axis,height)=>{
    addXAxis(svg,axis.x,height)
    addYAxis(svg,axis.y)

}



const updateYAxis=(svg,axis)=>{
    svg.select("g.yAxis").transition().duration(1000).call(d3.axisLeft(axis.y));

}

// create svg 

const createSvg=(div,dimensions)=> d3
.select(div)
.append("svg")
.attr("width", dimensions.width + dimensions.margins.left + dimensions.margins.right)
.attr("height", dimensions.height + dimensions.margins.top + dimensions.margins.bottom)
.append("g")
.attr("transform", "translate(" + dimensions.margins.left + "," + dimensions.margins.top + ")");




module.exports={Axis, default_dimensions,create_color,addAxis,updateYAxis, createSvg}