dataF=d3.csv("schoolFinances.csv")
dataG=d3.csv("schoolGradRates.csv")
dataA=d3.csv("schoolAttendance.csv")
dataT=d3.csv("schoolACT.csv")

// var width=500;
// var height=300;
//
// var path=d3.geoPath()
//           .projection(d3.geoAlbersUsa());
//
//
// var svg = d3.select("body")
//           		.append("svg")
//           		.attr("width", width)
//           	  .attr("height", height);
//
// d3.json("us-states.json", function(json){
//   svg.selectAll("path")
//   .data(json.features)
//   .enter()
//   .append("path")
//   .attr("d", path);
// });



dataF.then(function(data){
  var financeInfo=createFinanceArray(data)
  console.log(financeInfo)
  //drawChart(financeInfo)
})

dataG.then(function(data){
  var gradeRateInfo=createGradRateArray(data)
  //console.log(gradeRateInfo)
})

dataA.then(function(data){
  var attendanceInfo=createAttendanceArray(data)
  //console.log(attendanceInfo)
})

dataT.then(function(data){
  var testInfo=createTestArray(data)
  console.log(testInfo)
})

var createFinanceArray=function(data){
  var newArray1=data.map(function(d,i){
      return{
      label: d.FINANCE_LABEL,
      school_dist: d.DIST_NAME,
      value: d.FINANCE_VALUE
      }
  })
  newArray2=[]
  newArray1.forEach(function(d){
    if (d.label=="Average Principal Salary"||d.label=="Average Teacher Salary"
  || d.label=="State Revenue per Pupil" || d.label=="Local Revenue per Pupil"
|| d.label=="Total Revenue per Pupil")
    {newArray2.push(d)}

})
  return newArray2
}

var createGradRateArray=function(data){
  var newArray1=data.map(function(d,i){
    return{
      label1:d.TARGET_LABEL,
      label2:d.DISAGG_LABEL,
      label3:d.COHORT_TYPE,
      label4:d.SCH_NAME,
      school_dist:d.DIST_NAME,
      four_year_grad_rate:d.REPORTYEAR_2017
    }
  })

var newArray2=[]
newArray1.forEach(function(d){
  if(d.label1=="Actual Score" && d.label2=="All Students" &&d.label3=="FOUR YEAR" && d.label4=="---District Total---")
  {newArray2.push(d)}
})
return newArray2
}

var createAttendanceArray=function(data){
  var newArray1=data.map(function(d){
    return{
      label1:d.SCH_NAME,
      school_dist:d.DIST_NAME,
      attendance_rate:d.ATTENDANCE_RATE
    }
  })

var newArray2=[]
newArray1.forEach(function(d){
  if (d.label1=="---District Total---")
  {newArray2.push(d)}
})
return newArray2
}

var createTestArray=function(data){
  var newArray1=data.map(function(d){
    return{
      label1:d.SCH_NAME,
      label2:d.DISAGG_LABEL,
      school_dist:d.DIST_NAME,
      avg_ACT:d.COMPOSITE_MEAN_SCORE
    }
  })
var newArray2=[]
newArray1.forEach(function(d){
  if(d.label1=="---District Total---"&&d.label2=="All Students")
  {newArray2.push(d)}
})
return newArray2
}
