var geoP=d3.json("kentuckyGeo.json")
var dataP=d3.csv("schoolData2.csv")

//Create a dictionary of county information and synthesize that with geodata
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
//Draw map
var drawMap=function(geoData){

  //Clear screen of current visualization/options
  d3.select("#scale").selectAll("*").remove()
  d3.selectAll("mapButton").remove()
  d3.selectAll("#map").selectAll("*").remove()
  d3.selectAll("#selectX").remove()
  d3.selectAll("#selectY").remove()
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

var colors=d3.scaleSequential(d3.interpolateBlues)
            .domain([100,85])

svg.selectAll("path")
  .data(geoData.features)
  .enter()
  .append("path")
  .classed("path", true)
  .attr("d", path)
  .attr("stroke", "#505050")
  .attr("fill", function(d){
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
    .text(d.properties.NAME+": "+d.properties.info.GRAD_RATE+"%")
  })
  .on("mouseout", function(d){
    d3.selectAll("#tooltip").remove()
    d3.select(this).attr("stroke-width", 1)
  })

updateLegend(geoData, "GRAD_RATE")

//Create dropdown menu
choices=["GRAD_RATE", "ATT_RATE", "AVG_ACT", "CCR",
"TOT_REV_PER_PUPIL", "AVG_TEACHER_SALARY", "AVG_PRINCIPAL_SALARY"]

var dropdownChange1=function(){
  console.log("made it")
  var type1=d3.select(this).property("value")
  var type2=d3.select("#select2").property("value")
  //var type2=d3.select("#select2").property("value")
  updateMap(geoData, type1, type2, svg)
  updateLegend(geoData, type1)
}

var dropdown1=d3.select("body")
.append("select")
.attr("id", "select1")
.on("change", dropdownChange1)

dropdown1.selectAll("option")
    .data(choices)
    .enter()
    .append("option")
    .attr("value", function(d){return d})
    .attr("label",function(d){
        if(d=="GRAD_RATE") {return "Graduation Rate"}
        if(d=="ATT_RATE"){return "Attendance Rate"}
        if(d=="AVG_ACT"){return "Average ACT"}
        if(d=="CCR"){return "College/Career Readiness"}
        if(d=="TOT_REV_PER_PUPIL"){return "Total Revenue Per Pupil"}
        if(d=="AVG_TEACHER_SALARY"){return "Average Teacher Salary"}
        if(d=="AVG_PRINCIPAL_SALARY"){return "Average Principal Salary"}})

        var dropdownChange2=function(){
          console.log("made it")
          var type1=d3.select("#select1").property("value")
          var type2=d3.select(this).property("value")
          //var type2=d3.select("#select2").property("value")
          updateMap(geoData, type1, type2, svg)
          updateLegend(geoData, type1)
        }

        var dropdown2=d3.select("body")
        .append("select")
        .attr("id", "select2")
        .on("change", dropdownChange1)

        dropdown2.selectAll("option")
            .data(choices)
            .enter()
            .append("option")
            .attr("value", function(d){return d})
            .attr("label",function(d){
                if(d=="GRAD_RATE") {return "Graduation Rate"}
                if(d=="ATT_RATE"){return "Attendance Rate"}
                if(d=="AVG_ACT"){return "Average ACT"}
                if(d=="CCR"){return "College/Career Readiness"}
                if(d=="TOT_REV_PER_PUPIL"){return "Total Revenue Per Pupil"}
                if(d=="AVG_TEACHER_SALARY"){return "Average Teacher Salary"}
                if(d=="AVG_PRINCIPAL_SALARY"){return "Average Principal Salary"}})

var button=d3.select("body")
              .append("button")
              .attr("id", "scatterButton")
              .text("Draw Scatterplot")
              .on("click", function(d){drawScatter(geoData)})


  }

var updateMap=function(data, type, type2, svg){
  console.log(type, "type")
  var projection=d3.geoAlbersUsa()
                .translate([-650, 125])
                .scale([7000])


  var path=d3.geoPath()
              .projection(projection)

//If statements to update map based on selection
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
      .attr("stroke", function(d){
        if (type2=="ATT_RATE")
        {return "red"}
        else{return "blue"}
      })
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
        .text(d.properties.NAME+": "+d.properties.info.GRAD_RATE+"%")
      })
      .on("mouseout", function(d){
        d3.selectAll("#tooltip").remove()
        d3.select(this).attr("stroke-width", 1)
      })


  }
