var d3 = require("d3");

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const getGroups = (data, variable) => {
  let all_values = data.map((datum) => datum[variable]);
  let unique_values = all_values.filter(onlyUnique);
  return unique_values;
};


const filterStation = (effort_data,args)=>{
 return effort_data.filter(datum=>args.indexOf(datum.station)>-1)
}

const getEffIds = (effort_data)=>effort_data.map(datum=>datum.effort_id)


const filterCaptures = (capture_data,effort_ids)=>{
    return capture_data.filter(datum=>effort_ids.indexOf(datum.effort_id)>-1 )
}




const organizeGroups = (data, variable) => {
  let groups = getGroups(data, variable);
  let group_data = groups.reduce((resu, group) => {
    let this_group_data = data.filter((datum) => datum[variable] === group);
    resu[group] = this_group_data;
    return resu;
  }, {});
  return { ...group_data };
};

const createBins = (max, size) => {
  let number_of_bins = Math.ceil(max / size);
  let bins = [];
  for (let i = 0; i < number_of_bins; i++) {
    bins.push(1 + i * size);
  }
  return bins;
};

const findBin = (value, bins) => {
  let correctBin = bins.filter((bin, i) => {
    if (i + 1 < bins.length) {
      return value >= bin && value < bins[i + 1];
    } else {
      return value >= bin;
    }
  });
  return correctBin[0];
};

const getBins = (values, size, maxValue) => {
  let value_cut = maxValue ? maxValue : Math.max(...values);
  let bins = createBins(value_cut, size);

  let values_bins = values.map((val) => findBin(val, bins));

  return values_bins;
};

const createDate = (string_date) => {
  return new Date(string_date);
};

const msToDay = (milisseconds) =>
  Math.floor(milisseconds / (1000 * 60 * 60 * 24)) + 1;

const createJulianDay = (string_date) => {
  let date = createDate(string_date);
  let year = date.getFullYear();
  let janu_first = new Date(year, 0, 1);
  let jDay = msToDay(Date.parse(date) - Date.parse(janu_first));
  return jDay;
};

const createGroupType = (data, variables) => {
  let variable_values = variables.map((variable) => data[variable]);
  return variable_values.join(" ");
};

const dataJulianner = (data) => {
  return { ...data, julian: createJulianDay(data.date) };
};

const dataBinner = (data, bins) => {
  return { ...data, bin: findBin(data.julian, bins) };
};

const dataGroupper = (data, variables) => {
  return { ...data, group: createGroupType(data, variables) };
};

const dateCreator = (data, variables, bins) => {
  return dataBinner(dataJulianner(dataGroupper(data, variables)), bins);
};

const variableFinder = (data, variable, variable_name) => {
  return data.filter((datum) => datum[variable_name] === variable);
};

const groupFinder = (data, group) => {
  return variableFinder(data, group, "group");
};

const variableGroupper = (data, variable, variable_name) => {
  let grouped_data = variable.map((group) => {
    let resu = {
      [variable_name]: group,
      data: variableFinder(data, group, variable_name),
    };
    return resu;
  });
  return grouped_data;
};

const groupGroupper = (data, groups) => {
  return variableGroupper(data, groups, "group");
};

const getBinData = (data, bin) => {
  return data.filter((datum) => datum.bin === bin);
};

const getMean = (array) => {
  const n = array.length;
  if (n === 0) return 0;
  const mean = array.reduce((a, b) => a + b) / n;

  return mean;
};

function getStandardDeviation(array) {
  return Math.sqrt(
    array.map((x) => Math.pow(x - getMean(array), 2)).reduce((a, b) => a + b) /
      (array.length - 1)
  );
}

function getStandardError(array) {
  const n = array.length;
  if (n > 2) {
    return getStandardDeviation(array) / Math.sqrt(n);
  } else {
    return 0;
  }
}

function getBBNHValues(group_data) {
  return group_data.map((datum) => datum.birdnhour);
}

function getBinStatitics(data, bin) {
  let bindata = getBBNHValues(getBinData(data, bin));
  return { mean: getMean(bindata), se: getStandardError(bindata) };
}

const groupBinStatistics = (group_data, bins) => {
  return bins.map((bin) => getBinStatitics(group_data, bin));
};

