/**
 * @author Mehmet Zorkol
 */

var io = require("socket.io").listen(8099);

var rooms=[];
var positionAll=[];
var moonster=[];
io.sockets.on("connection", function (socket) {
	socket.on('rooms',function(data) {
		socket.room=data.room;
		socket.join(data.room);
		socket.score=0;
		
		console.log(socket.id, data.room,'Odasına Bağlandı');
		
		monsterReset();
		
		position=randomPosition();

		if (rooms.indexOf(data.room)< 0 ) {

		rooms.push(data.room);
		rooms[data.room]=new Array();
    		}
		

		var playerCount=rooms[data.room].length;
		if (playerCount>0) {

		
			for (i = 0; i <= rooms[data.room].length-1; i++) {
				var playerId=rooms[data.room][i];
				var positionPlayers = positionAll[rooms[data.room][i]];
				socket.emit('newPlayer', {id: playerId, x:positionPlayers['x'], y:positionPlayers['y']} );
				
			}


		}

		rooms[data.room].push(socket.id);
		
		positionAll[socket.id]=new Array();
		positionAll[socket.id]['x']=position.x;
		positionAll[socket.id]['y']=position.y;

		socket.emit('myPlayer', {id: socket.id, x:position.x, y:position.y} );
		socket.to(socket.room).emit('newPlayer', {id: socket.id, x:position.x, y:position.y} );
	
	
	});


    socket.on('position',function (data) {
    	
    	socket.x=data.x;
    	socket.y=data.y;


		positionAll[socket.id]['x']=position.x;
		positionAll[socket.id]['y']=position.y;

		var monster=moonster[socket.room];
	if (
		data.x <= (monster.x + 32)
		&& monster.x <= (data.x + 32)
		&& data.y <= (monster.y + 32)
		&& monster.y <= (data.y + 32)
	) {
		monsterReset();
		++socket.score;
		socket.emit('score', {id: socket.id, score:socket.score } );
		socket.to(socket.room).emit('score', {id: socket.id, score:socket.score } );

	}



    	socket.to(socket.room).emit('playerPosition', {id:socket.id,x:data.x,y:data.y });
		positionAll[socket.id]={x:position.x, y:position.y }
    	
    });


socket.on('disconnect', function (data) {

var index = positionAll.indexOf(socket.id);
if (index>-1) {
    positionAll.splice(index, 1);
}


var index2 = rooms[socket.room].indexOf(socket.id);
if (index2>-1){
    rooms[socket.room].splice(index, 1);
}


	console.log(socket.id, 'ayrıldı');

});


function monsterReset() {
	randMoonster=randomPosition();
	moonster[socket.room]=randMoonster;
	socket.to(socket.room).emit('moonster',randMoonster);
	socket.emit('moonster',randMoonster);
		
}


});


function randomPosition() {
	    var x = Math.floor((Math.random() * 440) + 1);
	    var y = Math.floor((Math.random() * 440) + 1);
	    return {x:x, y:y};

}
