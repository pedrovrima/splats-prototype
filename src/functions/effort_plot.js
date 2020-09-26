const d3 = require("d3");

const {
  addYLabel,
  Axis,
  default_dimensions,
  addAxis,
  createSvg,
  updateYAxis,
} = require("./plot_parts");

const newBarsPrep = (svg, data) =>
  svg.append("g").attr("class", "bars").selectAll().data(data).enter().append("rect")
  ;

const removeBars = (svg,height) => 
  svg
    .select("g.bars")
    .selectAll("rect")
    .transition()
    .ease(d3.easeCircleOut)
    .duration(200)
    .attr("height", 0)
    .attr("y", height);


const addBars = (svg, data, dimensions, axis) =>
  svg
    .attr("x", function (d) {
      return axis.x(d.group - 365 / data.length / 2);
    })
    .attr("y", dimensions.height)
    .attr("y", function (d) {
      return axis.y(d.value);
    })
    .attr("width", dimensions.width / data.length)
    .attr("height", function (d) {
      return dimensions.height - axis.y(d.value);
    })
    .attr("fill", "#69b3a2");


const updateBarsPrep = (svg,data)=>
  svg
    .select("g.bars")
    .selectAll()
    .data(data)
    .enter()
    .append("rect")
    .transition()
    .duration(500)



const updateBars = (svg, data, dimensions, axis) => {
  addBars(updateBarsPrep(svg, data), data, dimensions, axis);
};

const createBars = (svg, data, dimensions, axis) => {
  addBars(newBarsPrep(svg, data), data, dimensions, axis);
};

const createEffort = (effDiv, data,  dimensions) => {
  let allNh = data.map((d) => d.value);

  const height = 200 - dimensions.margins.top - dimensions.margins.bottom;
  const new_dimensions = { ...dimensions, height };

  // createSvg

  var svg = createSvg(effDiv, new_dimensions);

  // Create axis
  const axis = Axis(new_dimensions, allNh,0,"effort");

  // X axis
  addAxis(svg, axis, height);

  addYLabel(svg,"Total nh",new_dimensions)
  // Bars
  createBars(svg, data, new_dimensions, axis);
};

const updateEffort = (effDiv, data, dimensions) => {
  const height = 200 - dimensions.margins.top - dimensions.margins.bottom;
  const new_dimensions = { ...dimensions, height };

  var svg = d3.select(effDiv);

  // get y needed data
  let allNh = data.map((d) => d.value);

  // deal with axis

  var axis = Axis(new_dimensions, allNh,0,"effort");

  updateYAxis(svg, axis);

  // Bars

  removeBars(svg,height)
  updateBars(svg, data, new_dimensions, axis);
  };

export default  { createEffort, updateEffort };
