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
  

const dataProcessing = (data, variables) => {
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
  

  const data = dataProcessing(effort_data.effort_data,capture_data.capture_data,["AgeClass","SexClass"])

  export default data