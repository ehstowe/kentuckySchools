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
  d3.selectAll(".menu2").remove()
  d3.selectAll("#map").selectAll("*").remove()
  var view="map"


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
"Average Principal Salary", "Clear Map", "View Scatterplot"]

var colors=["lightgray", "lightgray", "lightgray", "lightgray",
"lightgray", "lightgray", "lightgray", "lightgray", "lightgray"]

menu.selectAll("rect")
    .data(choices)
    .enter()
    .append("rect")
    .classed("menu1", true)
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
        .style("fill","white")
    })
    .on("mouseout", function(d){
      d3.select(this)
      .style("fill", "lightgray")

    })
    .on("click", function(d){
      d3.selectAll("rect")
      .style("stroke", "none")
    d3.select(this)
      .style("stroke", "gray")
      .style("stroke-width", "10")
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
    .classed("menu1", true)
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

  var width="100";
  var height="25";
  if (type=="GRAD_RATE"){
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
  var view="scatter"
  var clickCount=0

var drawScatter=function(data){
  d3.selectAll(".menu1").remove()
  d3.selectAll(".scatter").remove()
  d3.selectAll("#selectX").attr("enabled", "enabled")
  d3.selectAll("#selectY").attr("enabled", "enabled")

  var choices=["Clear Scatterplot", "View Map"]

  var colors=["lightgray", "lightgray"]

  var menuWidth="200"
  var menuHeight="100"

  var menu=d3.select("#menu")
            .attr("width", menuWidth)
            .attr("height", menuHeight)

  menu.selectAll("rect")
      .data(choices)
      .enter()
      .append("rect")
      .classed("menu2", true)
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
          .style("fill","white")
      })
      .on("mouseout", function(d){
        d3.select(this)
        .style("fill", "lightgray")

      })
      .on("click", function(d){

      clickCount+=1
       if(clickCount==1||clickCount==2){
       d3.select(this)
         .style("stroke", "gray")
         .style("stroke-width", "10")
         .classed("selected", true)
       }

      var yPosition=parseFloat(d3.select(this).attr("y"))
      //console.log(yPosition, "yp")
      // console.log(2*menuHeight/choices.length, "th")
      if(yPosition<(1*menuHeight/choices.length))
      {menu.selectAll("rect").style("stroke", "none");
      drawScatter(data)}

      else if(yPosition<=50)
      {console.log(yPosition)
      drawMap(data)}
      })

  menu.selectAll("text")
      .data(choices)
      .enter()
      .append("text")
      .classed("menu2", true)
      .attr("y", function(d,i){
        return ((menuHeight/choices.length)*(i))+(menuHeight/choices.length/2+5)})
      .attr("x", 5)
      .text(function(d){
        return d
      })

      choices=["4-year Graduation Rate", "Attendance Rate", "Avg ACT Score",
      "CCR %",
      "Total Rev Per Pupil", "Avg Teacher Salary",
      "Avg Principal Salary"]

d3.select("#selectX")
    .selectAll("option")
    .data(choices)
    .enter()
    .append("option")
    .attr("label", function(d){return d})
    .on("change", function(d){
      d3.select(this)
      console.log(this, "this!")
    })

d3.select("#selectY")
  .selectAll("option")
  .data(choices)
  .enter()
  .append("option")
  .attr("label", function(d){return d})


var screen={width:800, height:400};
var margins={top:10, bottom:100, left:100, right:40}

var svg=d3.select("#map")
            .attr("width", screen.width)
            .attr("height", screen.height);

d3.select("#scale").selectAll("*").remove()

var plot=svg.append("g")
            .attr("width", screen.width-margins.left-margins.right)
            .attr("height", screen.height-margins.top-margins.bottom)
            .attr("transform", "translate("+margins.left+","+margins.top+")")




  // var xScale=d3.scaleLinear()
  //               .domain([40000,65000])
  //               .range([0, screen.width-margins.left-margins.right])
  //
  // var yScale=d3.scaleLinear()
  //             .domain([61000,120000])
  //             .range([screen.height-margins.top-margins.bottom,0])
  //
  //
  //
  // var dots=plot.selectAll("g")
  //             .data(data.features)
  //             .enter()
  //             .append("g")
  //
  // dots.selectAll("circle")
  //     .data(data.features)
  //     .enter()
  //     .append("circle")
  //     .classed("scatter", true)
  //     .attr("cx", function(d,i){return xScale(d.properties.info.AVG_TEACHER_SALARY)})
  //     .attr("cy", function(d,i){return yScale(d.properties.info.AVG_PRINCIPAL_SALARY)})
  //     .attr("r","5")
  //     .attr("fill", "green")
  //     .on("mouseover", function(d){
  //       d3.select(this)
  //       .attr("r","8").attr("fill", "blue")
  //       plot.append("text")
  //       .attr("id", "tooltip")
  //       .attr("x", 30)
  //       .attr("y", 40)
  //       .attr("font-size", "20px")
  //       .attr("fill", "black")
  //       .text(d.properties.NAME+(": ")+d.properties.info.AVG_TEACHER_SALARY+(",")+d.properties.info.AVG_PRINCIPAL_SALARY)
  //     })
  //     .on("mouseout", function(d){
  //       d3.selectAll("#tooltip").remove()
  //       d3.select(this).attr("r", "5").attr("fill", "green")
  //     })
  //
  //
  //
  //     console.log()
var typeX="GRAD_RATE"
var typeY="GRAD_RATE"
var x=[]
var y=[]
var counties=[]
data.features.forEach(function(d){
  x.push(d.properties.info.GRAD_RATE)
})
data.features.forEach(function(d){
  y.push(d.properties.info.GRAD_RATE)
})
data.features.forEach(function(d){
  counties.push(d.properties.NAME)
})
var coordinates=[x,y, counties]

updateScatter (screen, margins, coordinates, typeX, typeY)

}

var updateScatter=function(screen,margins,coordinates, typeX, typeY){
var x=[];
var y=[];
coordinates[0].forEach(function(d){x.push(parseFloat(d))});
coordinates[1].forEach(function(d){y.push(parseFloat(d))});
var xMax=parseFloat(d3.max(d3.values(x)));
var xMin=parseFloat(d3.min(d3.values(x)));
var yMax=parseFloat(d3.max(d3.values(y)));
var yMin=parseFloat(d3.min(d3.values(y)));

var longList=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
21, 22, 23, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]
var newCoordinates=longList.map(function(d,i){
  return {
    x:coordinates[0][i],
    y:coordinates[1][i],
    county:coordinates[2][i]
  }
})

;


xScale=d3.scaleLinear()
        .domain([(xMin), (xMax)])
        .range([0, screen.width-margins.left-margins.right])

yScale=d3.scaleLinear()
        .domain([yMin, yMax])
        .range([screen.height-margins.top-margins.bottom,0])

svg=d3.select("#map")
      .attr("width", "800")
      .attr("height", "400")

var plot2=svg.append("g")
                    .attr("width", screen.width-margins.left-margins.right)
                    .attr("height", screen.height-margins.top-margins.bottom)
                    .classed("plot", true)
                    .attr("transform", "translate("+margins.left+","+margins.top+")")

var dots=plot2.selectAll("g")
              .data(newCoordinates)
              .enter()
              .append("g")

dots.selectAll("circle")
    .data(newCoordinates)
    .enter()
    .append("circle")
    .attr("cx", function(d){
      //console.log(xScale(parseInt(d.x)), "xvalues")
      return xScale(parseFloat(d.x))
    })
    .attr("cy", function(d){
    //  console.log(yScale(parseInt(d.y)), "yvalues")
      return yScale(parseFloat(d.y))})
    .attr("r","5")
    .attr("fill", d3.interpolateBlues([.75]))
    .on("mouseover", function(d){
        d3.select(this)
          .attr("r","8").attr("fill", d3.interpolateBlues([.95]))

        plot2.append("text")
            .attr("id", "tooltip")
            .attr("x", 30)
            .attr("y", 40)
            .attr("font-size", "20px")
            .attr("fill", "black")
            .text(function(newCoordinates){
              return d.county
            })
            })
      .on("mouseout", function(d){
            d3.selectAll("#tooltip").remove()
            d3.select(this).attr("r", "5").attr("fill", d3.interpolateBlues([.75]))
            })

      var xA=screen.height-margins.bottom;
      var xAxis=d3.axisBottom(xScale)
      svg.append("g").classed("xAxis", true)
                      .call(xAxis)
                      .attr("transform", "translate("+margins.left+','+xA+")");

      var yA=margins.left-10
      var yAxis=d3.axisLeft(yScale);
      svg.append("g").classed("yAxis", true)
                    .call(yAxis)
                    .attr("transform", "translate("+yA+","+"10"+")")

      var choices=["4-year Graduation Rate", "Attendance Rate", "Average ACT Score",
      "College/Career Readiness Percentage",
      "Total Revenue Per Pupil", "Average Teacher Salary",
      "Average Principal Salary"]

      svg.append("text")
          .attr("x", "400")
          .attr("y", "350")
          .attr("text-anchor", "middle")
          .text(function(d){
            if (typeX=="GRAD_RATE"){return "Graduation Rate"}
            else if (typeX=="ATT_RATE"){return "Attendance Rate"}
            else if (typeX=="AVG_ACT"){return "Average ACT Score"}
            else if (typeX=="CCR"){return "College/Career Readiness Percentage"}
            else if (typeX=="TOT_REV_PER_PUPIL"){return "Total Revenue Per Pupil"}
            else if (typeX=="AVG_TEACHER_SALARY"){return "Average Teacher Salary"}
            else if (typeX=="AVG_PRINCIPAL_SALARY"){return "Average Principal Salary"}
            })
      svg.append("text")
          .attr("x", "400")
          .attr("y", "350")
          .attr("transform", "translate(0,70) rotate(-90,"+(margins.left-20)+","+((screen.height/2+200))+")")
          .attr("text-anchor", "middle")
          .text(function(d){
            if (typeX=="GRAD_RATE"){return "Graduation Rate"}
            else if (typeY=="ATT_RATE"){return "Attendance Rate"}
            else if (typeY=="AVG_ACT"){return "Average ACT Score"}
            else if (typeY=="CCR"){return "College/Career Readiness Percentage"}
            else if (typeY=="TOT_REV_PER_PUPIL"){return "Total Revenue Per Pupil"}
            else if (typeY=="AVG_TEACHER_SALARY"){return "Average Teacher Salary"}
            else if (typeY=="AVG_PRINCIPAL_SALARY"){return "Average Principal Salary"}
            })


}
