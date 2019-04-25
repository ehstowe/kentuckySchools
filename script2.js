var geoP=d3.json("kentuckyGeo.json")
var dataP=d3.csv("schoolData2.csv")

Promise.all([geoP, dataP]).then(function(data){

countyDict={}
data[1].forEach(function(d){
  countyDict[d.COUNTY]=d
})
data[0].features.forEach(function(d){
  //console.log(d, "d")
  var v = countyDict[d.properties.NAME]
  d.properties.info=v
})
drawMap(data[0])

})

var drawMap=function(geoData){
  d3.select("#scale").selectAll("*").remove()
  var view="map"
  console.log(geoData, "data")

var screen={width:800, height:400};


var svg=d3.select("#map")
            .attr("width", screen.width)
            .attr("height", screen.height);

var projection=d3.geoAlbersUsa()
              .translate([-650, 125])
              .scale([7000])

var path=d3.geoPath()
            .projection(projection)

svg.selectAll("path")
  .data(geoData.features)
  .enter()
  .append("path")
  .classed("path", true)
  .attr("d", path)
  .attr("stroke", "#505050")
  .attr("fill", "white")

  .on("mouseover", function(d){
    d3.select(this)
      .attr("stroke-width", 5)
    var xPosition=parseFloat(d3.select(this).attr("x"))
    var yPosition=parseFloat(d3.select(this).attr("y"))
    svg.append("text")
    .attr("id", "tooltip")
    .attr("x", 30)
    .attr("y", 40)
    .attr("font-size", "20px")
    .attr("fill", "black")
    .text(d.properties.NAME)
  })
  .on("mouseout", function(d){
    d3.selectAll("#tooltip").remove()
    d3.select(this).attr("stroke-width", 1)
  })


  var menuWidth="200"
  var menuHeight="450"

  var menu=d3.select("#menu")
            .attr("width", menuWidth)
            .attr("height", menuHeight)


var choices=["4-year Graduation Rate", "Attendance Rate", "Average ACT Score",
"College/Career Readiness Percentage",
"Total Revenue Per Pupil", "Average Teacher Salary",
"Average Principal Salary", "View Map/Clear Map", "View Scatterplot"]

var colors=["lightgray", "lightgray", "lightgray", "lightgray",
"lightgray", "lightgray", "lightgray", "slategray", "slategray"]

menu.selectAll("rect")
    .data(choices)
    .enter()
    .append("rect")
    .attr("width", menuWidth)
    .attr("height", menuHeight/choices.length)
    .attr("y", function(d,i){
      return ((menuHeight/choices.length)*(i))})
    .attr("x", 0)
    .style("fill", function(d,i){
      return colors[i]
    })
    .on("mouseover",function(d){
      d3.select(this)
        .style("stroke", "gray")
        .style("stroke-width", "10")
    })
    .on("mouseout", function(d){
      d3.select(this)
      .style("stroke", "none")

    })
    .on("click", function(d){
    //  d3.select(this)
      //  .style("stroke", "blue")
        //.style("stroke-width","20")
      d3.selectAll(".path").remove()
  //    d3.selectAll(".legend").remove()
      var yPosition=parseFloat(d3.select(this).attr("y"))
      if (yPosition<(menuHeight/choices.length)&&view=="map")
      {updateMap(geoData, "GRAD_RATE", svg)
        updateLegend(geoData, "GRAD_RATE")}
      else if(yPosition<(2*menuHeight/choices.length)&&view=="map")
      {updateMap(geoData, "ATT_RATE", svg)
      updateLegend(geoData, "ATT_RATE")}
      else if(yPosition<(3*menuHeight/choices.length)&&view=="map")
      {updateMap(geoData, "AVG_ACT", svg)
      updateLegend(geoData, "AVG_ACT")}
      else if(yPosition<(4*menuHeight/choices.length)&&view=="map")
      {updateMap(geoData, "CCR", svg)
      updateLegend(geoData, "CCR")}
      else if(yPosition<(5*menuHeight/choices.length)&&view=="map")
      {updateMap(geoData, "TOT_REV_PER_PUPIL", svg)
      updateLegend(geoData, "TOT_REV_PER_PUPIL")}
      else if(yPosition<(6*menuHeight/choices.length)&&view=="map")
      {updateMap(geoData, "AVG_TEACHER_SALARY", svg)
      updateLegend(geoData, "AVG_TEACHER_SALARY")}
      else if(yPosition<(7*menuHeight/choices.length)&&view=="map")
      {updateMap(geoData, "AVG_PRINCIPAL_SALARY", svg)
      updateLegend(geoData, "AVG_PRINCIPAL_SALARY")}
      else if(yPosition<(8*menuHeight/choices.length))
      {drawMap(geoData)}
      else if(yPosition<(9*menuHeight/choices.length))
      {drawScatter(geoData)}


    })

menu.selectAll("text")
    .data(choices)
    .enter()
    .append("text")
    .attr("y", function(d,i){
      return ((menuHeight/choices.length)*(i))+(menuHeight/choices.length/2+5)})
    .attr("x", 5)
    .text(function(d){
      return d
    })

  }

