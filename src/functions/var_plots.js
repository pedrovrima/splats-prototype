const d3 = require("d3");

const {
  addYLabel,
  specialAxis,
  Axis,
  addAxis,
  addSpecialAxis,
  createSvg,
  updateYAxis,
  updateYAxisSpecial,
  tickHider,
  create_color,
} = require("./plot_parts");

const { createLegend, updateLegend } = require("./legend_plot");
const { createError, updateError } = require("./error_bars");

const functions = require("./index").default;

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

const addLine = (svg, data, color, axis) => {
  const classy = data.key.replace(/\s+/g, "");

  const plot_data = d3
    .line()
    .curve(d3.curveBasis)
    .x((d) => axis.x(d.bin))
    .y((d) => axis.y(d.mean));

  svg
    .append("path")
    .attr("class", `line${classy} lineplot`)
    .attr("fill", "none")
    .style("stroke-dasharray", "3, 3")
    .attr("stroke", color(data.key))

    .attr("stroke-width", 2.5)
    .attr("opacity", 0)
    .attr("d", plot_data(data.values));
};

const addVerticalLines = (svg, data, color, axis) => {
  const classy = data.key.replace(/\s+/g, "");
  svg

    .data(data.values)
    .enter()
    .append("line")

    .attr("class", `${classy} lineplot`)

    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(data.key);
    })
    .attr("stroke-width", 2.5)
    .attr("x1", (d) => axis.x(d.bin))
    .attr("x2", (d) => axis.x(d.bin))
    .attr("y1", (d) => axis.y(d.mean + d.se))
    .attr("y2", (d) => axis.y(d.mean - d.se));

  //  function(d){
  // // return
  // d3.area()
  //   .x(function(d) { console.log("here");return axis.x(d.bin);})
  //   .y0(function(d) { return axis.y(+d.mean-d.se); })
  //   .y1(function(d) { return axis.y(+d.mean+d.se); })

  //   // (d.values)

  // }
};

const removeLines = (svg, data) => {
  svg.select("g").selectAll(`line.lineplot`).data([]).exit().remove();
};

const addHorizontalLines = (svg, data, color, axis) => {
  svg
    .data(data.values)
    .enter()

    // .data(data[2].values[25])
    .append("line")
    .attr("class", `${data.key.replace(/\s+/g, "")} lineplot`)

    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(data.key);
    })
    .attr("stroke-width", 2.5)
    .attr("x1", (d) => axis.x(d.bin + 2))
    .attr("x2", (d) => axis.x(d.bin - 2))
    .attr("y1", (d) => axis.y(d.mean + d.se))
    .attr("y2", (d) => axis.y(d.mean + d.se));

  svg
    .data(data.values)
    .enter()
    .append("line")
    .attr("class", `${data.key.replace(/\s+/g, "")} lineplot`)

    .attr("fill", "none")
    .attr("stroke", function (d) {
      return color(data.key);
    })
    .attr("stroke-width", 2.5)
    .attr("x1", (d) => axis.x(d.bin + 2))
    .attr("x2", (d) => axis.x(d.bin - 2))
    .attr("y1", (d) => axis.y(d.mean - d.se))
    .attr("y2", (d) => axis.y(d.mean - d.se));
};

const createVariable = (splatsDiv, data, dimensions, yHook) => {
  
  const yDataMax = d3.max(data.flat, function (d) {
    return +d.mean + d.se;
  });
  const yDataMin = d3.min(data.flat, function (d) {
    if (d.mean > 0) {
      return +d.mean - d.se;
    }
  });
  const y_data = data.variable_data.values?{max:data.variable_data.values.length-1,min:0}:{ max: yDataMax, min: yDataMin };
  const axis = specialAxis(dimensions, y_data, yHook);
  const color = create_color(data.groups);
  var svg = createSvg(splatsDiv, dimensions);
  addBackground(svg, dimensions);
  addYLabel(svg,data.variable_data.label,dimensions,"vari")
  data.variable_data.values?
  addSpecialAxis(svg, axis, dimensions.height,data.variable_data.values):addAxis(svg, axis, dimensions.height)
  // tickHider();
  data.nested.map((dn) => {
    var lines = svg.selectAll("lines").data(dn);
    var paths = svg.selectAll("path").data(dn);
    addHorizontalLines(lines, dn, color, axis);
    addVerticalLines(lines, dn, color, axis);
    addLine(svg, dn, color, axis);
  });
  createLegend(svg, data, color, dimensions);
};

const updateVariable = (splatsDiv, data, dimensions, yHook) => {
  const yDataMax = d3.max(data.flat, function (d) {
    return +d.mean + d.se;
  });
  
  const yDataMin = d3.min(data.flat, function (d) {
    if (d.mean > 0) {
      return +d.mean - d.se;
    }
  });
  const y_data = data.variable_data.values?{max:data.variable_data.values.length-1,min:0}:{ max: yDataMax, min: yDataMin };

  const axis = specialAxis(dimensions, y_data, yHook);
  const color = create_color(data.groups);
  var svg = d3.select(splatsDiv);
  data.variable_data.values?updateYAxisSpecial(svg, axis,data.variable_data.values.length,data.variable_data.values):updateYAxis(svg, axis,);
  const lines = svg.select("g").selectAll(`.lineplot`).data([]);

  lines.exit().remove();
  svg.select("g").selectAll(`path.lineplot`).remove()
  

  svg.select("g").selectAll("text.vari").remove()
  addYLabel(svg.select("g"),data.variable_data.label,dimensions,"vari")

  data.nested.map((dn) => {
    addHorizontalLines(lines, dn, color, axis);
    addVerticalLines(lines, dn, color, axis);
    addLine(svg.select("g"), dn, color, axis);
  });
  updateLegend(svg, data, color, dimensions);
};

export default { createVariable, updateVariable };
