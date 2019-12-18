var express = require("express");
var path = require("path");
var app = express();

var PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));

require("./routes/htmlRoutes")(app);

var serv = require('http').createServer(app);

serv.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});

var io = require('socket.io')(serv, {});


var sessions = {};
var players = {};

function Player(x, y, w, h, c, speed, id) {
    this.wallReady = true;
    this.wallx = -500;
    this.wally = -500;
    this.wallUp = false;
    this.element = 'fire';
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c; 
    this.id = id;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.speed = speed;
    this.hp = 100;
    this.hpx = 0;
    this.hpy = 0;
    this.target = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        hp: 100,
        alive: true,
    }
    this.bullet = [];
    this.clip = 4;
    this.update = function() {
        if(this.c === 'red') {
            if(this.wallUp){
                this.wallx = this.x + 50;
                this.wally = this.y - 7;
            }
            for(var i in players) {
                if(players[i].c === 'blue') {                  
                    this.target.x = players[i].x;
                    this.target.y = players[i].y;
                    this.target.w = players[i].w;
                    this.target.h = players[i].h;
                    this.target.id = players[i].id;
                    this.target.wallUp = players[i].wallUp;
                    this.target.element = players[i].element;
                    players[i].hp = this.target.hp;
                    if(players[i].hp === 0) {
                        players[i].x = -1000;
                        players[i].y = -1000;
                        this.target.hp = 100;  
                        this.bullet = [];                      
                        sessions[players[i].id].emit('remove')
                    }
                }
            }
            if(this.bullet.length > 0) {
                for(var i = 0; i < this.bullet.length; i++) {
                    this.bullet[i].x += this.bullet[i].speed;
                    if(this.bullet[i].x + this.bullet[i].w >= this.target.x && this.bullet[i].y + this.bullet[i].h >= this.target.y && this.bullet[i].y <= this.target.y + this.target.h && this.bullet[i].x < this.target.x + this.target.w) {
 
                        if(this.target.wallUp) {
                            switch(this.bullet[i].c) {
                                case 'red':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('red fire ball hit blue fire wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {                                                    
                                                    rebound(players[ai], 'bigFire');
                                                }
                                            }
                                            break;
                                        case 'water':
                                            console.log('red fire ball hit blue water wall')
                                            //bullet gets deleted
                                            break;
                                        case 'earth':
                                            console.log('red fire ball hit blue earth wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {
                                                    rebound(players[ai], 'meteor');
                                                }
                                            }
                                            break;
                                        case 'air':
                                            console.log('red fire ball hit blue air wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {                                                    
                                                    rebound(players[ai], 'light');
                                                }
                                            }
                                            break;
                                    }
                                    break;
                                case 'brown':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('red earth ball hit blue fire wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {
                                                    rebound(players[ai], 'meteor');
                                                }
                                            }
                                            break;
                                        case 'water':
                                            console.log('red earth ball hit blue water wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {
                                                    rebound(players[ai], 'plant');
                                                }
                                            }
                                            break;
                                        case 'earth':
                                            console.log('red earth ball hit blue earth wall')
                                            for(var ai in players) {
                                                for(var ai in players) {
                                                    if(players[ai].c === 'blue') {
                                                        rebound(players[ai], 'bigEarth');
                                                    }
                                                }
                                            }
                                            break;
                                        case 'air':
                                            console.log('red earth ball hit blue air wall')
                                            //delete
                                            break;
                                    }
                                    break;
                                case 'blue':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('red water ball hit blue fire wall')
                                            //delete
                                            break;
                                        case 'water':
                                            console.log('red water ball hit blue water wall')
                                            for(var ai in players) {
                                                for(var ai in players) {
                                                    if(players[ai].c === 'blue') {
                                                        rebound(players[ai], 'bigWater');
                                                    }
                                                }
                                            }
                                            break;
                                        case 'earth':
                                            console.log('red water ball hit blue earth wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {
                                                    rebound(players[ai], 'plant');
                                                }
                                            }
                                            break;
                                        case 'air':
                                            console.log('red water ball hit blue air wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {
                                                    rebound(players[ai], 'ice');
                                                }
                                            }
                                            break;
                                    }
                                    break;
                                case 'whitesmoke':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('red air ball hit blue fire wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {
                                                    rebound(players[ai], 'light');
                                                }
                                            }
                                            break;
                                        case 'water':
                                            console.log('red air ball hit blue water wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'blue') {
                                                    rebound(players[ai], 'ice');
                                                }
                                            }
                                            break;
                                        case 'earth':
                                            console.log('red air ball hit blue earth wall')
                                            //delete
                                            break;
                                        case 'air':
                                            console.log('red air ball hit blue air wall')
                                            for(var ai in players) {
                                                for(var ai in players) {
                                                    if(players[ai].c === 'blue') {
                                                        rebound(players[ai], 'bigAir');
                                                    }
                                                }
                                            }
                                            break;
                                    }
                                    break;
                            }
                        } else {
                            this.target.hp -= 10;
                        }

                        //enemy/wall hit bullet deletion
                        this.bullet[i].id = id;   
                        for (var j = this.bullet.length - 1; i >= 0; --i) {                
                            if (this.bullet[i].id == this.id) {
                                this.bullet.splice(i,1);
                                return;
                            }
                        }
                        
                    }
                    //off screen bullet deletion
                    if (this.bullet[i].x > 1500) {
                        this.bullet[i].id = this.id;
                        for (var j = this.bullet.length - 1; i >= 0; --i) {                
                            if (this.bullet[i].id == this.id) {
                                this.bullet.splice(i,1);
                                return;
                            }
                        }
                    } 
                }
            }
            if(this.right) {
                if(this.x < 750 - this.w) {
                    this.x += this.speed;
                    if(this.wallUp){
                        this.wallx = this.x + 50;
                        this.wally = this.y - 7;
                    }
                }
            }
            if(this.left) {
                if(this.x > 0) {
                    this.x -= this.speed;
                    if(this.wallUp){
                        this.wallx = this.x + 50;
                        this.wally = this.y - 7;
                    }
                }
            }
            if(this.up) {
                if(this.y > 30) {
                    this.y -= this.speed;
                    if(this.wallUp){
                        this.wallx = this.x + 50;
                        this.wally = this.y - 7;
                    }
                }
            }
            if(this.down) {
                if(this.y < 675 - this.h) {
                    this.y += this.speed;
                    if(this.wallUp){
                        this.wallx = this.x + 50;
                        this.wally = this.y - 7;
                    }
                }
            }
        } else if(this.c === 'blue') {
            if(this.wallUp){
                this.wallx = this.x - 10;
                this.wally = this.y - 7;
            }
            for(var i in players) {
                if(players[i].c === 'red') {                  
                    this.target.x = players[i].x;
                    this.target.y = players[i].y;
                    this.target.w = players[i].w;
                    this.target.h = players[i].h;
                    this.target.id = players[i].id;
                    this.target.wallUp = players[i].wallUp;
                    this.target.element = players[i].element;
                    players[i].hp = this.target.hp;
                    if(players[i].hp === 0) {
                        players[i].x = -1000;
                        players[i].y = -1000;
                        this.target.hp = 100; 
                        this.bullet = [];                       
                        sessions[players[i].id].emit('remove')
                    }
                }
            }
            if(this.bullet.length > 0) {
                console.log(this.bullet.length)
                for(var i = 0; i < this.bullet.length; i++) {
                    this.bullet[i].x -= this.bullet[i].speed;
                    if(this.bullet[i].x + this.bullet[i].w >= this.target.x && this.bullet[i].y + this.bullet[i].h >= this.target.y && this.bullet[i].y <= this.target.y + this.target.h && this.bullet[i].x < this.target.x + this.target.w) {
                        if(this.target.wallUp) {
                            switch(this.bullet[i].c) {
                                case 'red':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('blue fire ball hit red fire wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'bigFire');
                                                }
                                            }
                                            break;
                                        case 'water':
                                            console.log('blue fire ball hit red water wall')
                                            //delete
                                            break;
                                        case 'earth':
                                            console.log('blue fire ball hit red earth wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'meteor');
                                                }
                                            }
                                            break;
                                        case 'air':
                                            console.log('blue fire ball hit red air wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'light');
                                                }
                                            }
                                            break;
                                    }
                                    break;
                                case 'brown':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('blue earth ball hit red fire wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'meteor');
                                                }
                                            }
                                            break;
                                        case 'water':
                                            console.log('blue earth ball hit red water wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'plant');
                                                }
                                            }
                                            break;
                                        case 'earth':
                                            console.log('blue earth ball hit red earth wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'bigEarth');
                                                }
                                            }
                                            break;
                                        case 'air':
                                            console.log('blue earth ball hit red air wall')
                                            //delete
                                            break;
                                    }
                                    break;
                                case 'blue':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('blue water ball hit red fire wall')
                                            //delete
                                            break;
                                        case 'water':
                                            console.log('blue water ball hit red water wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'bigWater');
                                                }
                                            }
                                            break;
                                        case 'earth':
                                            console.log('blue water ball hit red earth wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'plant');
                                                }
                                            }
                                            break;
                                        case 'air':
                                            console.log('blue water ball hit red air wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'ice');
                                                }
                                            }
                                            break;
                                    }
                                    break;
                                case 'whitesmoke':
                                    switch(this.target.element) {
                                        case 'fire':
                                            console.log('blue air ball hit red fire wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'light');
                                                }
                                            }
                                            break;
                                        case 'water':
                                            console.log('blue air ball hit red water wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'ice');
                                                }
                                            }
                                            break;
                                        case 'earth':
                                            console.log('blue air ball hit red earth wall')
                                            //delete
                                            break;
                                        case 'air':
                                            console.log('blue air ball hit red air wall')
                                            for(var ai in players) {
                                                if(players[ai].c === 'red') {                                                
                                                    rebound(players[ai], 'bigAir');
                                                }
                                            }
                                            break;
                                    }
                                    break;
                            }
                        } else {
                            this.target.hp -= 10;
                        }
                        //enemy/wall hit bullet deletion
                        this.bullet[i].id = id;   
                        for (var j = this.bullet.length - 1; i >= 0; --i) {                
                            if (this.bullet[i].id == this.id) {
                                this.bullet.splice(i,1);
                                return;
                            }
                        }
                        
                    }

                    //off screen bullet deletion
                    if (this.bullet[i].x < 0 - this.bullet[i].w) {
                        this.bullet[i].id = this.id;
                        for (var j = this.bullet.length - 1; i >= 0; --i) {                
                            if (this.bullet[i].id == this.id) {
                                this.bullet.splice(i,1);
                                return;
                            }
                        }
                    } 
                }
            }
            if(this.right) {
                if(this.x < 1500 - this.w) {
                    this.x += this.speed;
                    if(this.wallUp){
                        this.wallx = this.x - 10;
                        this.wally = this.y - 7;
                    }
                }
            }
            if(this.left) {
                if(this.x > 760) {
                    this.x -= this.speed;
                    if(this.wallUp){
                        this.wallx = this.x - 10;
                        this.wally = this.y - 7;
                    }
                }
            }
            if(this.up) {
                if(this.y > 30) {
                    this.y -= this.speed;
                    if(this.wallUp){
                        this.wallx = this.x - 10;
                        this.wally = this.y - 7;
                    }
                }
            }
            if(this.down) {
                if(this.y < 675 - this.h) {
                    this.y += this.speed;
                    if(this.wallUp){
                        this.wallx = this.x - 10;
                        this.wally = this.y - 7;
                    }
                }
            }
        }
        
    };
}


