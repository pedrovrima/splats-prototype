const d3 = require("d3");

const verticalBar = (svg, axis) => {
  svg
    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return axis.x(d.data.key);
        })
        .y0((d, i) => axis.y(d.value - d.se))
        .y1((d, i) => axis.y(d.value + d.se))
    )

    .attr("stroke", "red")
    .attr("stroke-width", 1.5);
};

const horizontalBar = (svg, axis, positive) => {
  const value = positive ? 1 : -1;
  svg

    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x0(function (d, i) {
          return axis.x(d.data.key - 2);
        })
        .x1(function (d, i) {
          return axis.x(+d.data.key + 2);
        })
        .y((d, i) => {
          return axis.y(d.value + value * d.se);
        })
    )
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);
};

const createError = (svg, data, axis) => {
  const errorData = data.stack[data.stack.length - 1].map((stac, i) => [
    { data: stac.data, value: stac[1], se: data.ses[i] },
  ]);

  var errorBars = svg.selectAll("path.errorBar").data(errorData);
  console.log(errorBars);
  verticalBar(errorBars, axis);
  horizontalBar(errorBars, axis, true);
  horizontalBar(errorBars, axis, false);
};

const updateError = (svg, data, axis) => {
  const errorData = data.stack[data.stack.length - 1].map((stac, i) => [
    { data: stac.data, value: stac[1], se: data.ses[i] },
  ]);

  const errorBars = svg.select("g").selectAll("path.errorBar").data([]);
  errorBars.exit().remove();
  const newError = errorBars.data(errorData);

  verticalBar(newError, axis);
  horizontalBar(newError, axis, true);
  horizontalBar(newError, axis, false);
};

module.exports = { createError, updateError };