var updateMap=function(data, type, svg){
  console.log(type, "type")
  var projection=d3.geoAlbersUsa()
                .translate([-650, 125])
                .scale([7000])

  var path=d3.geoPath()
              .projection(projection)


  if (type=="GRAD_RATE")
  {
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([100,85])

    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .classed("path", true)
      .attr("d", path)
      .attr("stroke", "#505050")
      .attr("fill", function(d,i){
        var value=d.properties.info.GRAD_RATE;
        return colors(value)
      })
      .on("mouseover", function(d){
        d3.select(this)
          .attr("stroke-width", 5)
        var xPosition=parseFloat(d3.select(this).attr("x"))
        var yPosition=parseFloat(d3.select(this).attr("y"))
        svg.append("text")
        .attr("id", "tooltip")
        .attr("x", 30)
        .attr("y", 40)
        .attr("font-size", "20px")
        .attr("fill", "black")
        .text(d.properties.NAME+": "+d.properties.info.GRAD_RATE)
      })
      .on("mouseout", function(d){
        d3.selectAll("#tooltip").remove()
        d3.select(this).attr("stroke-width", 1)
      })


  }
if(type=="ATT_RATE"){
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([96,90])

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .classed("path", true)
    .attr("d", path)
    .attr("stroke", "#505050")
    .attr("id", function(d,i){
      //console.log(i, "i")
      return d
    })
    .attr("fill", function(d,i){
      var value=d.properties.info.ATT_RATE;
      return colors(value)
    })
    .on("mouseover", function(d){
      d3.select(this)
        .attr("stroke-width", 5)
      var xPosition=parseFloat(d3.select(this).attr("x"))
      var yPosition=parseFloat(d3.select(this).attr("y"))
      svg.append("text")
      .attr("id", "tooltip")
      .attr("x", 30)
      .attr("y", 40)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .text(d.properties.NAME+": "+d.properties.info.ATT_RATE)
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}
if(type=="AVG_ACT"){
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([21,17])

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .classed("path", true)
    .attr("d", path)
    .attr("stroke", "#505050")
    .attr("id", function(d,i){
      //console.log(i, "i")
      return d
    })
    .attr("fill", function(d,i){
      var value=d.properties.info.AVG_ACT;
      return colors(value)
    })
    .on("mouseover", function(d){
      d3.select(this)
        .attr("stroke-width", 5)
      var xPosition=parseFloat(d3.select(this).attr("x"))
      var yPosition=parseFloat(d3.select(this).attr("y"))
      svg.append("text")
      .attr("id", "tooltip")
      .attr("x", 30)
      .attr("y", 40)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .text(d.properties.NAME+": "+d.properties.info.AVG_ACT)
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}
if(type=="CCR"){
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([90,40])

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .classed("path", true)
    .attr("d", path)
    .attr("stroke", "#505050")
    .attr("id", function(d,i){
      //console.log(i, "i")
      return d
    })
    .attr("fill", function(d,i){
      var value=d.properties.info.CCR;
      return colors(value)
    })
    .on("mouseover", function(d){
      d3.select(this)
        .attr("stroke-width", 5)
      var xPosition=parseFloat(d3.select(this).attr("x"))
      var yPosition=parseFloat(d3.select(this).attr("y"))
      svg.append("text")
      .attr("id", "tooltip")
      .attr("x", 30)
      .attr("y", 40)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .text(d.properties.NAME+": "+d.properties.info.CCR)
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}
if(type=="TOT_REV_PER_PUPIL"){
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([17000,11000])

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .classed("path", true)
    .attr("d", path)
    .attr("stroke", "#505050")
    .attr("id", function(d,i){
      //console.log(i, "i")
      return d
    })
    .attr("fill", function(d,i){
      var value=d.properties.info.TOT_REV_PER_PUPIL;
      return colors(value)
    })
    .on("mouseover", function(d){
      d3.select(this)
        .attr("stroke-width", 5)
      var xPosition=parseFloat(d3.select(this).attr("x"))
      var yPosition=parseFloat(d3.select(this).attr("y"))
      svg.append("text")
      .attr("id", "tooltip")
      .attr("x", 30)
      .attr("y", 40)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .text(d.properties.NAME+": "+d.properties.info.TOT_REV_PER_PUPIL)
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}
if(type=="AVG_TEACHER_SALARY"){
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([55000,45000])

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .classed("path", true)
    .attr("d", path)
    .attr("stroke", "#505050")
    .attr("id", function(d,i){
      //console.log(i, "i")
      return d
    })
    .attr("fill", function(d,i){
      var value=d.properties.info.AVG_TEACHER_SALARY;
      return colors(value)
    })
    .on("mouseover", function(d){
      d3.select(this)
        .attr("stroke-width", 5)
      var xPosition=parseFloat(d3.select(this).attr("x"))
      var yPosition=parseFloat(d3.select(this).attr("y"))
      svg.append("text")
      .attr("id", "tooltip")
      .attr("x", 30)
      .attr("y", 40)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .text(d.properties.NAME+": "+d.properties.info.AVG_TEACHER_SALARY)
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}
if(type=="AVG_PRINCIPAL_SALARY"){
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([100000,65000])

  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .classed("path", true)
    .attr("d", path)
    .attr("stroke", "#505050")
    .attr("id", function(d,i){
      //console.log(i, "i")
      return d
    })
    .attr("fill", function(d,i){
      var value=d.properties.info.AVG_PRINCIPAL_SALARY;
      return colors(value)
    })
    .on("mouseover", function(d){
      d3.select(this)
        .attr("stroke-width", 5)
      var xPosition=parseFloat(d3.select(this).attr("x"))
      var yPosition=parseFloat(d3.select(this).attr("y"))
      svg.append("text")
      .attr("id", "tooltip")
      .attr("x", 30)
      .attr("y", 40)
      .attr("font-size", "20px")
      .attr("fill", "black")
      .text(d.properties.NAME+": "+d.properties.info.AVG_PRINCIPAL_SALARY)
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}

}

var updateLegend=function(geoData, type){
  d3.select("#scale").selectAll("*").remove()
  console.log("here1")
  //d3.select("#scale").selectAll("text").style("fill", "yellow")
  //d3.select("#scale").selectAll("rect").style("fill", "purple")
  var width="100";
  var height="25";
  if (type=="GRAD_RATE"){
    console.log("here2")
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([100,85])
  var legendBoxes=["85", "87","90","93", "95","98", "100"]
  svg=d3.select("#scale")
  svg.selectAll("rect")
    .data(legendBoxes)
    .enter()
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", function(d,i){
      return (width*i+50)
    })
    .attr("y", function(d,i){
      return "20"
    })
    .attr("fill", function(d){
      return colors(d)
    })
  svg.selectAll("text")
    .data(legendBoxes)
    .enter()
    .append("text")
    .attr("id", "grad_rate")
    .attr("x", function(d,i){
        return (width*i+85)
      })
    .attr("y", function(d,i){
      return "65"
    })
    .text(function(d){return d})
    .attr("fill", "black")
  }
  else if(type=="ATT_RATE"){
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([96,90])
  var legendBoxes=["90", "91","92","93", "94","95", "96"]
  svg=d3.select("#scale")
  svg.selectAll("rect")
    .data(legendBoxes)
    .enter()
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", function(d,i){
      return (width*i+50)
    })
    .attr("y", function(d,i){
      return "20"
    })
    .attr("fill", function(d){
      return colors(d)
    })
  svg.selectAll("text")
    .data(legendBoxes)
    .enter()
    .append("text")
    .classed("legend", true)
    .attr("x", function(d,i){
        return (width*i+85)
      })
    .attr("y", function(d,i){
      return "65"
    })
    .text(function(d){return d})


  }
  else if(type=="AVG_ACT"){
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([21,17])
  var legendBoxes=["17", "18","19","20", "21"]
  svg=d3.select("#scale")
  svg.selectAll("rect")
    .data(legendBoxes)
    .enter()
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", function(d,i){
      return (width*i+50)
    })
    .attr("y", function(d,i){
      return "20"
    })
    .attr("fill", function(d){
      return colors(d)
    })
  svg.selectAll("text")
    .data(legendBoxes)
    .enter()
    .append("text")
    .attr("x", function(d,i){
        return (width*i+85)
      })
    .attr("y", function(d,i){
      return "65"
    })
    .text(function(d){return d})
  }
  else if(type=="TOT_REV_PER_PUPIL"){
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([17000,11000])
  var legendBoxes=["11,000","12000","13000","14000", "15000","16000", "17000"]
  svg=d3.select("#scale")
  svg.selectAll("rect")
    .data(legendBoxes)
    .enter()
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", function(d,i){
      return (width*i+50)
    })
    .attr("y", function(d,i){
      return "20"
    })
    .attr("fill", function(d){
      return colors(d)
    })
  svg.selectAll("text")
    .data(legendBoxes)
    .enter()
    .append("text")
    .attr("x", function(d,i){
        return (width*i+85)
      })
    .attr("y", function(d,i){
      return "65"
    })
    .text(function(d){return d})
  }
  else if(type=="CCR"){
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([90,40])
  var legendBoxes=["40","50","60","70", "80","90"]
  svg=d3.select("#scale")
  svg.selectAll("rect")
    .data(legendBoxes)
    .enter()
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", function(d,i){
      return (width*i+50)
    })
    .attr("y", function(d,i){
      return "20"
    })
    .attr("fill", function(d){
      return colors(d)
    })
  svg.selectAll("text")
    .data(legendBoxes)
    .enter()
    .append("text")
    .attr("x", function(d,i){
        return (width*i+85)
      })
    .attr("y", function(d,i){
      return "65"
    })
    .text(function(d){return d})


  }
  else if(type=="AVG_TEACHER_SALARY"){
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([55000,45000])
  var legendBoxes=["45000","47000","49000","51000", "53000","55000"]
  svg=d3.select("#scale")
  svg.selectAll("rect")
    .data(legendBoxes)
    .enter()
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", function(d,i){
      return (width*i+50)
    })
    .attr("y", function(d,i){
      return "20"
    })
    .attr("fill", function(d){
      return colors(d)
    })
  svg.selectAll("text")
    .data(legendBoxes)
    .enter()
    .append("text")
    .attr("x", function(d,i){
        return (width*i+75)
      })
    .attr("y", function(d,i){
      return "65"
    })
    .text(function(d){return d})
  }
  else if(type=="AVG_PRINCIPAL_SALARY"){
    var colors=d3.scaleSequential(d3.interpolateBlues)
    .domain([100000,60000])
  var legendBoxes=["60000","70000","80000","90000", "100000"]
  svg=d3.select("#scale")
  svg.selectAll("rect")
    .data(legendBoxes)
    .enter()
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", function(d,i){
      return (width*i+50)
    })
    .attr("y", function(d,i){
      return "20"
    })
    .attr("fill", function(d){
      return colors(d)
    })
  svg.selectAll("text")
    .data(legendBoxes)
    .enter()
    .append("text")
    .attr("x", function(d,i){
        return (width*i+75)
      })
    .attr("y", function(d,i){
      return "65"
    })
    .text(function(d){return d})


  }
}

var drawScatter=function(geoData){
  d3.select("#scale").selectAll("*").remove()
  var view="scatter"
  console.log(geoData, "Geodata")
}
