const d3 = require("d3");

const {Axis, default_dimensions,addAxis,createSvg,updateYAxis} = require("./plot_parts")


const addBars = (svg,data,dimensions,axis)=>    svg
.append("g")
.attr("class", "bars")
.selectAll()
.data(data)
.enter()
.append("rect")
.attr("x", function (d) {
    return axis.x(d.group-(365/data.length)/2);
})
.attr("y",dimensions.height)
.transition().duration(1000)
.attr("y", function (d) {
  return axis.y(d.value);
})
.attr("width", dimensions.width/data.length)
.attr("height", function (d) {
  return dimensions.height - axis.y(d.value);
})
.attr("fill", "#69b3a2");



const createEffort = (data, effDiv, dimensions) => {
    let allNh = data.map((d) => d.value);

    const  height = 200 - dimensions.margins.top - dimensions.margins.bottom;
    const new_dimensions = {...dimensions,height}

    // createSvg

    var svg = createSvg(effDiv,new_dimensions)  
    
    // Create axis 
      const axis = Axis(new_dimensions,allNh)
   
    
    // X axis
    addAxis(svg,axis,height)
  
    // Bars

    addBars(svg,data,new_dimensions,axis)

  };
  


  const updateEffort = (data, effDiv, dimensions) => {
    const  height = 200 - dimensions.margins.top - dimensions.margins.bottom;
    const new_dimensions = {...dimensions,height}

    var svg = d3.select(effDiv);
  
    // get y needed data
    let allNh = data.map((d) => d.value);
  
    // deal with axis
          
    var axis = Axis(new_dimensions,allNh)
    

    updateYAxis(svg,axis) 
  
    // Bars

    let bars = svg.select("g.bars").selectAll("rect");
  
    bars.transition().duration(500).attr("height", 0).attr("y", height);
  
    svg
      .select("g.bars")
      .selectAll()
      .data(data)
       .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", function (d) {
        return axis.x(d.group-(365/data.length)/2);
      })
  
      .attr("width", dimensions.width/data.length)
      .attr("y", height)
      .transition()
      .duration(900)
  
      .attr("height", function (d) {
        return height - axis.y(d.value);
      })
      .attr("y", function (d) {
        return axis.y(d.value);
      })
  
      .attr("fill", "#69b3a2");
  };
  

  module.exports = {createEffort,updateEffort}