if(type=="ATT_RATE"){

  //console.log(svg, "svg")
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([96,90])
//console.log(path, "path")
console.log(data.features, "dat")
  svg.selectAll("path")
    .data(data.features)
    .classed("path", true)
    .attr("d", path)
    .attr("stroke", "#505050")
    .attr("fill", function(d,i){
      var value=d.properties.info.ATT_RATE;
      console.log(value, "value")
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
      .text(d.properties.NAME+": "+d.properties.info.ATT_RATE+"%")
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
      .text(d.properties.NAME+": "+d.properties.info.CCR+"%")
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}
if(type=="TOT_REV_PER_PUPIL"){
  var colors=d3.scaleSequential(d3.interpolateBlues)
  .domain([16000,11000])

  svg.selectAll("path")
    .data(data.features)
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
      .text(d.properties.NAME+": $"+d.properties.info.TOT_REV_PER_PUPIL)
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
      .text(d.properties.NAME+": $"+d.properties.info.AVG_TEACHER_SALARY)
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
      .text(d.properties.NAME+": $"+d.properties.info.AVG_PRINCIPAL_SALARY)
    })
    .on("mouseout", function(d){
      d3.selectAll("#tooltip").remove()
      d3.select(this).attr("stroke-width", 1)
    })
}

}
//Change legend based on type selected
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
    .domain([16000,11000])
  var legendBoxes=["11,000","12000","13000","14000", "15000","16000"]
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
//Draw scatterplot - initializes with x and y graduation rates
var drawScatter=function(data){
// d3.selectAll(".scatter").remove()
 //d3.selectAll("#scatterButton").remove()
d3.selectAll("#select1").remove()
d3.selectAll("#select2").remove()
d3.selectAll("#scatterButton").remove()

d3.select("body")
.append("button")
.attr("id", "mapButton")
.text("Map")
.on("click", function(d){drawMap(data)})


//Create dropdown
      choices=["GRAD_RATE", "ATT_RATE", "AVG_ACT", "CCR",
    "TOT_REV_PER_PUPIL", "AVG_TEACHER_SALARY", "AVG_PRINCIPAL_SALARY"]

var dropdownChangeX=function(){
  var typeX=d3.select(this).property("value")
  var typeY=d3.select("#selectY").property("value")
  var x=[]
  var y=[]
  var counties=[]
  data.features.forEach(function(d){
    if(typeX=="GRAD_RATE")
    {x.push(d.properties.info.GRAD_RATE)}
    else if(typeX=="ATT_RATE")
    {x.push(d.properties.info.ATT_RATE)}
    else if(typeX=="AVG_ACT")
    {x.push(d.properties.info.AVG_ACT)}
    else if(typeX=="CCR")
    {x.push(d.properties.info.CCR)}
    else if(typeX=="TOT_REV_PER_PUPIL")
    {x.push(d.properties.info.TOT_REV_PER_PUPIL)}
    else if(typeX=="AVG_TEACHER_SALARY")
    {x.push(d.properties.info.AVG_TEACHER_SALARY)}
    else if(typeX=="AVG_PRINCIPAL_SALARY")
    {x.push(d.properties.info.AVG_PRINCIPAL_SALARY)}
  })
  data.features.forEach(function(d){
    if(typeY=="GRAD_RATE"){y.push(d.properties.info.GRAD_RATE)}
    else if(typeY=="ATT_RATE"){y.push(d.properties.info.ATT_RATE)}
    else if(typeY=="AVG_ACT"){y.push(d.properties.info.AVG_ACT)}
    else if(typeY=="CCR"){y.push(d.properties.info.CCR)}
    else if(typeY=="TOT_REV_PER_PUPIL"){y.push(d.properties.info.TOT_REV_PER_PUPIL)}
    else if(typeY=="AVG_TEACHER_SALARY"){y.push(d.properties.info.AVG_TEACHER_SALARY)}
    else if(typeY=="AVG_PRINCIPAL_SALARY"){y.push(d.properties.info.AVG_PRINCIPAL_SALARY)}

  })
  data.features.forEach(function(d){
    counties.push(d.properties.NAME)
  })
  var coordinates=[x,y, counties]

//update scatterplot based on dropdown selections
  updateScatter (screen, margins, coordinates, typeX, typeY)
}

var dropdownChangeY=function(){
  var typeY=d3.select(this).property("value")
  var typeX=d3.select("#selectX").property("value")

  var x=[]
  var y=[]
  var counties=[]

  data.features.forEach(function(d){
    if(typeY=="GRAD_RATE")
    {y.push(d.properties.info.GRAD_RATE)}
    else if(typeY=="ATT_RATE")
    {y.push(d.properties.info.ATT_RATE)}
    else if(typeY=="AVG_ACT")
    {y.push(d.properties.info.AVG_ACT)}
    else if(typeY=="CCR")
    {y.push(d.properties.info.CCR)}
    else if(typeY=="TOT_REV_PER_PUPIL")
    {y.push(d.properties.info.TOT_REV_PER_PUPIL)}
    else if(typeY=="AVG_TEACHER_SALARY")
    {y.push(d.properties.info.AVG_TEACHER_SALARY)}
    else if(typeY=="AVG_PRINCIPAL_SALARY")
    {y.push(d.properties.info.AVG_PRINCIPAL_SALARY)}
  })
  data.features.forEach(function(d){
    if(typeX=="GRAD_RATE"){x.push(d.properties.info.GRAD_RATE)}
    else if(typeX=="ATT_RATE"){x.push(d.properties.info.ATT_RATE)}
    else if(typeX=="AVG_ACT"){x.push(d.properties.info.AVG_ACT)}
    else if(typeX=="CCR"){x.push(d.properties.info.CCR)}
    else if(typeX=="TOT_REV_PER_PUPIL"){x.push(d.properties.info.TOT_REV_PER_PUPIL)}
    else if(typeX=="AVG_TEACHER_SALARY"){x.push(d.properties.info.AVG_TEACHER_SALARY)}
    else if(typeX=="AVG_PRINCIPAL_SALARY"){x.push(d.properties.info.AVG_PRINCIPAL_SALARY)}
  })
  data.features.forEach(function(d){
    counties.push(d.properties.NAME)
  })
  var coordinates=[x,y, counties]
  console.log(coordinates, "ycoor")

updateScatter (screen, margins, coordinates, typeX, typeY)
}

var dropdownX=d3.select("body")
.append("select")
.attr("id", "selectX")
.on("change", dropdownChangeX)

dropdownX.selectAll("option")
    .data(choices)
    .enter()
    .append("option")
    .attr("value", function(d){return d})
    .attr("label",function(d){
        if(d=="GRAD_RATE") {return "X-axis: Graduation Rate"}
        if(d=="ATT_RATE"){return "X-axis: Attendance Rate"}
        if(d=="AVG_ACT"){return "X-axis: Average ACT"}
        if(d=="CCR"){return "X-axis: College/Career Readiness"}
        if(d=="TOT_REV_PER_PUPIL"){return "X-axis: Total Revenue Per Pupil"}
        if(d=="AVG_TEACHER_SALARY"){return "X-axis: Average Teacher Salary"}
        if(d=="AVG_PRINCIPAL_SALARY"){return "X-axis: Average Principal Salary"}})

var dropdownY=d3.select("body")
    .append("select")
    .attr("id", "selectY")
    .on("change", dropdownChangeY)

dropdownY.selectAll("option")
  .data(choices)
  .enter()
  .append("option")
  .attr("value", function(d){return d})
  .attr("label", function(d){
    if(d=="GRAD_RATE") {return "Y-axis: Graduation Rate"}
    if(d=="ATT_RATE"){return "Y-axis: Attendance Rate"}
    if(d=="AVG_ACT"){return "Y-axis: Average ACT"}
    if(d=="CCR"){return "Y-axis: College/Career Readiness"}
    if(d=="TOT_REV_PER_PUPIL"){return "Y-axis: Total Revenue Per Pupil"}
    if(d=="AVG_TEACHER_SALARY"){return "Y-axis: Average Teacher Salary"}
    if(d=="AVG_PRINCIPAL_SALARY"){return "Y-axis: Average Principal Salary"}
  })


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

//create arrays, x and y, of data based on type selected
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
//create new array which includes x values and y values as well as each county name
var coordinates=[x,y, counties]

updateScatter (screen, margins, coordinates, typeX, typeY)

}

