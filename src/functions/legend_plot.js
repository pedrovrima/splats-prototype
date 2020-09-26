const d3 = require("d3");

const createDots = (dotSvg, dimensions, color) => {
  dotSvg
    .enter()
    .append("circle")
    .attr("cx", dimensions.width)
    .attr("cy", function (d, i) {
      return 100 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return color(d);
    })
    .style("stroke", "black");
};

const opacityChangerOver = (data, d) => {
    d3.selectAll(`.${d.replace(/\s+/g, "")}`).attr("opacity", "1")
    d3.selectAll(`.line${d.replace(/\s+/g, "")}`).attr("opacity", "1")

    data.groups.map(gr=>{
      if(gr!==d)
      d3.selectAll(`.${gr.replace(/\s+/g, "")}`).attr("opacity", ".15")

    })
};



const opacityChangerOut = (data, d) => {
  data.groups.map(gr=>{
    d3.selectAll(`.${gr.replace(/\s+/g, "")}`).attr("opacity", "1")
    d3.selectAll(`.line${gr.replace(/\s+/g, "")}`).attr("opacity", "0")

  })
};

const createText = (textSvg, data, dimensions, color) => {
  textSvg
    .data(data.groups)
    .enter()
    .append("text")
    .on("mouseover", (d) => opacityChangerOver(data,d))
    .on("mouseout", (d) => opacityChangerOut(data))

    .attr("x", dimensions.width + 10)
    .attr("y", function (d, i) {
      return 105 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "black")
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .attr("class", "labels")
    .attr("font-family", "Arial, Helvetica, sans-serif");
};

const createLegend = (svg, data, color, dimensions) => {
  const dotSvg = svg.selectAll("mydots").data(data.groups);
  createDots(dotSvg, dimensions, color);

  // Add one dot in the legend for each name.
  const textSvg = svg.selectAll("mylabels");

  createText(textSvg, data, dimensions, color);
};

const removeLegend = (svg, data) => {
  const circles = svg
    .select("g")
    .selectAll("circle")
    .data(data.groups)
    .exit()
    .remove();
  const textRemove = svg
    .select("g")
    .selectAll("text.labels")
    .data([])
    .exit()
    .remove();
};

const updateLegend = (svg, data, color, dimensions) => {
  removeLegend(svg, data);

  const dotSvg = svg.select("g").selectAll("circle").data(data.groups);
  createDots(dotSvg, dimensions, color);
  const textSvg = svg.select("g").selectAll("text.labels");

  createText(textSvg, data, dimensions, color);
};

module.exports = { createLegend, updateLegend };
