import functions from "./index";
import {createEffort,updateEffort} from "./effort_plot"
import {default_dimensions} from "./plot_parts"

const d3 = require("d3");

const container_dimensions = (width = 1000, height = 400) => {
  return { width, height };
};
const margins = (top = 10, bottom = 30, left = 60, right = 60) => {
  return { top, bottom, left, right };
};

const plot_dimensions = (container_dimensions, margins) => {
  return {
    width: container_dimensions.width - margins.left - margins.right,
    height: container_dimensions.height - margins.bottom - margins.top,
  };
};

const opposites = (arr, l) => {
  if (l >= arr.length) {
    return arr;
  } else {
    let i = 0;
    let colors = [];
    while (i < l) {
      let datum = i % 2 === 0 ? arr[Math.ceil(i / 2)] : arr[arr.length - i];
      colors.push(datum);
      i++;
    }
    return colors;
  }
};

const create_color = (data) => {
  const color = d3
    .scaleOrdinal()
    .domain(data.groups)
    .range(["#D64B4B", "#D6914B", "#D6D64B", "#4BD74B", "#4BD8D8", "#4C4CD9"]);
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

const error_bar_func = (dimensions, data) =>
  d3
    .area()
    .x(function (d, i) {
      return xAxis(dimensions.width)(d.data.key);
    })
    .y1(function (d) {
      return yAxis(
        data,
        dimensions.height
      )(Math.max(functions.flatten(d.data.stack)) + +5);
    })
    .y0(function (d) {
      return yAxis(
        data,
        dimensions.height
      )(Math.max(functions.flatten(d.data.stack)) - +5);
    });

const createLegend = (svg, data, color, dimensions) => {
  const data_svg = svg.selectAll("mydots").data(data.groups);

  data_svg
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
    .attr("class", "labels")
    .attr("font-family", "Arial, Helvetica, sans-serif");
};



function createPlot(divId, data, variables, effort_data, bins, effDiv) {
  const c_dimension = container_dimensions();
  const dimensions = plot_dimensions(c_dimension, margins());

  const d3Data = functions.newCreateD3(data, variables, effort_data, bins);

  createEffort(d3Data.effortData, effDiv, default_dimensions);
  // creates plot area
  const svg = d3
    .select(divId)
    .append("svg")
    .attr("width", container_dimensions().width)
    .attr("height", container_dimensions().height)

    .append("g")
    .attr(
      "transform",
      "translate(" + margins().left + "," + margins().top + ")"
    );

  svg
    .append("rect")
    .attr("width", container_dimensions().width)
    .attr("height", container_dimensions().height)
    .attr("fill", "white")
    .attr(
      "transform",
      "translate(-" + margins().left + ",-" + margins().top + ")"
    );

  svg
    .append("g")
    .attr("transform", "translate(0," + dimensions.height + ")")
    .call(d3.axisBottom(xAxis(dimensions.width)).ticks(365 / 5));

  //   hides ticks
  const ticks = d3.selectAll(".tick text");
  ticks.each(function (_, i) {
    if (i % 2 !== 0) d3.select(this).remove();
  });

  //   creates y axis
  svg
    .append("g")
    .attr("class", "yaxis")
    .call(d3.axisLeft(yAxis(d3Data, dimensions.height)));

  // color palette
  const color = create_color(d3Data);

  // add areas
  svg
    .selectAll("mylayers")
    .data(d3Data.stack)
    .enter()
    .append("path")
    .attr("class", "area")
    .style("fill", function (d) {
      const name = d3Data.groups[d.key];
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
          return yAxis(d3Data, dimensions.height)(d[0]);
        })
        .y1(function (d) {
          return yAxis(d3Data, dimensions.height)(d[1]);
        })
    );

  const errorData = d3Data.stack[d3Data.stack.length - 1].map((stac, i) => [
    { data: stac.data, value: stac[1], se: d3Data.ses[i] },
  ]);

  var errorBars = svg.selectAll("path.errorBar").data(errorData);
  errorBars
    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(dimensions.width)(d.data.key);
        })
        .y0((d, i) => yAxis(d3Data, dimensions.height)(d.value - d.se))
        .y1((d, i) => yAxis(d3Data, dimensions.height)(d.value + d.se))
    )

    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  errorBars
    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x0(function (d, i) {
          return xAxis(dimensions.width)(d.data.key - 2);
        })
        .x1(function (d, i) {
          return xAxis(dimensions.width)(+d.data.key + 2);
        })
        .y((d, i) => {
          return yAxis(d3Data, dimensions.height)(+d.se + d.value);
        })
    )
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  errorBars
    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x0(function (d, i) {
          return xAxis(dimensions.width)(d.data.key - 2);
        })
        .x1(function (d, i) {
          return xAxis(dimensions.width)(+d.data.key + 2);
        })
        .y((d, i) => yAxis(d3Data, dimensions.height)(d.value - d.se))
    )
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  createLegend(svg, d3Data, color, dimensions);
}

function updatePath(svg, d3data, dimension) {
  const paths = svg.select("g").selectAll("path.area").data(d3data.stack);
  paths.exit().remove();
  paths
    .enter()
    .append("path")
    .attr("class", "area")
    .style("fill", function (d) {
      const name = d3data.groups[d.key];
      console.log(create_color(d3data));
      return create_color(d3data)(name);
    })
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(dimension.width)(d.data.key);
        })
        .y0(function (d) {
          return yAxis(d3data, dimension.height)(d[0]);
        })
        .y1(function (d) {
          return yAxis(d3data, dimension.height)(d[1]);
        })
    );

  return paths;

}

