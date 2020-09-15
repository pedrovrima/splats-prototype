const d3 = require("d3");

const {
  Axis,
  addAxis,
  createSvg,
  updateYAxis,
  tickHider,
  create_color,
} = require("./plot_parts");

const functions = require("./index").default;

const { createError, updateError } = require("./error_bars");
const { createLegend, updateLegend } = require("./legend_plot");
const addBackground = (svg, dimensions) => {
  svg
    .append("rect")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .attr("fill", "white")
    .attr(
      "transform",
      "translate(-" +
        dimensions.margins.left +
        ",-" +
        dimensions.margins.left.top +
        ")"
    );
};

const selectAreaSvg = (svg, data) => svg.selectAll("mylayers").data(data.stack);

const setStyle = (svg, data, color) =>
  svg.style("fill", function (d) {
    const name = data.groups[d.key];
    return color(name);
  });

const addArea = (svg, axis) => {
  svg
    .transition()
    .ease(d3.easeCubic)
    .duration(1500)
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
  const path = svg.enter().append("path").attr("class", "area");

  setStyle(path, data, color);
  addArea(path, axis);
  addArea(path, axis);
};

const updateArea = async (svg, data, color, axis) => {
  const paths = svg.select("g").selectAll("path.area").data(data.stack);
  paths.exit().remove();

  addArea(
    setStyle(paths.enter().append("path").attr("class", "area"), data, color),
    axis
  );

  addArea(paths, axis);
};

const createSplats = (splatsDiv, data, dimensions, yHook) => {
  const yData = functions.flatten(data.stack);
  const axis = Axis(dimensions, yData, yHook);
  const color = create_color(data.groups);

  var svg = createSvg(splatsDiv, dimensions);
  addBackground(svg, dimensions);
  addAxis(svg, axis, dimensions.height);
  // tickHider();
  createArea(selectAreaSvg(svg, data), data, color, axis);
  createError(svg, data, axis);
  createLegend(svg, data, color, dimensions);
};

const updateSplats = (splatsDiv, data, dimensions, yHook) => {
  const yData = functions.flatten(data.stack);
  const axis = Axis(dimensions, yData, yHook);
  const color = create_color(data.groups);
  var svg = d3.select(splatsDiv);

  updateArea(svg, data, color, axis);
  updateYAxis(svg, axis);
  updateError(svg, data, axis);
  updateLegend(svg, data, color, dimensions);
};

export default { createSplats, updateSplats };
