var d3_collection = require("d3-collection");

var d3 = require("d3");
var _d3Array = require("d3-array");

const createBins = (max, size) => {
  let number_of_bins = Math.ceil(max / size);
  let bins = [];
  for (let i = 0; i < number_of_bins; i++) {
    bins.push(5 + i * size);
  }
  return bins;
};

const valuePaster = (val1, val2) => `${val1} ${val2}`;

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}

const hyCollapseRemover = (value1, value2, hyCollapse) => {
  return value1 === "HY" ? (!hyCollapse ? value2 : "") : value2;
};

const ageCollapser=(value,ahyCollapse)=> 
{
  return value==="HY"||value.length===1?value:ahyCollapse?"AHY":value
}

const arrayPaster = (array1, array2, hyCollapse) =>
  flatten(
    array1.map((arr1) =>
      array2.map((arr2) => valuePaster(arr1, hyCollapseRemover(arr1, arr2, hyCollapse)))
    )
  );

const longPaster = (arrays, hyCollapse,ahyCollapse) => {
  return arrays.reduce((container, arr, i) => {
    if (i === 0) {
      return arr.map(ar1=>ageCollapser(ar1,ahyCollapse));
    } else {
      return arrayPaster(container, arr, hyCollapse);
    }
  }, []);
};

const uniqueArray = (arr) => [...new Set(arr)];

const getGroups = (data, variables, hyCollapse,ahyCollapse) => {
  const { groups } = data;
  const selectedGroups = groups.filter(
    (group) => variables.indexOf(group.variable) > -1
  );
  const groups2 = longPaster(selectedGroups.map((datum) => datum.data),hyCollapse,ahyCollapse);
  return uniqueArray(groups2);
};

const filterStations = (effort, stations) => {
  return effort.filter((eff) => stations.indexOf(eff.station) > -1);
};

const findBin = (value, bins) => {
  let correctBin = bins.filter((bin, i) => {
    if (i + 1 < bins.length) {
      return value <= bin + 5 && value > bins[i - 1] - 5;
    } else {
      return value <= bin;
    }
  });
  return correctBin[0];
};

const newBinGroupper = (effort_data, bins) => {
  const bin_data = bins.reduce((container, bin) => {
    const this_bin_data = effort_data.filter(
      (eff) => findBin(eff.jday, bins) === bin
    );

    return [...container, { bin, data: this_bin_data }];
  }, []);
  return bin_data;
};

const dataGroup = (data, variables, hyCollapse,ahyCollapse) => {
  const group= variables.reduce((group, varName, i) => {
    return i === 0
      ? `${ageCollapser(data[varName],ahyCollapse)}`
      : `${group} ${
        hyCollapseRemover(group,
         data[varName],hyCollapse
         )
        }`;
  }, "");
  return group
};

const capturesGroupCounter = (data, groups, variables, counter,hyCollapse,ahyCollapse) => {
  if (data.length > 0) {
    const ordered_variiables = variables.sort();
    return data.reduce((counter, datum) => {
      let datumGroup = dataGroup(datum, ordered_variiables,hyCollapse,ahyCollapse);
      return { ...counter, [datumGroup]: counter[datumGroup] + 1 };
    }, counter);
  } else {
    return counter;
  }
};

const capturesGroupSummer = (
  data,
  groups,
  group_variables,
  sum_variables,
  counter,hyCollapse,ahyCollapse
) => {
  if (data.length > 0) {
    const ordered_variables = group_variables.sort();

    return data.reduce((counter, datum, i) => {
      let datumGroup = dataGroup(datum, ordered_variables,hyCollapse,ahyCollapse);
      const recounter =
        !counter[datumGroup] || data[i][sum_variables.name] === "NA"
          ? counter
          : {
              ...counter,
              [datumGroup]: {
                sqsum:
                  counter[datumGroup].sqsum +
                  Math.pow(data[i][sum_variables.name], 2),
                sum: counter[datumGroup].sum + data[i][sum_variables.name],
                length: counter[datumGroup].length + 1,
              },
            };

        return recounter
    }, counter);
  } else {
    return counter;
  }
};