function Bullet(x, y, w, h, c, id, speed, level) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.id = id;
    this.speed = speed;
    this.level = level;
    if(this.level === 2) {
        // this.speed = 15;
    }
}
function rebound(player, type) {
    switch(type) {
        case 'bigFire':
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(255, 0, 0)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(255, 0, 0)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(255, 0, 0)', Math.random(), 15, 2))
            break;
        case 'bigWater':
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(0, 0, 255)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(0, 0, 255)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(0, 0, 255)', Math.random(), 15, 2))
            break;
        case 'bigAir':
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(245, 245, 245)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(245, 245, 245)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(245, 245, 245)', Math.random(), 15, 2))
            break;
        case 'bigEarth':
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(165, 42, 42)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(165, 42, 42)', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'rgb(165, 42, 42)', Math.random(), 15, 2))
            break;
        case 'light':
            player.bullet.push(new Bullet(player.x + 10, player.y + 5, 50, 10, 'yellow', Math.random(), 45, 2))
            player.bullet.push(new Bullet(player.x - 10, player.y - 5, 50, 10, 'yellow', Math.random(), 45, 2))
            break;
        case 'meteor':
            player.bullet.push(new Bullet(player.x, player.y - 60, 20, 20, 'FireBrick', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x + 10, player.y, 30, 30, 'FireBrick', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y + 60, 20, 20, 'FireBrick', Math.random(), 15, 2))
            break;
        case 'plant':
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'lime', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'lime', Math.random(), 15, 2))
            player.bullet.push(new Bullet(player.x, player.y, 50, 50, 'lime', Math.random(), 15, 2))
            break;
        case 'ice':
            player.bullet.push(new Bullet(player.x, player.y, 75, 75, 'cyan', Math.random(), 5, 2))
            player.bullet.push(new Bullet(player.x, player.y, 75, 75, 'cyan', Math.random(), 5, 2))
            player.bullet.push(new Bullet(player.x, player.y, 75, 75, 'cyan', Math.random(), 5, 2))
            break;
    }
}