const groupBinStatisticsD3 = (group_data, bins) => {
  return bins.map((bin) => {
    return { bin, ...getBinStatitics(group_data, bin) };
  });
};

const flatBinStats = (binstats) => {
  let mean = binstats.map((stats) => stats.mean);
  let se = binstats.map((stats) => stats.se);
  return { mean, se };
};

function getEffortIds(data) {
  return getGroups(data, "effort_id");
}

function groupByEffortId(data) {
  let efforts = getEffortIds(data);
  return variableGroupper(data, efforts, "effort_id");
}

function findEffort(capture, effort_data) {
  return effort_data.filter((effort) => effort.effort_id === capture.effort_id);
}

function joinNetHours(capture_group_data, effort_data) {
  return capture_group_data.map((capture) => {
    let effort_info = findEffort(capture, effort_data)[0];
    return {
      ...capture,
      nethours: effort_info.nethours,
      date: effort_info.date,
    };
  });
}

function birdsBy100NH(data) {
  return (100 * data.data.length) / data.nethours;
}

function groupNetHourFlatter(group_data, effort_data) {
  let data_by_effort = joinNetHours(
    groupByEffortId(group_data.data),
    effort_data
  );
  return { ...group_data, data: data_by_effort };
}

function groupNetHourFlatter2(group_data, effort_data) {
  let data_by_effort = joinNetHours(groupByEffortId(group_data), effort_data);
  return data_by_effort;
}

function binner(data, bins) {
  let julian = dataJulianner(data);
  return dataBinner(julian, bins);
}

function withinGroupsFunction(group_data, effort_data, bins) {
  let data_by_effort = groupNetHourFlatter(group_data, effort_data);
  let effort_id_calc = data_by_effort.data.map((eff) => {
    let binned_eff = binner(eff, bins);
    return { ...binned_eff, birdnhour: birdsBy100NH(eff) };
  });

  return { ...data_by_effort, data: effort_id_calc };
}

function groupD3FlatData(data, bin) {
  let stats = groupBinStatisticsD3(data.data, bin);

  let flatGroup = stats.map((datumstat) => {
    return { group: data.group, ...datumstat };
  });

  return flatGroup;
}

function numericGroups(groups) {
  return groups.map((data, i) => i);
}

function stackerD3(data, groups) {
  let stacked = d3
    .stack()
    .keys(numericGroups(groups))
    .value(function (d, key) {
      return d.values[key] ? d.values[key].mean : 0;
    })(data);

  return stacked;
}

function binNestter(data) {
  return d3
    .nest()
    .key((d) => d.bin)
    .entries(data);
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}

function dataCreator(data, variables, effort_data, bins) {
  let data_with_group = data.map((datum) => dataGroupper(datum, variables));
  let groups = getGroups(data_with_group, "group");
  let grouped_data = groupGroupper(data_with_group, groups).map((group) =>
    withinGroupsFunction(group, effort_data, bins)
  );
  return { data: grouped_data, groups };
}

function createD3Data(data, variables, effort_data, bins) {
  let groupped_data = dataCreator(data, variables, effort_data, bins);
  let d3_grouppes = groupped_data.data.map((datum) =>
    groupD3FlatData(datum, bins)
  );

  let nested_data = binNestter(flatten(d3_grouppes));

  let stacked_data = stackerD3(nested_data, groupped_data.groups);
  return {    flat: flatten(d3_grouppes),

    stack: stacked_data,
    groups: groupped_data.groups,
  };
}

function newNHcalculator(group_data, data) {
  if (group_data.data.length > 0) {
    return (100 * group_data.data.length) / data.total_nh;
  } else {
    return 0;
  }
}

