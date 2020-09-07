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

const createArea = (svg,data,color,dimensions,axis)=>{
    svg
    .selectAll("mylayers")
    .data(data.stack)
    .enter()
    .append("path")
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
          return axis.x(d.data.key);
        })
        .y0(function (d) {
          return axis.y(d[0]);
        })
        .y1(function (d) {
          return axis.y(d[1]);
        })
    );
    }


    const verticalBar = (svg,axis)=>{
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
            .y1((d, i) => axis.y(d.value + d.se)))
        
    
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
    
    }

    const horizontalBar = (svg,axis,positive)=>{
        const value = positive?1:-1
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
              return axis.y(d.value + value*d.se);
            })
        )
        .attr("stroke", "red")
        .attr("stroke-width", 1.5);
    
    }


    const createError = (svg,data,axis)=>{
        const errorData = data.stack[data.stack.length - 1].map((stac, i) => [
            { data: stac.data, value: stac[1], se: data.ses[i] },
          ]);
        


          var errorBars = svg.selectAll("path.errorBar").data(errorData);
          verticalBar(errorBars,axis)
          horizontalBar(errorBars,axis,true)
          horizontalBar(errorBars,axis,false)

        
    }


const createSplats = (splatsDiv, data, dimensions) => {

  const yData = functions.flatten(data.stack);
  const color = create_color(data.groups);

  var svg = createSvg(splatsDiv, dimensions);
  addBackground(svg, dimensions);
  const axis = Axis(dimensions, yData);
  addAxis(svg, axis, dimensions.height);
  tickHider();
  createArea(svg,data,color,dimensions,axis)
  createError(svg,data,axis)
};

module.exports = { createSplats };
