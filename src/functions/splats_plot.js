const d3 = require("d3");

const {
  addYLabel,
  Axis,
  addAxis,
  createSvg,
  updateYAxis,
  tickHider,
  updateSvg,
  updateXAxis,
  create_color,
} = require("./plot_parts");

const functions = require("./index").default;

const { createError, updateError } = require("./error_bars");
const { createLegend, updateLegend } = require("./legend_plot");


const addBackground = (svg, dimensions,whiteSpace) => {
  svg
    .append("rect")
    .attr("width", dimensions.width+    dimensions.margins.left+    dimensions.margins.right+whiteSpace)
    .attr("height", dimensions.height        +dimensions.margins.top +        dimensions.margins.bottom

    )
    .attr("fill", "white")
    .attr(
      "transform",
      "translate(-" +
        dimensions.margins.left +
        ",-" +
        dimensions.margins.top +
        ")"
    );
};

const selectAreaSvg = (svg, data) => svg.selectAll("mylayers").data(data.stack);

const setStyle = (svg, data, color) =>
  svg.attr("class",(d)=>` area ${data.groups[d.key].replace(/\s+/g, '')}`)
  .style("fill", function (d) {
    const name = data.groups[d.key];
    return color(name);
  });

const addArea = (svg, axis) => {
  svg
    
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return axis.x(d.data.key);
        })
        .y0(function (d) {
          return axis.y(d[0]);
        })
        .y1(function (d) {
          return axis.y(d[1]);
        })
    );
};

const createArea = (svg, data, color, axis) => {
  const path = svg.enter().append("path")
  setStyle(path, data, color);
  addArea(path, axis);
  addArea(path, axis);
};

const updateArea = async (svg, data, color, axis) => {
  const paths = svg.select("g").selectAll("path.area")
  paths.data([]).exit().remove();

  
  addArea(
    setStyle(paths.data([]).data(data.stack).enter().append("path").attr("class", "area"), data, color),
    axis
  );

  addArea(setStyle(paths.enter().append("path").attr("class", "area"), data,color), axis);
};

const createSplats = (splatsDiv, data, dimensions, yHook,whiteSize=0) => {
  console.log(data)
  const yData = functions.flatten(data.stack);
  const axis = Axis(dimensions, yData, yHook);
  const color = create_color(data.groups);
  var svg = createSvg(splatsDiv, dimensions,whiteSize);
  addBackground(svg, dimensions,whiteSize);
  addAxis(svg, axis, dimensions.height);
  addYLabel(svg,"Birds/100nh",dimensions)
  // tickHider();
  createArea(selectAreaSvg(svg, data), data, color, axis);
  createError(svg, data, axis);
  createLegend(svg, data, color, dimensions);
  return(svg)
};

const updateSplats = (splatsDiv, data, dimensions, yHook) => {
  const yData = functions.flatten(data.stack);
  const axis = Axis(dimensions, yData, yHook);
  const color = create_color(data.groups);
  var svg = d3.select(splatsDiv);
  updateSvg(svg,dimensions)
  updateArea(svg, data, color, axis);
  updateYAxis(svg, axis);
  updateXAxis(svg,axis);
  updateError(svg, data, axis);
  updateLegend(svg, data, color, dimensions);
};

export default { createSplats, updateSplats };
