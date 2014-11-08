// start slingin' some d3 here.

var width = 1000,
    height = 600;
var score = 0;
var high = 0;
var collision = 0;
var enemiesNum = 15;
var speed = 2000;
var duration = 500;
var playerSize = 50;
var enemySize = 20;
var gameOver = false;

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
    var x = Math.random()*(width-2*enemySize)+enemySize;
    var y = Math.random()*(height-2*enemySize)+enemySize;
    var spin = Math.random()<0.5 ? "right" : "left";
    enemiesArr.push({id : i, x : x, y : y, spin:spin});
  }
  return enemiesArr;
};

var onCollision = function(){
  if (score > high){
    high = score;
    highScore.text(high);
  }
  collision++;
  collisionCount.text(collision);
  if(score>100){
    score = 0;
    gameOver = true;
    var player = d3.selectAll('.player');
    var px = parseFloat(player.attr('x')) + (playerSize/2);
    var py = parseFloat(player.attr('y')) + (playerSize/2);
    d3.select("svg").selectAll("circle")
      .data([{id: enemiesNum + 2}])
      .enter()
      .append('svg:circle')
      .attr('cx',px)
      .attr('cy',py)
      .attr('r',playerSize*5 + 'px')
      .attr('fill', 'red')
      .style('opacity',.5)
      .transition()
      .duration(400)
      .style('opacity',.8)
      .attr('r','0px');
    player.attr("height", "0px")
      .attr("width", "0px");
  }
  setTimeout(function(){
    gameOver = false;
    player.attr("height", playerSize + "px")
      .attr("width", playerSize + "px");
    d3.select("svg").selectAll("circle").data([]).exit().remove();}
      ,1000);
};

var checkCollisionFromEnemy = function(enemy){
  var ex = parseFloat(enemy.attr('x')) + (enemySize/2);
  var ey = parseFloat(enemy.attr('y')) + (enemySize/2);
  var player = d3.selectAll('.player');
  var px = parseFloat(player.attr('x')) + (playerSize/2);
  var py = parseFloat(player.attr('y')) + (playerSize/2);
  collisionMath(ex,ey,px,py);
};

var checkCollisionFromPlayer = function(enemy,px,py){
  var ex = enemy.x + (enemySize/2);
  var ey = enemy.y + (enemySize/2);
  px = px + (playerSize/2);
  py = py + (playerSize/2);
  collisionMath(ex,ey,px,py);
};

var collisionMath = function(ex,ey,px,py){
  var distanceSq = Math.pow(ex-px,2) + Math.pow(ey-py,2);
  var distance = Math.sqrt(distanceSq);
  if(distance<((playerSize + enemySize)/2)){
    onCollision();
  }
};

var drag = d3.behavior.drag().on('drag', function(d){
  var dX = d3.event.x > (width-playerSize) ? (width - playerSize): d3.event.x;
  var dY = d3.event.y > (height-playerSize) ? (height - playerSize) : d3.event.y;
  dX = dX < playerSize ? playerSize : dX;
  dY = dY <  playerSize ? playerSize :dY;
  d3.selectAll('.enemy').each(function(en){checkCollisionFromPlayer(en,dX,dY);});
  if(!gameOver)
    d3.select(this).attr("x", d.x = dX).attr("y", d.y = dY);
});

var tweenWithCollisionDetection = function(givenData){
  var enemy = d3.select(this);
  var startX = parseFloat(enemy.attr('x'));
  var startY = parseFloat(enemy.attr('y'));
  var endX = givenData.x;
  var endY = givenData.y;

  return function(t){
    checkCollisionFromEnemy(enemy);
    var nextX = startX + (endX - startX)*t;
    var nextY = startY + (endY - startY)*t;

    //console.log("startX" + startX + " endX" + endX + "t" + t + "nextX" + nextX);
     enemy.attr('x',nextX)
          .attr('y',nextY);
  };
};
var enemySelection;
var updatePosition = function(){

  enemySelection = d3.select("svg").selectAll("image")
    .data(setPosition(),function(d){return d.id;})
    .enter()
    .append('svg:image')
    .attr('class', function(d){
      return  "enemy " + d.spin;
    })
    .attr('x', function(d){
      return d.x;
    })
    .attr('y', function(d){
      return d.y;
    })
    .attr('xlink:href', 'pokeball.png')
    .attr('height',enemySize +'px')
    .attr('width', enemySize + 'px');

    if(!gameOver){
      enemySelection = d3.select("svg").selectAll("image")
      .data(setPosition(),function(d){return d.id;})
      .transition()
      .duration(duration)
      .tween('custom',tweenWithCollisionDetection);
    }
};

d3.select("svg").selectAll("image")
  .data([{id: enemiesNum + 1, x: width / 2, y: height / 2 }])
  .enter()
  .append('svg:image')
  .attr("class", "player")
  .attr('x', function(d){
      return d.x;
    })
  .attr('y', function(d){
      return d.y;
    })
  .attr('xlink:href', 'butterfree.png')
  .attr('height',playerSize +'px')
  .attr('width', playerSize + 'px')
  .call(drag);
updatePosition();
setInterval(updatePosition, speed);

setInterval(function(){
  if(!gameOver){
    score++;
    currentScore.text(score);
  }
},1);
















































