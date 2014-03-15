var bbDetail, bbOverview, dataSet, svg;

var margin = {top: 50,right: 50,bottom: 50,left: 50};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

var parseDate = d3.time.format("%B %Y").parse;

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

bbOverview = {x: 0,y: 10,w: width,h: 50};

bbDetail = {x: 0,y: 100,w: width,h: 300};

dataSet = [];

  var x = d3.time.scale().range([0, bbOverview.w]),
      x2 = d3.time.scale().range([0, bbDetail.w]),
      y = d3.scale.linear().range([bbOverview.h, 0]),
      y2 = d3.scale.linear().range([bbDetail.h, 0]);

  var brush = d3.svg.brush().x(x).on("brush", brushed);


var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left"),
    yAxis2 = d3.svg.axis().scale(y2).orient("left");


svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });


var visFrame = svg.append("g").attr("class", "visFrame").attr({
              "transform": "translate(" + bbOverview.x + "," + (bbOverview.y + bbOverview.h) + ")",
          });
var visFrame2 = svg.append("g").attr("class", "visFrame2").attr({
              "transform": "translate(" + bbDetail.x + "," + (bbDetail.y + bbDetail.h) + ")",
          });

var line = d3.svg.line()
              .x(function(d) { return x(d.date); })
              .y(function(d) { return y(d.num); });    

var line2 = d3.svg.line()
              .x(function(d) { return x2(d.date); })
              .y(function(d) { return y2(d.num); });       

 var area = d3.svg.area()
              .x(function(d) { return x2(d.date); })
              .y0(bbDetail.h)
              .y1(function(d) { return y2(d.num); });

d3.csv("unHealth.csv", function(data) {

dataSet = data.map(function(d) {
                 return {date: parseDate(d["Analysis Date"]), num: convertToInt(d["Women's Health"])};
           });

  x.domain(d3.extent(dataSet.map(function(d) { return d.date; })));
  y.domain([0, d3.max(dataSet.map(function(d) { return d.num; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

return createVis();
});



createVis = function() {
            
          visFrame.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + bbOverview.h + ")")
           .call(xAxis);
     
          visFrame.append("g")
           .attr("class", "y axis")
           .call(yAxis);

       visFrame.append("path")
               .datum(dataSet)
               .attr("class", "line")
               .attr("d", line)



       visFrame.selectAll("circle")
               .data(dataSet)
               .enter()
               .append("g")
               .append("circle")        
               .attr("cx", line.x())
               .attr("cy", line.y())
               .attr("r", 2.5)
               .attr("fill","red");


      visFrame.append("g").attr("class", "x brush").call(brush)
              .selectAll("rect")
              .attr({height: bbOverview.h});

      visFrame2.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + bbDetail.h + ")")
       .call(xAxis2);
     
      visFrame2.append("g")
       .attr("class", "y axis")
       .call(yAxis2);


       visFrame2.append("path")
               .datum(dataSet)
               .attr("class", "area")
               .attr("d", area)
               .attr("fill","steelblue");

  

 }; 



 function brushed() {
  x2.domain(brush.empty() ? x.domain() : brush.extent());
  visFrame2.select(".area").attr("d", area);
  visFrame2.select(".x axis").call(xAxis2);
}

