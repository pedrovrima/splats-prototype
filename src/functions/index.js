var d3 = require("d3");

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const getGroups = (data, variable) => {
  let all_values = data.map((datum) => datum[variable]);
  let unique_values = [...new Set(all_values)];
  return unique_values;
};

const filterStation = (effort_data, args) => {
  return effort_data.filter((datum) => args.indexOf(datum.station) > -1);
};

const getEffIds = (effort_data) => effort_data.map((datum) => datum.effort_id);

const filterCaptures = (capture_data, effort_ids) => {
  return capture_data.filter(
    (datum) => effort_ids.indexOf(datum.effort_id) > -1
  );
};

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
    bins.push(5 + i * size);
  }
  return bins;
};

const findBin = (value, bins) => {
  let correctBin = bins.filter((bin, i) => {
    if (i + 1 < bins.length) {
      return value <= bin+5 && value > bins[i - 1]-5;
    } else {
      return value <= bin;
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
  // console.time("filter"+data.length)
  let found = data.filter((datum) => datum[variable_name] === variable);
  // console.timeEnd("filter"+data.length)
  return found;
};

const groupFinder = (data, group) => {
  return variableFinder(data, group, "group");
};

const variableGroupper = (data, variable, variable_name) => {
  // console.time("filter_test" + data.length);
  let grouped_data = variable.map((group) => {
    let found_data = variableFinder(data, group, variable_name);
    let resu = {
      [variable_name]: group,

      data: found_data,
    };
    return resu;
  });
  // console.timeEnd("filter_test" + data.length);

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
  let groups = getGroups(data, "effort_id");
  return groups;
}

function groupByEffortId(data) {
  // console.time("groupper");
  let efforts = variableGroupper(data, getEffortIds(data), "effort_id");
  // console.timeEnd("groupper");
  return efforts;
}

function findEffort(capture, effort_data) {
  return effort_data.filter((effort) => effort.effort_id === capture.effort_id);
}

function joinNetHours(capture_group_data, effort_data) {
  // console.time("jonner");
  let joinedNH = capture_group_data.map((capture) => {
    let effort_info = findEffort(capture, effort_data)[0];
    return {
      ...capture,
      nethours: effort_info.nethours,
      date: effort_info.date,
    };
  });
  // console.timeEnd("jonner");
  return joinedNH;
}

function birdsBy100NH(data) {
  return (100 * data.data.length) / data.nethours;
}

function groupNetHourFlatter2(group_data, effort_data) {
  let data_by_effort = joinNetHours(groupByEffortId(group_data), effort_data);
  return data_by_effort;
}

function binner(data, bins) {
  let julian = dataJulianner(data);
  return dataBinner(julian, bins);
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

function SEcalculator(group_data, data) {
  if (group_data.data.length > 0) {
    return (2* 100 * Math.sqrt(Math.pow(0.5,2)*data.sqr_nh*Math.pow(group_data.data.length,2)/
    Math.pow(data.total_nh,4)+(group_data.data.length/ Math.pow(data.total_nh,3))));
  } else {
    return 0;
  }
}

function newNHcalculator(group_data, data) {
  if (group_data.data.length > 0) {
    return (100 * group_data.data.length) / data.total_nh;
  } else {
    return 0;
  }
}





function newCreateD3(full_data, variables, effort_data, bins) {
  

  let data_with_group = full_data.map((datum) => dataGroupper(datum, variables));
  let groups = getGroups(data_with_group, "group").sort();
  // console.time("part2");
  let filtered_data=filterCaptures(data_with_group, getEffortIds(effort_data))
  let nethour_data = groupNetHourFlatter2(filtered_data, effort_data);
  // console.timeEnd("part2");
  console.log(nethour_data[0])
  console.log(binner({date:"5/14/2008"},createBins(365,10)),binner({date:"5/19/1995"},createBins(365,10)))

  let binned_data = nethour_data.map((datum) => binner(datum, bins));
  let binsGroupped = bins.map((bin) => {
    let this_bin_data = binned_data.filter((datum) => datum.bin === bin);
    let this_bin_nethours = this_bin_data.reduce(
      (sum, datum) => sum + datum.nethours,
      0
    );
    let srq_this_bin_nethours = this_bin_data.reduce(
      (sum, datum) => sum + Math.pow(datum.nethours,2),
      0
    );
    let this_bin_grouped_data = groupGroupper(
      flatten(this_bin_data.map((datum) => datum.data)),
      groups
    );
    return { bin, data: this_bin_grouped_data, total_nh: this_bin_nethours, sqr_nh:srq_this_bin_nethours };
  });
  let binData = binsGroupped.map((datum) => {
    let groupMean = datum.data.map((group_datum) => {
      return {
        group: group_datum.group,
        bin: datum.bin,
        mean: newNHcalculator(group_datum, datum),
        se: SEcalculator(group_datum, datum),
      };
    });
    return groupMean;
  });

  let ses = binData.map(datum=>{
  
    return Math.sqrt(datum.reduce((sum,val)=>{return sum+Math.pow(val.se,2)},0))
  })

  let nested_data = binNestter(flatten(binData));

  let stacked_data = stackerD3(nested_data, groups);
  return {
    ses,
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



export default {
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
  flatten,
  getMean,
  getStandardDeviation,
  getStandardError,
  variableGroupper,
  variableFinder,
  getEffortIds,
  groupByEffortId,
  joinNetHours,
  birdsBy100NH,
  binner,
  groupBinStatistics,
  flatBinStats,
  groupFlatter,
  groupD3FlatData,
  binNestter,
  stackerD3,
  numericGroups,
  newCreateD3,
  filterStation,
  filterCaptures,
  getEffIds,
};
