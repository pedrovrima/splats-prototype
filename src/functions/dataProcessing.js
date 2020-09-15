var d3 = require("d3");
const { effort_data, capture_data, regions } = require("../data");

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




const dataProcessing = (effort, captures) => {
  // Julian effort

  //put captures inside effort
  const populated_effort = effort.reduce((container, eff) => {
    const this_captures = captures.filter(
      (cap) => cap.effort_id === eff.effort_id
    );
    return [
      ...container,
      { ...eff, jday: createJulianDay(eff.date), capture_data: this_captures },
    ];
  }, []);

  //put effort insidre region

  const populate_regions = regions.reduce((container, reg) => {
    const this_efforts = populated_effort.filter(
      (eff) => reg.stations.indexOf(eff.station) > -1
    );
    const this_region = { ...reg, effort_data: this_efforts };
    return { ...container, [reg.region]: this_region };
  }, []);

  return populate_regions;

  //returns object with map and filter
};

const createGroupType = (data, variables) => {
  let variable_values = variables.map((variable) => data[variable]);
  return variable_values.join(" ");
};

const dataGroupper = (data, variables) => {
  return { ...data, group: createGroupType(data, variables) };
};

const regionGroupper = (region_data, variables) => {
  const groupped_regions = Object.keys(region_data).reduce(
    (new_reg, reg_key) => {
      const reg = region_data[reg_key];

      const groupped_efforts = reg.effort_data.map((eff) => {
        const new_cap = eff.capture_data.map((cap) =>
          dataGroupper(cap, variables)
        );
        return { ...eff, capture_data: new_cap };
      });
      return {
        ...new_reg,
        [reg_key]: { ...reg, effort_data: groupped_efforts },
      };
    },
    {}
  );
  return groupped_regions;
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

const dataBinner = (data, bins) => {
  return { ...data, bin: findBin(data.jday, bins) };
};

const effortBinners = (effort_data, bins) => {
  const new_efforts = effort_data.map((eff) => {
    const binned_effort = dataBinner(eff, bins);
    return binned_effort;
  });

  return new_efforts;
};

const groupGroupper = (effort_data, groups) => {
  const groupped_effort = effort_data.map((eff) => {
    const group_data = groups.reduce((container, group) => {
      return {
        ...container,
        [group]: eff.capture_data.filter((cap) => cap.group === group),
      };
    }, {});
    return { ...eff, group_data };
  });
  return groupped_effort;
};

const group_getter = (regions_data) => {
  const groups = Object.keys(regions_data).reduce((container, reg_key) => {
    const reg = regions_data[reg_key];
    const groups = reg.effort_data.map((eff) =>
      eff.capture_data.map((cap) => cap.group)
    );
    const uniqueGroups = [...new Set(flatten(groups))];

    return [...new Set([...container, ...uniqueGroups])];
  }, []);
  return groups;
};

const binGroupper = (effort_data, bins) => {
  const bin_data = bins.reduce((container, bin) => {
    const this_bin_data = effort_data.filter((eff) => eff.bin === bin);

    return [...container, { bin, data: this_bin_data }];
  }, []);
  return bin_data;
};

const createGroupData = (groups) =>
  groups.reduce((container, group) => {
    return { ...container, [group]: [] };
  }, {});

const groupJoinner = (bin_data, groups) => {
  let data = bin_data.reduce(
    (container, bin, i) => {
      const nethours = bin.nethours ? bin.nethours : 0;
      const total_nh = container.total_nh + nethours;
      const sq_nh = container.sq_nh + Math.pow(nethours, 2);
      const group_data = Object.keys(container.group_data).reduce(
        (group_container, group, j) => {
          const final_data = bin.group_data
            ? [...group_container[group], ...bin.group_data[group]]
            : group_container[group];
          return { ...group_container, [group]: final_data };
        },
        container.group_data
      );

      return { total_nh, group_data, sq_nh };
    },
    { total_nh: 0, data: [], sq_nh: 0, group_data: createGroupData(groups) }
  );

  return data;
};

function NHCalculator(data, nh) {
  if (data.length > 0) {
    return (100 * data.length) / nh;
  } else {
    return 0;
  }
}

function SEcalculator(data, total_nh, sq_nh) {
  if (data.length > 0) {
    return (
      2 *
      100 *
      Math.sqrt(
        (Math.pow(0.5, 2) * sq_nh * Math.pow(data.length, 2)) /
          Math.pow(total_nh, 4) +
          data.length / Math.pow(total_nh, 3)
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

const binGroupProcessor = (bin_data, groups) =>
  bin_data.map((bin) => {
    const groups_data = groupJoinner(bin.data, groups);
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

function numericGroups(groups) {
  return groups.map((data, i) => i);
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, []);
}

function binNestter(data) {
  return d3
    .nest()
    .key((d) => d.bin)
    .entries(data);
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

const data = dataProcessing(
  effort_data.effort_data,
  capture_data.capture_data,
  regions.regions
);

const groupProcessing = (data, variables,from) => {
  const groupped_data = regionGroupper(data, variables.sort());
  const groups = group_getter(groupped_data).sort();
  return { groupped_data, groups };
};




const createBins = (max, size) => {
  let number_of_bins = Math.ceil(max / size);
  let bins = [];
  for (let i = 0; i < number_of_bins; i++) {
    bins.push(5 + i * size);
  }
  return bins;
};

const filterEffort = (data,stations)=> {
  const filtered_effort=data.effort_data.filter(eff=>stations.indexOf(eff.station)>-1)
  return({...data,effort_data:filtered_effort})
}

const binProcessing = (pre_groupped_data, region, binSize,stations) => {
  const bins = createBins(365, binSize);

  const { groupped_data, groups } = pre_groupped_data;
  const region_data = stations?filterEffort(groupped_data[region],stations):groupped_data[region];



  const processed_data = binGroupProcessor(
    binGroupper(
      groupGroupper(effortBinners(region_data.effort_data, bins), groups),
      bins
    ),
    groups
  );
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


module.exports = { data, binProcessing, groupProcessing };
// const joined_groups = binGroupProcessor(binned_data)

// console.log(SEScalculator(sesGroup(joined_groups)))
// console.log(birdsPerNh(joined_groups))

// console.log(groupGroupper(groupped.COAST.effort_data,["AHY","HY"])[395])
