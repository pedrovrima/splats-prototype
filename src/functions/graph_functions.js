var d3 = require("d3");
var functions = require("./index")
console.log(functions)

const container_dimensions = (width = 1000, height = 400) => {
  return { width, height };
};
const margins = (top = 10, bottom = 30, left = 60, right = 60) => {
  return { top, bottom, left, right };
};

const plot_dimensions = (container_dimensions, margins) => {
    console.log(container_dimensions)
  return {
    width: container_dimensions.width - margins.left - margins.right,
    height: container_dimensions.height - margins.bottom - margins.top,
  };
};

const create_color = (data) => {
  var color = d3
    .scaleOrdinal()
    .domain(data.groups)
    .range([
      "#FF0000FF",
      "#FFFF00FF",
      "#00FF00FF",
      "#00FFFFFF",
      "#0000FFFF",
      "#FF00FFFF",
    ]);
  return color;
};

const xAxis = (width) => d3.scaleLinear().domain([0, 365]).range([0, width]);

const yAxis = (data, height) =>
  d3
    .scaleLinear()
    .domain([
      0,
      d3.max(functions.flatten(data.stack), function (d) {
        return +d;
      }) * 1.2,
    ])
    .range([height, 0])
    .nice();

    const createLegend = (svg,data,color,dimensions)=>{
        let data_svg= svg
        .selectAll("mydots")
        .data(data.groups)

        console.log(data_svg)
        data_svg.enter()
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
    
      // Add one dot in the legend for each name.
      svg
        .selectAll("mylabels")
        .data(data.groups)
        .enter()
        .append("text")
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
        .attr("class", "labels");
    
    }


    
function createPlot(divId, data, variables, effort_data, bins) {
   const c_dimension=container_dimensions()
  const dimensions = plot_dimensions(c_dimension, margins());
  console.log(dimensions)

  var d3Data = functions.newCreateD3(data, variables, effort_data, bins);

  // creates plot area
  var svg = d3
    .select(divId)
    .append("svg")
    .attr("width", container_dimensions().width)
    .attr("height", container_dimensions().height)
    .append("g")
    .attr(
      "transform",
      "translate(" + margins().left + "," + margins().right + ")"
    );

  //   creates x axis
  svg
    .append("g")
    .attr("transform", "translate(0," + (dimensions.height) + ")")
    .call(d3.axisBottom(xAxis(dimensions.width)).ticks(365 / 5));

  //   hides ticks
  var ticks = d3.selectAll(".tick text");
  ticks.each(function (_, i) {
    if (i % 2 !== 0) d3.select(this).remove();
  });


//   creates y axis
  svg.append("g").attr("class", "yaxis").call(d3.axisLeft(yAxis(d3Data,dimensions.height)));

  // color palette
  var color = create_color(d3Data)

// add areas
  svg
    .selectAll("mylayers")
    .data(d3Data.stack)
    .enter()
    .append("path")
    .attr("class", "area")
    .style("fill", function (d) {
      let name = d3Data.groups[d.key];
      return color(name);
    })
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(dimensions.width)(d.data.key);
        })
        .y0(function (d) {
          return yAxis(d3Data,dimensions.height)(d[0]);
        })
        .y1(function (d) {
          return yAxis(d3Data,dimensions.height)(d[1]);
        })
    );




    createLegend(svg,d3Data,color,dimensions)

}

function updatePath(svg, d3data, dimension) {
  var paths = svg.select("g").selectAll("path.area").data(d3data.stack);
  paths.exit().remove();
  paths
    .enter()
    .append("path")
    .attr("class", "area")
    .style("fill", function (d) {
      let name = d3data.groups[d.key];
      return create_color(d3data.groups)(name);
    })
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(dimension.width)(d.data.key);
        })
        .y0(function (d) {
          console.log(d, d3data);
          return yAxis(d3data, dimension.height)(d[0]);
        })
        .y1(function (d) {
          console.log(d3data);
          return yAxis(d3data, dimension.height)(d[1]);
        })
    );

  return paths;
}

function updateData(divId, data, variables, effort_data, bins) {
  var margin = { top: 10, right: 60, bottom: 30, left: 60 },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  var newd3Data = functions.newCreateD3(data, variables, effort_data, bins);
  let dimension = { height, width };

  var svg = d3.select(divId);

  let paths = updatePath(svg, newd3Data, dimension);

  let circles = svg.select("g").selectAll("circle").data(newd3Data.groups);

  circles.exit().remove();

  circles
    .enter()
    .append("circle")
    .attr("cx", width)
    .attr("cy", function (d, i) {
      return 100 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return create_color(newd3Data.groups)(d);
    })
    .style("stroke", "black");

  let textRemove = svg.select("g").selectAll("text.labels").data([]);

  textRemove.exit().remove();

  let textAdd = svg.select("g").selectAll("text.labels").data(newd3Data.groups);

  svg
    .selectAll("g.yaxis")
    .call(d3.axisLeft(yAxis(newd3Data, dimension.height)));

  textAdd
    .enter()
    .append("text")
    .attr("x", width + 10)
    .attr("class", "labels")
    .attr("y", function (d, i) {
      return 105 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "black")
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  paths
    .transition()
    .duration(1000)
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(dimension.width)(d.data.key);
        })
        .y0(function (d) {
          return yAxis(newd3Data, dimension.height)(d[0]);
        })
        .y1(function (d) {
          return yAxis(newd3Data, dimension.height)(d[1]);
        })
    );
}


module.exports ={updateData,createPlot}