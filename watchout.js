// start slingin' some d3 here.

var width = 1000,
    height = 600;
var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var enemiesNum = 15;
var enemiesArr = [];

for (var i=0; i < enemiesNum; i++){
  var x = Math.random()*width;
  var y = Math.random()*height;

  enemiesArr.push({id : i, x : x, y : y});

}


svg.selectAll("body")
  .data(enemiesArr)
  .enter()
  .append('svg:circle')
  .attr('cx', function(d){
    return d.x;
  })
  .attr('cy', function(d){
    return d.y;
  })
  .attr('r', 10);

