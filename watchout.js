// start slingin' some d3 here.

var width = 1000,
    height = 600,
    radius = 10;
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var enemiesNum = 15;

var setPosition = function(){
  var enemiesArr = [];
  for (var i=0; i < enemiesNum; i++){
    var x = Math.random()*(width-2*radius)+radius;
    var y = Math.random()*(height-2*radius)+radius;
    enemiesArr.push({id : i, x : x, y : y});
  }
  return enemiesArr;
};

var drag = d3.behavior.drag().on('drag', function(d){
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
});

var updatePosition = function(){
  d3.select("svg").selectAll("circle")
    .data(setPosition(),function(d){return d.id;})
    .enter()
    .append('svg:circle')
    .attr('cx', function(d){
      return d.x;
    })
    .attr('cy', function(d){
      return d.y;
    })
    .attr('r', radius);

    d3.select("svg").selectAll("circle")
    .data(setPosition(),function(d){return d.id;})
    .transition().duration(500)
    .attr('cx', function(d){
      return d.x;
    })
    .attr('cy', function(d){
      return d.y;
    })
    .attr('r', radius);
};

setInterval(updatePosition, 1000);

d3.select("svg").selectAll("circle")
  .data([{id: enemiesNum + 1, x: width / 2, y: height / 2 }])
  .enter()
  .append('svg:circle')
  .attr("fill", "red")
  .attr('cx', function(d){
      return d.x;
    })
  .attr('cy', function(d){
      return d.y;
    })
  .attr('r', radius)
  .call(drag);
















































