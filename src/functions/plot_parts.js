const d3 = require("d3");
const chroma = require("chroma-js")
// Container creation

// Dimensions
const container_dimensions = (width = 800, height = 300) => {
  return { width, height };
};

//   Margins
const margins = (top = 10, bottom = 30, left = 60, right = 60) => {
  return { top, bottom, left, right };
};

// All togheter now
const plot_dimensions = (container_dimensions, margins) => {
  return {
    container_dimensions,
    margins,
    width: container_dimensions.width - margins.left - margins.right,
    height: container_dimensions.height - margins.bottom - margins.top,
  };
};

const default_dimensions = plot_dimensions(container_dimensions(), margins());

// Colors

// const create_color = (groups) => {
//   const color = d3
//     .scaleOrdinal()
//     .domain(groups)
//     .range(["#D64B4B", "#D6914B", "#D6D64B", "#4BD74B", "#4BD8D8", "#4C4CD9"]);
//   return color;
// };

const sexColor=(grp,color)=>{
  return /F/.test(grp)? chroma(color).darken():/M/.test(grp)?chroma(color).brighten():color
}


const create_color = (groups) => {
  return (grp) => {
    if(groups.length>6){
    if (/^AHY/.test(grp)) {
      return sexColor(grp,"#D64B4B");
    }
    if (/^HY/.test(grp)) {
      return sexColor(grp,"#4BD74B");
    }
    if (/^ASY/.test(grp)) {
      return sexColor(grp,"#D6914B");
    }
    if (/^SY/.test(grp)) {
      return sexColor(grp,"#4C4CD9");
    }
    if (/^TY/.test(grp)) {
      return sexColor(grp,"#4BD8D8");
    }
    if (/^ATY/.test(grp)) {
      return sexColor(grp,"#D6D64B");
    }}else{
    
          return ["#D64B4B","#4BD74B", "#4C4CD9","#D6914B", "#4BD8D8",  "#D6D64B",][groups.indexOf(grp)]
        }
  };
};

//   Axis

const maxFunction = (data) =>
  d3.max(data, function (d) {
    return +d;
  }) * 1.2;

const minFunction = (data) =>
  d3.max(data, function (d) {
    return +d;
  }) * 0.8;

const xAxis = (width) => d3.scaleLinear().domain([0, 365]).range([0, width]);
const yAxis = (y_data, height, yHook) => {
  // console.log(yHook,y_data,came)
  // if(yHook){
  //   yHook.checkYMax(maxFunction(y_data))
  // }
  const maximum = yHook ? yHook * 1.2 : maxFunction(y_data);
  return d3.scaleLinear().domain([0, maximum]).range([height, 0]).nice();
};

const specialyAxis = (y_data, height, yHook) => {
  // console.log(yHook,y_data,came)
  // if(yHook){
  //   yHook.checkYMax(maxFunction(y_data))
  // }
  const maximum = y_data.max;
  const minimum = y_data.min;

  return d3.scaleLinear().domain([minimum, maximum]).range([height, 0]).nice();
};

const Axis = (dimensions, y_data, max_y) => {
  return {
    y: yAxis(y_data, dimensions.height, max_y),
    x: xAxis(dimensions.width),
  };
};

const specialAxis = (dimensions, y_data, max_y) => {
  return {
    y: specialyAxis(y_data, dimensions.height, max_y),
    x: xAxis(dimensions.width),
  };
};

// Append axis

const addXAxis = (svg, x, height) => {
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "xAxis")
    .call(d3.axisBottom(x).ticks(365 / 10))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
};

const addYAxis = (svg, y, total_ticks = 10) => {
  return svg
    .append("g")
    .attr("class", "yAxis")
    .call(d3.axisLeft(y).ticks(total_ticks));
};

const addYAxisSpecial = (svg, y, total_ticks = 10, tickArr) => {
  return svg
    .append("g")
    .attr("class", "yAxis")
    .call(
      d3
        .axisLeft(y)
        .ticks(total_ticks)
        .tickFormat((d, i) => tickArr[i])
    );
};

const addAxis = (svg, axis, height, vars) => {
  addXAxis(svg, axis.x, height);
  addYAxis(svg, axis.y);
};

const addSpecialAxis = (svg, axis, height, vars) => {
  addXAxis(svg, axis.x, height);
  addYAxisSpecial(svg, axis.y, vars.length, vars);
};

const updateYAxis = (svg, axis, total_ticks = 10) => {
  svg
    .select("g.yAxis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(axis.y).ticks(total_ticks));
};

const updateXAxis = (svg, axis, total_ticks = 10) => {
  svg
    .select("g.xAxis")
    .transition()
    .duration(1000)
    .call(d3.axisBottom(axis.x).ticks(365 / 10));
};

const updateYAxisSpecial = (svg, axis, total_ticks = 10, tickArr) => {
  svg
    .select("g.yAxis")
    .transition()
    .duration(1000)
    .call(
      d3
        .axisLeft(axis.y)
        .ticks(total_ticks)
        .tickFormat((d, i) => tickArr[i])
    );
};

const tickHider = () => {
  const ticks = d3.selectAll(".tick text");
  ticks.each(function (_, i) {
    if (i % 2 !== 0) d3.select(this).remove();
  });
};

// create svg

const createSvg = (div, dimensions) =>
  d3
    .select(div)
    .append("svg")
    .attr(
      "width",
      dimensions.width + dimensions.margins.left + dimensions.margins.right
    )
    .attr(
      "height",
      dimensions.height + dimensions.margins.top + dimensions.margins.bottom
    )
    .append("g")
    .attr(
      "transform",
      "translate(" +
        dimensions.margins.left +
        "," +
        dimensions.margins.top +
        ")"
    );

const updateSvg = (svg, dimensions) => {
  svg.style(
    "width",
    dimensions.width + dimensions.margins.left + dimensions.margins.right
  );
};
const addYLabel = (svg, text, dimensions, type) => {
  svg
    .append("text")
    .attr("class", type)
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - dimensions.margins.left)
    .attr("x", 0 - dimensions.height / 2)
    .attr("dy", ".75em")
    .style("text-anchor", "middle")
    .text(text);
};


module.exports = {
  specialAxis,
  Axis,
  tickHider,
  default_dimensions,
  create_color,
  addAxis,
  addSpecialAxis,
  updateYAxis,
  createSvg,
  addYLabel,
  updateYAxisSpecial,
  updateXAxis,
  updateSvg,
};