function newCreateD3(data, variables, effort_data, bins) {
  let data_with_group = data.map((datum) => dataGroupper(datum, variables));
  let groups = getGroups(data_with_group, "group").sort();
  let nethour_data = groupNetHourFlatter2(data_with_group, effort_data);
  let binned_data = nethour_data.map((datum) => binner(datum, bins));
  let binsGroupped = bins.map((bin) => {
    let this_bin_data = binned_data.filter((datum) => datum.bin === bin);
    let this_bin_nethours = this_bin_data.reduce(
      (sum, datum) => sum + datum.nethours,
      0
    );
    let this_bin_grouped_data = groupGroupper(
      flatten(this_bin_data.map((datum) => datum.data)),
      groups
    );
    return { bin, data: this_bin_grouped_data, total_nh: this_bin_nethours };
  });

  let binData = binsGroupped.map((datum) => {
    let groupMean = datum.data.map((group_datum) => {
      return {
        group: group_datum.group,
        bin: datum.bin,
        mean: newNHcalculator(group_datum, datum),
        se: 0,
      };
    });
    return groupMean;
  });
  let nested_data = binNestter(flatten(binData));

  let stacked_data = stackerD3(nested_data, groups);
  console.log(flatten(binData))
  return {
    stack: stacked_data,
    groups: groups,
    flat: flatten(binData),
  };
}

function groupFlatter(data, bin) {
  return data.map((datum) => {
    return {
      group: datum.group,
      stats: flatBinStats(groupBinStatistics(datum.data, bin)),
    };
  });
}

function createPlot(divId, data, variables, effort_data, bins) {
  var margin = { top: 10, right: 60, bottom: 30, left: 60 },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var d3Data = newCreateD3(data, variables, effort_data, bins);
  console.log(d3Data);
  var svg = d3
    .select(divId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xAxis = d3.scaleLinear().domain([0, 365]).range([0, width]);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxis).ticks(365 / 5));

  var ticks = d3.selectAll(".tick text");
  ticks.each(function (_, i) {
    if (i % 2 !== 0) d3.select(this).remove();
  });

  const yAxis = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(flatten(d3Data.stack), function (d) {
        return +d;
      }) * 1.2,
    ])
    .range([height, 0]);

  svg.append("g").call(d3.axisLeft(yAxis));

  // color palette
  var color = d3
    .scaleOrdinal()
    .domain(d3Data.groups)
    .range([
      "#FF0000FF",
      "#FFFF00FF",
      "#00FF00FF",
      "#00FFFFFF",
      "#0000FFFF",
      "#FF00FFFF",
    ]);

  // Show the areas
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
          return xAxis(d.data.key);
        })
        .y0(function (d) {
          return yAxis(d[0]);
        })
        .y1(function (d) {
          return yAxis(d[1]);
        })
    );

  svg
    .selectAll("mydots")
    .data(d3Data.groups)
    .enter()
    .append("circle")
    .attr("cx", width)
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
    .data(d3Data.groups)
    .enter()
    .append("text")
    .attr("x", width + 10)
    .attr("y", function (d, i) {
      return 105 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "black")
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}

function updateData(divId, data, variables, effort_data, bins) {
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  var newd3Data = newCreateD3(data, variables, effort_data, bins);

  const xAxis = d3.scaleLinear().domain([0, 365]).range([0, width]);

  const yAxis = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(flatten(newd3Data.stack), function (d) {
        return +d;
      }) * 1.2,
    ])
    .range([height, 0]);

  var svg = d3.select(divId);

  var paths = svg.select("g").selectAll("path.area").data(newd3Data.stack);
  paths.exit().remove(); //remove unneeded circles
  paths.enter().append("path");
  console.log(paths);

  paths
    .transition()
    .duration(0)
    .attr(
      "d",
      d3
        .area()
        .x(function (d, i) {
          return xAxis(d.data.key);
        })
        .y0(function (d) {
          return yAxis(d[0]);
        })
        .y1(function (d) {
          return yAxis(d[1]);
        })
    );
}

module.exports= {
  onlyUnique,
  getGroups,
  organizeGroups,
  createBins,
  findBin,
  getBins,
  createDate,
  createJulianDay,
  createGroupType,
  dataBinner,
  dataJulianner,
  dataGroupper,
  dateCreator,
  groupFinder,
  groupGroupper,
  
  getMean,
  getStandardDeviation,
  getStandardError,
  variableGroupper,
  variableFinder,
  getEffortIds,
  groupByEffortId,
  joinNetHours,
  birdsBy100NH,
  groupNetHourFlatter,
  dataCreator,
  binner,
  groupBinStatistics,
  flatBinStats,
  groupFlatter,
  groupD3FlatData,
  binNestter,
  stackerD3,
  numericGroups,
  createD3Data,
  createPlot,
  newCreateD3,
  updateData,
  filterStation,
  filterCaptures,
  getEffIds

};