var count = 0;
io.sockets.on('connection', function(socket) { 
    count = 0; 
    socket.id = Math.random();
    sessions[socket.id] = socket;

    var modify = {
        playerOne: {
            create: function() {
                var player = new Player(250, 250, 50, 50, 'red', 5.65464654, socket.id)
                player.hpx = 0;
                player.hpy = 0;
                player.hpw = 750;
                player.hpnx = 350;
                player.hpny = 25
                players[socket.id] = player;
            }
        },
        playerTwo: {
            create: function() {
                var player = new Player(850, 250, 50, 50, 'blue', 5.65464654, socket.id)
                player.hpx = 760;
                player.hpy = 0;
                player.hpw = 750;
                player.hpnx = 1150;
                player.hpny = 25;
                players[socket.id] = player;
            
            }
        },
        playerInQueue: {
            create: function() {
                var player = new Player(-2000, -2000, 50, 50, 'yellow', 5.65464654, socket.id)
                player.hpx = -110;
                player.hpy = -100;
                player.hp = -100;
                players[socket.id] = player;
            },
        } 
    }

    
    socket.on('join', function() {  
        
        //keeps track of amount players 1, 2, and in queue
        for(var i in players) {
            count++;
        }
        
        //if your first to join
        if(count === 0) {
            console.log('joined as red')
            modify.playerOne.create();

        //if your second to join as red
        } else if(count === 1) {

            //checks if blue is already here. if he is, become red
            for(var i in players) {
                if(players[i].c === 'blue') {
                    modify.playerOne.create();
                    return;
                }
            }

            //if your second to join as blue
            console.log('joined as blue')
            modify.playerTwo.create();

            //if red and blue are already playing
        }  else if(count > 1 ) {
            console.log('player joined queue')
            modify.playerInQueue.create();
        }
    })

    socket.on('disconnect', function() {
        count--;

        //if a player disconnects
        if(players[socket.id]) {

            //if blue disconnects
            if(players[socket.id].c === 'blue') {

                //checks if a player is in queue, if they are they become the new blue
                for(var i in players) {
                    if(players[i].c === 'yellow') {
                        players[i].hp = 100;
                        players[i].c = 'blue';
                        players[i].x = 850;
                        players[i].y = 250;
                        players[i].hpx = 760;
                        players[i].hpy = 0;
                        players[i].hpnx = 1150;
                        players[i].hpny = 25
                        players[i].hpw = 750;
                        delete players[socket.id]
                        delete sessions[socket.id]
                        return;
                    }
                }
            }
            //if red disconnects
            if(players[socket.id].c === 'red') {
                //checks if player is in queue and if so becomes the new red
                for(var i in players) {
                    if(players[i].c === 'yellow') {
                        players[i].hp = 100;
                        players[i].c = 'red';
                        players[i].x = 250;
                        players[i].y = 250;
                        players[i].hpx = 0;
                        players[i].hpy = 0;
                        players[i].hpw = 750;
                        players[i].hpnx = 350;
                        players[i].hpny = 25
                        delete players[socket.id]
                        delete sessions[socket.id]
                        return;
                    }
                }
            }
        }
        delete players[socket.id]
        delete sessions[socket.id]
    })

    socket.on('keyPress', function(data) {
        if(players[socket.id] !== undefined) {
            switch(data.input) {
                case 'q':
                    players[socket.id].element = 'fire';
                    break;
                case 'w':
                    players[socket.id].element = 'water';
                    break;
                case 'e':
                    players[socket.id].element = 'earth';
                    break;
                case 'r':
                    players[socket.id].element = 'air';
                    break;
                case 'up':
                    players[socket.id].up = data.state;
                    break;
                case 'left':
                    players[socket.id].left = data.state;
                  break;
                case 'right':
                    players[socket.id].right = data.state;
                  break;
                case 'down':
                    players[socket.id].down = data.state;
                  break;
                case 'd':
                    if(players[socket.id]) {
                        if(players[socket.id].wallReady) {
                            players[socket.id].wallUp = true;
                            players[socket.id].wallReady = false;
                            setTimeout(function() {
                                if(players[socket.id]) {
                                    players[socket.id].wallUp = false;
                                    players[socket.id].wallx = -500;
                                    return;
                                } else {
                                    return;
                                }
                            }, 225)

                            setTimeout(function() {
                                if(players[socket.id]) {
                                    players[socket.id].wallReady = true;
                                } else {
                                    return;
                                }
                            }, 2000)

                        } else {
                            return;
                        }
                        players[socket.id].wally = players[socket.id].y - 7;

                        switch(players[socket.id].element) {
                            case 'fire':
                                c = 'red'
                                break;
                             case 'water':
                                c = 'blue'
                                break;
                             case 'earth':
                                c = 'brown'
                                break;
                             case 'air':
                                c = 'whitesmoke'
                                break;
                        }
                        players[socket.id].wallc = c;
                        
                    }
                    break;
                case 'f':
                    var x = players[socket.id].x;
                    var y = players[socket.id].y;
                    var c = players[socket.id].c;
                    if(players[socket.id].clip > 0) { 
                        switch(players[socket.id].element) {
                            case 'fire':
                                c = 'red'
                                break;
                             case 'water':
                                c = 'blue'
                                break;
                             case 'earth':
                                c = 'brown'
                                break;
                             case 'air':
                                c = 'whitesmoke'
                                break;
                        }
                        players[socket.id].bullet.push(new Bullet(x, y, 25, 25, c, Math.random(), 8, 1))
                        players[socket.id].clip--;
                        console.log('bullet shot clip now has ' + players[socket.id].clip)                        
                        setTimeout(function() {
                            if(players[socket.id]) {
                                players[socket.id].clip++;
                                console.log('bullet loaded clip now has ' + players[socket.id].clip)                        
                            } else {
                                return;
                            }
                        }, 3000)
                    }
                break;
              }
        }
    })
})
//sends things to render to client
setInterval(function() {
    var count = 0;
    for(var i in players) {
        count++;
        players[i].update();
    }
    for(var i in sessions) {
        
        var socket = sessions[i];

        if(players[i]) {
            if(players[i].c === 'red') {
                socket.emit('playerTypeMessage',{
                    message: 'you are red'
                })
            } else if(players[i].c === 'blue') {
                socket.emit('playerTypeMessage',{
                    message: 'you are blue'
                })
            } else if(players[i].c === 'yellow') {
                socket.emit('playerTypeMessage',{
                    message: `you are in the queue. there are ${count -1} players here`
                })
            }
        }
        socket.emit('render', players)
    }
}, 10)   