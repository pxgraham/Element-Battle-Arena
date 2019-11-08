var express = require("express");
var path = require("path");
var app = express();

var PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("index2.html", express.static(__dirname + "index2.html"));

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "index2.html"));
});

var serv = require('http').createServer(app);

serv.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});

var io = require('socket.io')(serv, {});


var sessions = {};
var players = {};

function Player(x, y, w, h, c, speed, id) {
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
    this.update = function() {
        if(this.c === 'red') {
            for(var i in players) {
                if(players[i].c === 'blue') {                  
                    this.target.x = players[i].x;
                    this.target.y = players[i].y;
                    this.target.w = players[i].w;
                    this.target.h = players[i].h;
                    this.target.id = players[i].id;
                    players[i].hp = this.target.hp;
                    if(players[i].hp === 0) {
                        sessions[players[i].id].emit('hello')
                        this.target.hp = 100;  
                        this.bullet = [];                      
                    }
                }
            }
            if(this.bullet.length > 0) {
                for(var i = 0; i < this.bullet.length; i++) {
                    this.bullet[i].x += this.bullet[i].speed;
                    if(this.bullet[i].x + this.bullet[i].w >= this.target.x && this.bullet[i].y + this.bullet[i].h >= this.target.y && this.bullet[i].y <= this.target.y + this.target.h && this.bullet[i].x < this.target.x + this.target.w) {
                        this.target.hp -= 10;
                        this.bullet[i].id = id;   
                        for (var j = this.bullet.length - 1; i >= 0; --i) {                
                            if (this.bullet[i].id == this.id) {
                                this.bullet.splice(i,1);
                                return;
                            }
                        }
                    }
                    if (this.bullet[i].x > 1200) {
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
                if(this.x < 550) {
                    this.x += this.speed;
                }
            }
            if(this.left) {
                if(this.x > 0) {
                    this.x -= this.speed;
                }
            }
            if(this.up) {
                if(this.y > 30) {
                    this.y -= this.speed;
                }
            }
            if(this.down) {
                if(this.y < 450) {
                    this.y += this.speed;
                }
            }
        } else if(this.c === 'blue') {
            for(var i in players) {
                if(players[i].c === 'red') {                  
                    this.target.x = players[i].x;
                    this.target.y = players[i].y;
                    this.target.w = players[i].w;
                    this.target.h = players[i].h;
                    this.target.id = players[i].id;
                    players[i].hp = this.target.hp;
                    if(players[i].hp === 0) {
                        this.target.hp = 100; 
                        this.bullet = [];                       
                        sessions[players[i].id].emit('hello')
                    }
                }
            }
            if(this.bullet.length > 0) {
                for(var i = 0; i < this.bullet.length; i++) {
                    this.bullet[i].x -= this.bullet[i].speed;
                    if(this.bullet[i].x + this.bullet[i].w >= this.target.x && this.bullet[i].y + this.bullet[i].h >= this.target.y && this.bullet[i].y <= this.target.y + this.target.h && this.bullet[i].x < this.target.x + this.target.w) {
                        this.target.hp -= 10;
                        this.bullet[i].id = id;   
                        for (var j = this.bullet.length - 1; i >= 0; --i) {                
                            if (this.bullet[i].id == this.id) {
                                this.bullet.splice(i,1);
                                return;
                            }
                        }
                    }
                    if (this.bullet[i].x < 0) {
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
                if(this.x < 1150) {
                    this.x += this.speed;
                }
            }
            if(this.left) {
                if(this.x > 600) {
                    this.x -= this.speed;
                }
            }
            if(this.up) {
                if(this.y > 30) {
                    this.y -= this.speed;
                }
            }
            if(this.down) {
                if(this.y < 450) {
                    this.y += this.speed;
                }
            }
        }
        
    };
}


function Bullet(x, y, w, h, c, id, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.id = id;
    this.speed = speed;
}

var count = 0;
io.sockets.on('connection', function(socket) { 
    count = 0; 
    socket.id = Math.random();
    sessions[socket.id] = socket;


    
    socket.on('join', function() {        
        for(var i in players) {
            count++;
        }

        if(count === 0) {
            console.log('first to join')
            var player = new Player(250, 250, 50, 50, 'red', 10, socket.id)
            player.hpx = 0;
            player.hpy = 0;
            player.hpw = 600;
            player.hpnx = 250;
            player.hpny = 25
            players[socket.id] = player;
        } else if(count === 1) {
            for(var i in players) {
                if(players[i].c === 'blue') {
                    var player = new Player(250, 250, 50, 50, 'red', 10, socket.id)
                    player.hpx = 0;
                    player.hpy = 0;
                    player.hpw = 600;
                    player.hpnx = 250;
                    player.hpny = 25
                    players[socket.id] = player;
                    return;
                }
            }
            console.log('1 guy here before ya')
            var player = new Player(850, 250, 50, 50, 'blue', 10, socket.id)
            player.hpx = 600;
            player.hpy = 0;
            player.hpnx = 850;
            player.hpny = 25
            player.hpw = 600;
            players[socket.id] = player;
        }  else if(count > 1 ) {
            console.log('match already in progress')
            var player = new Player(-2000, -2000, 50, 50, 'yellow', 10, socket.id)
            player.hpx = -110;
            player.hpy = -100;
            player.hp = -100;
            players[socket.id] = player;
        }
    })

    socket.on('disconnect', function() {
        count--;
        if(players[socket.id]) {
            //if blue disconnects
            if(players[socket.id].c === 'blue') {
                //checks if theres a spectator and if there is makes the first spectator the new blue
                for(var i in players) {
                    if(players[i].c === 'yellow') {
                        players[i].hp = 100;
                        players[i].c = 'blue';
                        players[i].x = 850;
                        players[i].y = 250;
                        players[i].hpx = 600;
                        players[i].hpy = 0;
                        players[i].hpnx = 850;
                        players[i].hpny = 25
                        players[i].hpw = 600;
                        delete players[socket.id]
                        delete sessions[socket.id]
                        return;
                    }
                }
            }
            if(players[socket.id].c === 'red') {
                for(var i in players) {
                    if(players[i].c === 'yellow') {
                        players[i].hp = 100;
                        players[i].c = 'red';
                        players[i].x = 250;
                        players[i].y = 250;
                        players[i].hpx = 0;
                        players[i].hpy = 0;
                        players[i].hpw = 600;
                        players[i].hpnx = 250;
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
                case 'space':
                    var x = players[socket.id].x;
                    var y = players[socket.id].y;
                    var c = players[socket.id].c;
                    players[socket.id].bullet.push(new Bullet(x, y, 25, 25, c, socket.id, 8))
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
        // console.log(players);

        if(players[i]) {
            // console.log(players.length)
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
}, 1000/45)    
    