const binVariableTransformer = (
  bin_data,
  groups,
  variables,
  variable_data,
  bin_num,
  hyCollapse,ahyCollapse
) => {
  const counter = !groups.length
    ? { ["none"]: { sqsum: 0, sum: 0, length: 0 } }
    : groups.reduce((counter, group) => {
        return { ...counter, [group]: { sqsum: 0, sum: 0, length: 0 } };
      }, {});

  const data = bin_data.reduce(
    (container, bin, i) => {
      const nethours = bin.nethours ? bin.nethours : 0;
      const total_nh = container.total_nh + nethours;
      const sq_nh = container.sq_nh + Math.pow(nethours, 2);
      const thin_bin_data = capturesGroupSummer(
        bin.capture_data,
        groups,
        variables,
        variable_data,
         counter,
        hyCollapse,ahyCollapse
      );
      const group_data = Object.keys(container.group_data).reduce(
        (new_container, key) => {
          return {
            ...new_container,
            [key]: {
              sqsum: new_container[key].sqsum + thin_bin_data[key].sqsum,
              sum: new_container[key].sum + thin_bin_data[key].sum,
              length: new_container[key].length + thin_bin_data[key].length,
            },
          };
        },
        container.group_data
      );

      return { total_nh, group_data, sq_nh };
    },
    { total_nh: 0, data: [], sq_nh: 0, group_data: counter }
  );
  const new_data = Object.keys(data.group_data).reduce(
    (container, grp) =>
      data.group_data[grp].length > 4
        ? { ...container, [grp]: data.group_data[grp] }
        : { ...container, [grp]: { sqsum: 0, sum: 0, length: 0 } },
    data.group_data
  );
  return { ...data, group_data: new_data };
};

const binSplatsTransformer = (bin_data, groups, variables,hyCollapse,ahyCollapse) => {
  const counter = groups.reduce((counter, group) => {
    return { ...counter, [group]: 0 };
  }, {});

  let data = bin_data.reduce(
    (container, bin, i) => {
      const nethours = bin.nethours ? bin.nethours : 0;
      const total_nh = container.total_nh + nethours;
      const sq_nh = container.sq_nh + Math.pow(nethours, 2);
      const thin_bin_data = capturesGroupCounter(
        bin.capture_data,
        groups,
        variables,
        counter,
        hyCollapse,ahyCollapse
      );
      const group_data = Object.keys(container.group_data).reduce(
        (new_container, key) => {
          return {
            ...new_container,
            [key]: new_container[key] + thin_bin_data[key],
          };
        },
        container.group_data
      );
      return { total_nh, group_data, sq_nh };
    },
    { total_nh: 0, data: [], sq_nh: 0, group_data: counter }
  );
  return data;
};

function NHCalculator(data, nh) {
  if (data > 0) {
    return (100 * data) / nh;
  } else {
    return 0;
  }
}

function SEcalculator(data, total_nh, sq_nh) {
  if (data > 0) {
    return (
      2 *
      100 *
      Math.sqrt(
        (Math.pow(0.5, 2) * sq_nh * Math.pow(data, 2)) / Math.pow(total_nh, 4) +
          data / Math.pow(total_nh, 3)
      )
    );
  } else {
    return 0;
  }
}

let SEScalculator = (datum) =>
  Math.sqrt(
    datum.reduce((sum, val) => {
      return sum + Math.pow(val.se, 2);
    }, 0)
  );

