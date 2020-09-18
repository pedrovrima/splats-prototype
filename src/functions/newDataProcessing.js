var d3 = require("d3");



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

const arrayPaster = (array1, array2) =>
  flatten(array1.map((arr1) => array2.map((arr2) => valuePaster(arr1, arr2))));

const longPaster = (arrays) => {
  return arrays.reduce((container, arr, i) => {
    if (i === 0) {
      return arr;
    } else {
      return arrayPaster(container, arr);
    }
  }, []);
};

const getGroups = (data, variables) => {
  const { groups } = data;
  const selectedGroups = groups.filter(
    (group) => variables.indexOf(group.variable) > -1
  );
  return longPaster(selectedGroups.map((datum) => datum.data));
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

const dataGroup = (data, variables) => {
  return variables.reduce((group, varName, i) => {
    return i === 0 ? `${data[varName]}` : `${group} ${data[varName]}`;
  }, []);
};

const capturesGroupCounter = (data, groups, variables, counter) => {
  if (data.length > 0) {
    const ordered_variiables = variables.sort();
    return data.reduce((counter, datum) => {
      let datumGroup = dataGroup(datum, ordered_variiables);
      return { ...counter, [datumGroup]: counter[datumGroup] + 1 };
    }, counter);
  } else {
    return counter;
  }
};

const binTransformer = (bin_data, groups, variables) => {
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
        counter
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
        (Math.pow(0.5, 2) * sq_nh * Math.pow(data, 2)) /
          Math.pow(total_nh, 4) +
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

const binGroupProcessor = (bin_data, groups, variables, i) => {
  return bin_data.map((bin) => {

    const groups_data = binTransformer(bin.data, groups, variables);
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
    return { bin: bin.bin, bin_se: binSe, ...groups_data, groupStats };
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
  return d3
    .nest()
    .key((d) => d.bin)
    .entries(data);
}

const plotDataProcessing = (data, binSize, stations, variables) => {
  const bins = createBins(365, binSize);
  const groups = getGroups(data, variables);

  const stationData = filterStations(data.populated_effort, stations);

  const binData = newBinGroupper(stationData, bins);


  const processed_data = binGroupProcessor(binData, groups, variables);

  const justStats = processed_data.map((bin) => bin.groupStats);
  const stacked = stackerD3(binNestter(flatten(justStats)), groups);
  const flatStack = flatten(flatten(stacked));

  return {
    yMax: Math.max(...flatStack),
    ses: processed_data.map((datum) => datum.bin_se),
    stack: stacked,
    groups: groups,
    flat: flatten(processed_data),
    effortData: processed_data.map((datum) => {
      return { value: datum.total_nh, group: datum.bin };
    }),
  };
};



module.exports={plotDataProcessing}