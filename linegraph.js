/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {top: 50,right: 50,bottom: 50,left: 50};

    width = 960 - margin.left - margin.right;

    height = 300 - margin.bottom - margin.top;

    var color = d3.scale.category10();


    bbVis = {x: 0 + 100,y: 10, w: width - 100,h: 130};

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
        }).append("g");


    d3.csv("World population estimates.csv", function(data) {

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
         dataSet = color.domain().map(function(type) {
             return {
               type: type,
               values: data.map(function(d) {
                 return {Year: d.Year, company: +d[type]};

               })
             };
           });
         console.log(dataSet);
         return createVis();
    });

    createVis = function() {
            var xAxis, xScale, yAxis,  yScale;


             xScale = d3.scale.linear().domain([
            d3.min(dataSet, function(c) { return d3.min(c.values, function(v) { return v.Year; }); }),
            d3.max(dataSet, function(c) { return d3.max(c.values, function(v) { return 1.1* v.Year; }); })
             ]).range([0, bbVis.w]);

            yScale = d3.scale.linear().domain([

            d3.max(dataSet, function(c) { return d3.max(c.values, function(v) { return v.company; }); }),
            d3.min(dataSet, function(c) { return d3.min(c.values, function(v) { return v.company; }); })
             ]).range([0, bbVis.h]);


           xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");
          
           yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");


           var line = d3.svg.line()
              .interpolate("basis")
              .x(function(d) { return xScale(d.Year); })
              .y(function(d) { return yScale(d.company); });
    

          var visFrame = svg.append("g").attr({
              "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
          });
    
      

          visFrame.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + bbVis.h + ")")
           .call(xAxis);
     
          visFrame.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           
    
             
    var statistic = visFrame.selectAll(".statistic")
           .data(dataSet)
           .enter().append("g")
           .attr("class", "statistic");


       statistic.append("path")
           .attr("class", "line")
           .attr("d", function(d) { 
            console.log(d.values);
            return line(d.values); 
          })
           .style("stroke", function(d) { return color(d.type); });


        };    