const binGroupProcessor = (bin_data, groups, variables, hyCollapse,ahyCollapse) => {
  return bin_data.map((bin) => {
const totalCaps= bin.data.reduce((cont,val)=>cont+val.capture_data.length,0)
    const groups_data = binSplatsTransformer(bin.data, groups, variables,hyCollapse,ahyCollapse);
    const groupStats = Object.keys(groups_data.group_data).map((group_key) => {
      const group_data = groups_data.group_data[group_key];

      const groupsSE = SEcalculator(
        group_data,
        groups_data.total_nh,
        groups_data.sq_nh
      );
      const birdsPerNh = NHCalculator(group_data, groups_data.total_nh);
      return { bin: bin.bin, group: group_key, se: groupsSE, bnh: birdsPerNh };
    });
    const binSe = SEScalculator(groupStats);
    return { bin: bin.bin, bin_se: binSe, ...groups_data, groupStats,totalCaps };
  });
};

const varSeCalculator = (group_data) => {
  return group_data.sqsum > 0
    ? Math.sqrt(
        (group_data.sqsum / group_data.length -
          Math.pow(group_data.sum / group_data.length, 2)) /
          group_data.length
      )
    : 0;
};

const varMeanCalculator = (group_data, key) => {
  return group_data.sqsum > 0 ? group_data.sum / group_data.length : 0;
};

const varGroupProcessor = (
  bin_data,
  groups,
  variables,
  variable_data,      ahyCollapse,
  hyCollapse
) => {
  return bin_data.map((bin) => {
    const groups_data = binVariableTransformer(
      bin.data,
      groups,
      variables,
      variable_data,
      bin.bin,
      ahyCollapse,
      hyCollapse
    );
    const groupStats = Object.keys(groups_data.group_data).map((group_key) => {
      const group_data = groups_data.group_data[group_key];

      const groupsSE = varSeCalculator(group_data);
      const mean = varMeanCalculator(group_data, group_key);
      return { bin: bin.bin, group: group_key, se: groupsSE, mean: mean };
    });

    return { bin: bin.bin, ...groups_data, groupStats };
  });
};

function numericGroups(groups) {
  return groups.map((data, i) => i);
}

function stackerD3(data, groups) {
  let stacked = d3
    .stack()
    .keys(numericGroups(groups))
    .value(function (d, key) {
      return d.values[key] ? d.values[key].bnh : 0;
    })(data);

  return stacked;
}

function binNestter(data) {
  return d3_collection
    .nest()
    .key((d) => d.bin)
    .entries(data);
}


const plotFullProcessing = (
  data,
  binSize,
  stations,
  variables,
  variable_data,
  hyCollapse,ahyCollapse
) => {
  const bins = createBins(365, binSize);
  const groups = getGroups(data, variables,hyCollapse,ahyCollapse);

  const stationData = filterStations(data.populated_effort, stations);

  const binData = newBinGroupper(stationData, bins);

  const processed_data = binGroupProcessor(binData, groups, variables,hyCollapse,ahyCollapse);
  

  const justStats = processed_data.map((bin) => bin.groupStats);
  const stacked = stackerD3(binNestter(flatten(justStats)), groups);
  const flatStack = flatten(flatten(stacked));
  const varprocessed_data = varGroupProcessor(
    binData,
    groups,
    variables,
    variable_data,hyCollapse,ahyCollapse
    
  );


  const varjustStats = flatten(
    varprocessed_data.map((bin) => bin.groupStats)
  ).filter((grp) => grp.se > 0);
  const nested = d3_collection
    .nest()
    .key((d) => d.group)
    .entries(varjustStats);

  return {
    splats: {
      yMax: Math.max(...flatStack),
      ses: processed_data.map((datum) => datum.bin_se),
      stack: stacked,
      groups: groups,
      flat: flatten(processed_data),
    },
    vari: {
      nested,
      groups,
      variable_data: variable_data,
      flat: varjustStats,
    },
    abundanceData: processed_data.map((datum) => {
      return { value: datum.totalCaps, group: datum.bin };
    }),
    
    effortData: processed_data.map((datum) => {
      return { value: datum.total_nh, group: datum.bin };
    }),
  };
};

export default { plotFullProcessing };
