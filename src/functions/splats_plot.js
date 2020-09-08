const d3 = require("d3");

const {
  Axis,
  default_dimensions,
  addAxis,
  createSvg,
  updateYAxis,
  tickHider,
  create_color,
} = require("./plot_parts");

const functions = require("./index").default;

const { createError, updateError } = require("./error_bars");
const {createLegend,  updateLegend} = require("./legend_plot")
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

const selectAreaSvg = (svg, data) =>
  svg.selectAll("mylayers").data(data.stack)

const selectAreas = (svg,data) =>
  svg.select("g").selectAll("path.area").data(data.stack)
const removeAreas = (svg) => {
  svg.exit().remove()
}

const addArea = (svg, data, color, axis) =>
  svg
  .enter().append("path")
    .attr("class", "area")
    .style("fill", function (d) {
      const name = data.groups[d.key];
      return color(name);
    })
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          console.log(d)
          return axis.x(d.data.key);
        })
        .y0(function (d) {
          return axis.y(d[0]);
        })
        .y1(function (d) {
          return axis.y(d[1]);
        })
    );

const updateArea = async (svg, data,color,axis) => {
  const pre_path = selectAreas(svg,data);
 removeAreas(pre_path);
  addArea(pre_path, data, color, axis);
};

const createSplats = (splatsDiv, data, dimensions) => {
  const yData = functions.flatten(data.stack);
  const axis = Axis(dimensions, yData);
  const color = create_color(data.groups);

  var svg = createSvg(splatsDiv, dimensions);
  addBackground(svg, dimensions);
  addAxis(svg, axis, dimensions.height);
  tickHider();
  addArea(selectAreaSvg(svg, data), data, color, axis);
  createError(svg, data, axis);
  createLegend(svg, data, color, dimensions);
};

const updateSplats = (splatsDiv, data, dimensions) => {
  const yData = functions.flatten(data.stack);
  const axis = Axis(dimensions, yData);
  const color = create_color(data.groups);
  var svg = d3.select(splatsDiv);

  updateArea(svg,data,color,axis)
  updateYAxis(svg, axis);
  updateError(svg,data,axis)
  updateLegend(svg, data, color, dimensions);

};

module.exports = { createSplats, updateSplats };
