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

const dataProcessing = (effort, captures, variables) => {
  // Julian effort

  const groups = variables.sort().map((vari) => {
    return {
      variable: vari,
      data: [...new Set(captures.map((cap) => cap[vari]))].sort(),
    };
  });

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

  return { populated_effort, groups };

  //returns object with map and filter
};

const filterStations = (effort, stations) => {
  return effort.filter((eff) => stations.indexOf(eff.station) > -1);
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

const binGroupProcessor = (bin_data, groups,variables,i) =>{
  return bin_data.map((bin) => {
    const groups_data = binTransformer(bin.data, groups,variables);
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
  })};

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

// const data = dataProcessing(
//   effort_data.effort_data,
//   capture_data.capture_data,
//   regions.regions
// );

const groupProcessing = (data, variables, from) => {
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

const filterEffort = (data, stations) => {
  const filtered_effort = data.effort_data.filter(
    (eff) => stations.indexOf(eff.station) > -1
  );
  return { ...data, effort_data: filtered_effort };
};

const binProcessing = (data, binSize, stations,variables) => {
  const bins = createBins(365, binSize);
  const groups = getGroups(data, variables);

  
  const stationData = filterStations(populated_effort, stations);

  const binData = newBinGroupper(stationData, bins);

  const processed_data = binGroupProcessor(
    binData,groups,variables
  )

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



const newBinGroupper = (effort_data, bins) => {
  const bin_data = bins.reduce((container, bin) => {
    const this_bin_data = effort_data.filter(
      (eff) => findBin(eff.jday, bins) === bin
    );

    return [...container, { bin, data: this_bin_data }];
  }, []);
  return bin_data;
};

const uniqueValues = (variable) => (data) => {
  return [...new Set(...data.map((datum) => data[variable]))];
};

const valuePaster = (val1, val2) => `${val1} ${val2}`;

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

const data = dataProcessing(
  effort_data.effort_data,
  capture_data.capture_data,
  ["SexClass", "AgeClass"]
);

const getGroups = (data, variables) => {
  const { groups } = data;
  const selectedGroups = groups.filter(
    (group) => variables.indexOf(group.variable) > -1
  );
  return longPaster(selectedGroups.map((datum) => datum.data));
};

const dataGroup = (data, variables) => {

  return variables.reduce((group, varName, i) => {
    {
      return i === 0 ? `${data[varName]}` : `${group} ${data[varName]}`;
    }
  }, []);
};

const capturesGroupCounter = (data, groups, variables,counter) => {
  
  if(data.length>0){
  const ordered_variiables = variables.sort();
  return data.reduce((counter, datum) => {
    let datumGroup = dataGroup(datum, ordered_variiables);
    return { ...counter, [datumGroup]: counter[datumGroup] + 1 };
  }, counter);
}else{
  return(counter)
}

};

const binGroupCounter = (data, groups, variables,) => {
    const counter = groups.reduce((counter, group) => {
    return { ...counter, [group]: 0 };
  }, {});

  return data.data.map((datum) => capturesGroupCounter(datum.capture_data, groups, variables,counter));


};



const binTransformer = (bin_data, groups,variables) => {
  const counter = groups.reduce((counter, group) => {
    return { ...counter, [group]: 0 };
  }, {});

  let data = bin_data.reduce(
    (container, bin, i) => {
      const nethours = bin.nethours ? bin.nethours : 0;
      const total_nh = container.total_nh + nethours;
      const sq_nh = container.sq_nh + Math.pow(nethours, 2);
      const thin_bin_data = capturesGroupCounter(bin.capture_data, groups, variables,counter)
      const group_data = Object.keys(container.group_data).reduce((new_container, key) => {
        return { ...new_container, [key]: new_container[key] + thin_bin_data[key] }},container.group_data)
      return { total_nh, group_data, sq_nh };
    },
    { total_nh: 0, data: [], sq_nh: 0, group_data: counter }
  );

  return data;
};



const binGroupSummer = (array) => {
 return array.reduce((container, arr, i) => {
    if (i === 0) {
      return arr;
    } else {
      return Object.keys(arr).reduce((container, key) => {
        return { ...container, [key]: container[key] + arr[key] };
      }, container);
    }
  }, {});
};


const binNhSummer = (bin)=>{
   return bin.data.reduce((total_nh,effort)=>{
    return total_nh+effort.nethours
  },0)

}
function nhCalculator(nh,captures) {
return 100 * captures / nh
}

function seCalculator(captures, nh, sq_nh) {
  if (captures > 0) {
    return (
      2 *
      100 *
      Math.sqrt(
        (Math.pow(0.5, 2) * sq_nh * Math.pow(captures, 2)) /
          Math.pow(nh, 4) +
          captures / Math.pow(nh, 3)
      )
    );
  } else {
    return 0;
  }
}

const groupsNhCalc = (nh,counter)=>{
  return Object.keys(counter).map((key)=>{  
    return nhCalculator( nh,counter[key])
  })
}







  const { populated_effort } = data;
  const bins = createBins(365, 10);
  const groups = getGroups(data, ["SexClass", "AgeClass"]);

  const stationData = filterStations(populated_effort, ["HOME","PARK"]);

  const binData = newBinGroupper(stationData, bins);
  

  console.log(binProcessing(data,10,["HOME","PARK"],["AgeClass"]))

//   console.log(binTransformer(binData[25].data,groups, ["SexClass", "AgeClass"]))


//   console.log(binGroupSummer(binGroupCounter(binData[25],groups,["SexClass","AgeClass"])))

// console.log(binNhSummer(binData[25]))






// module.exports = { data, binProcessing, groupProcessing };
// // const joined_groups = binGroupProcessor(binned_data)

// // console.log(SEScalculator(sesGroup(joined_groups)))
// // console.log(birdsPerNh(joined_groups))

// // console.log(groupGroupper(groupped.COAST.effort_data,["AHY","HY"])[395])


