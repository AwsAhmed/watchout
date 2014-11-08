// start slingin' some d3 here.

var width = 1000,
    height = 600,
    radius = 10;
var score = 0;

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

var onCollision =function(){
  score = 0;
};

var checkCollision = function(enemy,onCollision){
  var ex = parseFloat(enemy.attr('cx'));
  var ey = parseFloat(enemy.attr('cy'));
  var player = d3.selectAll('.player');
  var px = parseFloat(player.attr('cx'));
  var py = parseFloat(player.attr('cy'));
  var distanceSq = Math.pow(ex-px,2) + Math.pow(ey-py,2);
  var distance = Math.sqrt(distanceSq);
  if(distance<20)
    console.log("hit");
  //console.log(distance);
  //onCollision();
};

var tweenWithCollisionDetection = function(givenData){
  var enemy = d3.select(this);
  var startX = parseFloat(enemy.attr('cx'));
  var startY = parseFloat(enemy.attr('cy'));
  var endX = givenData.x;
  var endY = givenData.y;

  return function(t){
    checkCollision(enemy,onCollision);
    var nextX = startX + (endX - startX)*t;
    var nextY = startY + (endY - startY)*t;

    //console.log("startX" + startX + " endX" + endX + "t" + t + "nextX" + nextX);
     enemy.attr('cx',nextX)
          .attr('cy',nextY);
  };
};

var updatePosition = function(){
  d3.select("svg").selectAll("circle")
    .data(setPosition(),function(d){return d.id;})
    .enter()
    .append('svg:circle')
    .attr('class','enemy')
    .attr('cx', function(d){
      return d.x;
    })
    .attr('cy', function(d){
      return d.y;
    })
    .attr('r', radius);

    d3.select("svg").selectAll("circle")
    .data(setPosition(),function(d){return d.id;})
    .transition()
    .duration(500)
    .tween('custom',tweenWithCollisionDetection);
};

setInterval(updatePosition, 1000);

d3.select("svg").selectAll("circle")
  .data([{id: enemiesNum + 1, x: width / 2, y: height / 2 }])
  .enter()
  .append('svg:circle')
  .attr("fill", "red")
  .attr("class", "player")
  .attr('cx', function(d){
      return d.x;
    })
  .attr('cy', function(d){
      return d.y;
    })
  .attr('r', radius)
  .call(drag);

















































