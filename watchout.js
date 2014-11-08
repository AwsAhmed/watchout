// start slingin' some d3 here.

var width = 1000,
    height = 600,
    radius = 20;
var score = 0;
var high = 0;
var collision = 0;
var enemiesNum = 15;
var speed = 2000;
var duration = 1000;

var currentScore = d3.select('.current')
  .selectAll('span');

var highScore = d3.select('.high')
  .selectAll('span');

var collisionCount = d3.select('.collisions')
  .selectAll('span');

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('xmlns', "http://www.w3.org/2000/svg")
  .attr('xlink', "http://www.w3.org/1999/xlink");


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
  var dX = d3.event.x > (width-radius) ? (width - radius): d3.event.x;
  var dY = d3.event.y > (height-radius) ? (height - radius) : d3.event.y;
  dX = dX < radius ? radius : dX;
  dY = dY <  radius ? radius :dY;
  d3.select(this).attr("cx", d.x = dX).attr("cy", d.y = dY);
});

var onCollision = function(){
  if (score > high){
    high = score;
    highScore.text(high);
  }
  collision++;
  collisionCount.text(collision);
  score = 0;

};

var checkCollision = function(enemy,onCollision){
  var ex = parseFloat(enemy.attr('x'));
  var ey = parseFloat(enemy.attr('y'));
  var player = d3.selectAll('.player');
  var px = parseFloat(player.attr('cx'));
  var py = parseFloat(player.attr('cy'));
  var distanceSq = Math.pow(ex-px,2) + Math.pow(ey-py,2);
  var distance = Math.sqrt(distanceSq);
  if(distance<20)
    onCollision();
};

var tweenWithCollisionDetection = function(givenData){
  var enemy = d3.select(this);
  var startX = parseFloat(enemy.attr('x'));
  var startY = parseFloat(enemy.attr('y'));
  var endX = givenData.x;
  var endY = givenData.y;

  return function(t){
    checkCollision(enemy,onCollision);
    var nextX = startX + (endX - startX)*t;
    var nextY = startY + (endY - startY)*t;

    //console.log("startX" + startX + " endX" + endX + "t" + t + "nextX" + nextX);
     enemy.attr('x',nextX)
          .attr('y',nextY);
  };
};

var updatePosition = function(){
  d3.select("svg").selectAll("image")
    .data(setPosition(),function(d){return d.id;})
    .enter()
    .append('svg:image')
    .attr('class','enemy')
    .attr('x', function(d){
      return d.x;
    })
    .attr('y', function(d){
      return d.y;
    })
    .attr('r', radius)
    .attr('xlink:href', 'shuriken.png')
    .attr('height',radius +'px')
    .attr('width', radius + 'px');


    d3.select("svg").selectAll("image")
    .data(setPosition(),function(d){return d.id;})
    .transition()
    .duration(duration)
    .tween('custom',tweenWithCollisionDetection);
};

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
//updatePosition();
setInterval(updatePosition, speed);

setInterval(function(){
  score++;
  currentScore.text(score);
},1);
















