var updateScatter=function(screen,margins,coordinates, typeX, typeY){

d3.selectAll("#map").selectAll("*").remove()
//return coordinates to two arrays, x and y, but with floats instead of strings
var x=[];
var y=[];
coordinates[0].forEach(function(d){x.push(parseFloat(d))});
coordinates[1].forEach(function(d){y.push(parseFloat(d))});
//find maxes and mins -needed for scales
var xMax=parseFloat(d3.max(d3.values(x)));
var xMin=parseFloat(d3.min(d3.values(x)));
var yMax=parseFloat(d3.max(d3.values(y)));
var yMin=parseFloat(d3.min(d3.values(y)));
console.log(x, "x")
console.log(y, "y")
console.log(coordinates[2], "county")
//create a long list so that data can be bound to 120 items instead of 2 or 3
var longList=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119]
console.log(longList, "longlist")
//map x coordinates, y coordinates, and county name to the list of 120 integers
var newCoordinates=longList.map(function(d,i){
  return {
    x:coordinates[0][i],
    y:coordinates[1][i],
    county:coordinates[2][i]
  }
})

console.log(newCoordinates, "newcoordinates")

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
      return xScale(parseFloat(d.x))
    })
    .attr("cy", function(d){
      return yScale(parseFloat(d.y))})
    .attr("r","5")
    .attr("fill", d3.interpolateBlues([.75]))
    .on("mouseover", function(d){
      //var xPosition=parseFloat(d3.select(this).attr("cx"))
    //  var yPosition=parseFloat(d3.select(this).attr("cy"))
        d3.select(this)
          .attr("r","8").attr("fill", d3.interpolateBlues([.95]))
        svg.append("text")

            .attr("id", "tooltip")
            .attr("x", 400)
            .attr("y", 380)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "black")
            .text(function(newCoordinates){
              return d.county+(" County")
            })
            })
      .on("mouseout", function(d){
            d3.selectAll("#tooltip").remove()
            d3.select(this).attr("r", "5").attr("fill", d3.interpolateBlues([.75]))
            })

      var xA=screen.height-margins.bottom;
      var xAxis=d3.axisBottom(xScale)
      svg.append("g").classed("xAxis", true)
                    //  .transition()
                      //.duration(1000)
                      .call(xAxis)
                      .attr("transform", "translate("+margins.left+','+xA+")");

      var yA=margins.left-10
      var yAxis=d3.axisLeft(yScale);
      svg.append("g").classed("yAxis", true)
                  //  .transition()
                    //.duration(1000)
                    .call(yAxis)
                    .attr("transform", "translate("+yA+","+"10"+")")

//create axes labels based on type
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
          .attr("id", "yLabel")
          .attr("x", "400")
          .attr("y", "350")
          .attr("transform", "translate(0,70) rotate(-90,"+(margins.left-20)+","+((screen.height/2+200))+")")
          .attr("text-anchor", "middle")
          .text(function(d){
            if (typeY=="GRAD_RATE"){return "Graduation Rate"}
            else if (typeY=="ATT_RATE"){return "Attendance Rate"}
            else if (typeY=="AVG_ACT"){return "Average ACT Score"}
            else if (typeY=="CCR"){return "College/Career Readiness Percentage"}
            else if (typeY=="TOT_REV_PER_PUPIL"){return "Total Revenue Per Pupil"}
            else if (typeY=="AVG_TEACHER_SALARY"){return "Average Teacher Salary"}
            else if (typeY=="AVG_PRINCIPAL_SALARY"){return "Average Principal Salary"}
            })

}
