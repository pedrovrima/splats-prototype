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

const dataProcessing = (effort, captures, regions) => {
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
    const uniqueGroups = [...new Set(...groups)];
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

const groupJoinner = (bin_data) => {
  let data = bin_data.reduce(
    (container, bin, i) => {
      const total_nh = container.total_nh + bin.nethours;
      const pre_group_data = i === 0 ? bin.group_data : container.group_data;
      const group_data = Object.keys(pre_group_data).reduce(
        (group_container, group, j) => {
          const final_data =
            i === 0
              ? group_container[group]
              : [...group_container[group], ...bin.group_data[group]];
          return { ...group_container, [group]: final_data };
        },
        pre_group_data
      );

      return { total_nh, group_data };
    },
    { total_nh: 0, data: [], group_data: {} }
  );

  return data;
};




function newNHcalculator(group_data, data) {
    if (group_data.data.length > 0) {
      return (100 * group_data.data.length) / data.total_nh;
    } else {
      return 0;
    }
  }
  

const birdsPerNh (bin_data)=>{
    Object.keys(bin_data.group_data).map(group_kty=>{
        
    })



}


const data = dataProcessing(
  effort_data.effort_data,
  capture_data.capture_data,
  regions.regions
);
const groupped = regionGroupper(data, ["AgeClass", "SexClass"]);
const groups = group_getter(groupped);

const binned_coast = effortBinners(groupped.COAST.effort_data, [
  50,
  100,
  150,
  200,
  250,
  300,
  365,
]);
const groupped_coast = groupGroupper(binned_coast, groups);
const binned_data = binGroupper(groupped_coast, [
  50,
  100,
  150,
  200,
  250,
  300,
  365,
]);






// console.log(groupGroupper(groupped.COAST.effort_data,["AHY","HY"])[395])