function updateStations(divId, data, variables, effort_data, bins, effDiv) {
  const dimension = plot_dimensions(container_dimensions(), margins());

  const newd3Data = functions.newCreateD3(data, variables, effort_data, bins);
  updateEffort(newd3Data.effortData, effDiv, default_dimensions);

  const svg = d3.select(divId);
  svg
    .selectAll("g.yaxis")
    .call(d3.axisLeft(yAxis(newd3Data, dimension.height)));

  const newerrorData = newd3Data.stack[
    newd3Data.stack.length - 1
  ].map((stac, i) => [
    { data: stac.data, value: stac[1], se: newd3Data.ses[i] },
  ]);

  var errorBars = svg.select("g").selectAll("path.errorBar").data([]);
  errorBars.exit().remove();

  errorBars
    .data(newerrorData, (d) => d[0].value)
    .enter()
    .append("path")
    .attr("class", "errorBar")
    .transition()
    .duration(1000)
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(dimension.width)(d.data.key);
        })
        .y0((d, i) => yAxis(newd3Data, dimension.height)(d.value - d.se))
        .y1((d, i) => yAxis(newd3Data, dimension.height)(d.value + d.se))
    )

    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  errorBars
    .data(newerrorData, (d) => d[0].value)

    .enter()
    .append("path")
    .attr("class", "errorBar")
    .transition()
    .duration(1000)

    .attr(
      "d",
      d3
        .area()
        .x0(function (d, i) {
          return xAxis(dimension.width)(d.data.key - 2);
        })
        .x1(function (d, i) {
          return xAxis(dimension.width)(+d.data.key + 2);
        })
        .y((d, i) => {
          return yAxis(newd3Data, dimension.height)(+d.se + d.value);
        })
    )
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  errorBars
    .data(newerrorData, (d) => d[0].value)

    .enter()
    .append("path")
    .attr("class", "errorBar")
    .transition()
    .duration(1000)

    .attr(
      "d",
      d3
        .area()
        .x0(function (d, i) {
          return xAxis(dimension.width)(d.data.key - 2);
        })
        .x1(function (d, i) {
          return xAxis(dimension.width)(+d.data.key + 2);
        })
        .y((d, i) => yAxis(newd3Data, dimension.height)(d.value - d.se))
    )
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  const paths = updatePath(svg, newd3Data, dimension, 1);

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

function updateStatic(divId, data, variables, effort_data, bins, effDiv) {
  const dimension = plot_dimensions(container_dimensions(), margins());
  const newd3Data = functions.newCreateD3(data, variables, effort_data, bins);
  console.time("effort")
  updateEffort(newd3Data.effortData, effDiv, default_dimensions);
console.timeEnd("effort")
  const svg = d3.select(divId);
console.time("rest")
console.time("path")
  const paths = updatePath(svg, newd3Data, dimension);
console.timeEnd("path")
  const circles = svg.select("g").selectAll("circle").data(newd3Data.groups);

  circles.exit().remove();

  circles
    .enter()
    .append("circle")
    .attr("cx", dimension.width)
    .attr("cy", function (d, i) {
      return 100 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return create_color(newd3Data)(d);
    })
    .style("stroke", "black");

  const textRemove = svg.select("g").selectAll("text.labels").data([]);

  textRemove.exit().remove();

  const textAdd = svg
    .select("g")
    .selectAll("text.labels")
    .data(newd3Data.groups);

  svg
    .selectAll("g.yaxis")
    .transition()
    .duration(100)
    .call(d3.axisLeft(yAxis(newd3Data, dimension.height)));

  textAdd
    .enter()
    .append("text")
    .attr("x", dimension.width + 10)
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

  circles.transition().duration(1000);
  console.time("error")
  const newerrorData = newd3Data.stack[
    newd3Data.stack.length - 1
  ].map((stac, i) => [
    { data: stac.data, value: stac[1], se: newd3Data.ses[i] },
  ]);
  console.timeEnd("error")
  var errorBars = svg.select("g").selectAll("path.errorBar").data([]);
  errorBars.exit().remove();

  errorBars
    .data(newerrorData, (d) => d[0].value)
    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(dimension.width)(d.data.key);
        })
        .y0((d, i) => yAxis(newd3Data, dimension.height)(d.value - d.se))
        .y1((d, i) => yAxis(newd3Data, dimension.height)(d.value + d.se))
    )

    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  errorBars
    .data(newerrorData, (d) => d[0].value)

    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x0(function (d, i) {
          return xAxis(dimension.width)(d.data.key - 2);
        })
        .x1(function (d, i) {
          return xAxis(dimension.width)(+d.data.key + 2);
        })
        .y((d, i) => {
          return yAxis(newd3Data, dimension.height)(+d.se + d.value);
        })
    )
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  errorBars
    .data(newerrorData, (d) => d[0].value)

    .enter()
    .append("path")
    .attr("class", "errorBar")
    .attr(
      "d",
      d3
        .area()
        .x0(function (d, i) {
          return xAxis(dimension.width)(d.data.key - 2);
        })
        .x1(function (d, i) {
          return xAxis(dimension.width)(+d.data.key + 2);
        })
        .y((d, i) => yAxis(newd3Data, dimension.height)(d.value - d.se))
    )
    .attr("stroke", "red")
    .attr("stroke-width", 1.5);

  console.timeEnd("rest")
  paths.attr(
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

export default { updateStations, createPlot, updateStatic };
