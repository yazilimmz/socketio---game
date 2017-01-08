var id;
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};

heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};


monsterImage.src = "images/monster.png";

var orderHeroReady = false;

var orderHeroImage = new Image();
orderHeroImage.src = "images/hero2.png";
orderHeroImage.onload = function () {
};

// Monster image


// Game objects
var hero = {
	speed: 250 // movement in pixels per second
};
var monster = {};
var score = 0;
var yourScore = 0;


orderHero = {
	speed:250
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function (x,y) {
	hero.x = x;
	hero.y = y;
};

// Update game objects
var update = function (modifier) {

	if (38 in keysDown) { // Player holding up
		if (hero.y>0) {
			hero.y -= hero.speed * modifier;
			positions(hero);
		}
	}
	if (40 in keysDown) { // Player holding down
		if (hero.y<440) {
			hero.y += hero.speed * modifier;
			positions(hero);

		}
	}
	if (37 in keysDown) {
		if (hero.x>0) {
			hero.x -= hero.speed * modifier;
			positions(hero);

		}
	}
	if (39 in keysDown) { // Player holding right
		if (hero.x<475) {
			hero.x += hero.speed * modifier;
			positions(hero);
		
		}
	}

};

// Draw everything
var render = function (x,y,yeni=false) {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (orderHeroReady) {
		//console.log(x+'+',y);
		ctx.drawImage(orderHeroImage, orderHero.x, orderHero.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score, 32, 32);

		// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score : " + yourScore, 400, 32);

};





var positions = function(hero) {
	socket.emit('position',{x:hero.x, y:hero.y})
}

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);	

	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// The main game loop
var main2 = function (data) {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);


	render(data.x,data.y,true);
	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main2);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();

// Client
var socket = io('http://localhost:8099');
socket.on('connect', function(){

socket.emit('rooms',{room:'deneme'});

socket.on('myPlayer', function(data){
	reset(data.x,data.y);
		id=data.id;

	main();


}) 
});


socket.on('playerPosition',function(data) {
	orderHero.x=data.x
	orderHero.y=data.y;
})

socket.on('newPlayer', function (data) {
	orderHero.x=data.x;
	orderHero.y=data.y;

		main2(data);

	orderHeroReady = true;


	// Request to do this again ASAP
	// 



});

socket.on('moonster',function (data) {
		monster.x=data.x;
		monster.y=data.y;

});


socket.on('score',function (data) {
	if (data.id==id) {
		score=data.score;
	}else {
		yourScore=data.score;
	}
})

