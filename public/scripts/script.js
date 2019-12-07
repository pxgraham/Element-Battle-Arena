var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var socket = io();
var playBtn = document.getElementById('playBtn');
var quitBtn = document.getElementById('quitBtn');
var help = document.getElementById('help');
var helpBtn = document.getElementById('helpBtn');
var menu = document.getElementById('menu');


playBtn.addEventListener('click', function() {
    join();
    playBtn.style.display = 'none';
    document.getElementById('logo').style.display = 'none';
    document.getElementById('help').style.display = 'none';
    document.getElementById('quitBtn').style.display = 'block';
    document.getElementById('helpBtn').style.display = 'block';
})

quitBtn.addEventListener('click', function() {
    location.reload();
})

helpBtn.addEventListener('click', function() {
    menu.style.display = 'block';
})

help.addEventListener('click', function() {
    menu.style.display = 'block';
})

closeMenu.addEventListener('click', function() {
    menu.style.display = 'none';
})


socket.on('remove', function () {
    location.reload();
})

var joined = false;

function join() {
    joined = true;
    socket.emit('join');
}
var redclipx = [10, 30, 50, 70];
var blueclipx = [770, 790, 810, 830];
socket.on('render', function (data) {
    if(joined) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.drawImage(battleground, 0, 25, canvas.width, canvas.height)
        ctx.fillStyle = 'white';
        ctx.fillRect(canvas.width / 2, 0, 10, canvas.height);
        ctx.fillRect(0, 25, canvas.width, 5);
        ctx.fillRect(0, 680, canvas.width, 5);
        for (var i in data) {
            ctx.fillStyle = data[i].c;

            //renders players
            ctx.fillRect(data[i].x, data[i].y, data[i].w, data[i].h)
            // ctx.drawImage(player_down, data[i].x, data[i].y, data[i].w, data[i].h)
    
            //renders hp bars
            ctx.fillRect(data[i].hpx, data[i].hpy, data[i].hpw, 25)
            
            //renders clips
                ctx.fillStyle = 'yellow';
                if(data[i].c === 'red') {
                    console.log
                    for(var ii = 0; ii < data[i].clip; ii++) {
                        ctx.fillRect(redclipx[ii], 700, 10, 40)
                    }
                }
                if(data[i].c === 'blue') {
                    for(var iii = 0; iii < data[i].clip; iii++) {
                        ctx.fillRect(blueclipx[iii], 700, 10, 40)
                    }
                }

            for (var j = 0; j < data[i].bullet.length; j++) {
                var x = data[i].bullet[j].x;
                var y = data[i].bullet[j].y;
                var w = data[i].bullet[j].w;
                var h = data[i].bullet[j].h;
                var c = data[i].bullet[j].c;
                ctx.fillStyle = c;
                ctx.fillRect(x, y, w, h)


            }
            ctx.font = '30px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(`${data[i].hp}%`, data[i].hpnx, data[i].hpny)
        }
    }
})

document.onkeydown = function (evt) {
    switch (evt.keyCode) {
        case 38:
            socket.emit('keyPress', { input: 'up', state: true })
            break;
        case 37:
            socket.emit('keyPress', { input: 'left', state: true })
            break;
        case 39:
            socket.emit('keyPress', { input: 'right', state: true })
            break;
        case 40:
            socket.emit('keyPress', { input: 'down', state: true })
            break;
        case 32:
            //space
            socket.emit('keyPress', { input: 'space' })
            break;
    }
}
document.onkeyup = function (evt) {
    switch (evt.keyCode) {
        case 38:
            socket.emit('keyPress', { input: 'up', state: false })
            break;
        case 37:
            socket.emit('keyPress', { input: 'left', state: false })
            break;
        case 39:
            socket.emit('keyPress', { input: 'right', state: false })
            break;
        case 40:
            socket.emit('keyPress', { input: 'down', state: false })
            break;
    }
}

//MOBILE CONTROLS BELOW --- COMMENTED OUT UNTIL PC VERSION WORKS BETTER

// var upBtn = document.getElementById('up');
// upBtn.addEventListener('touchstart', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'up', state:true})
// })
// upBtn.addEventListener('touchend', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'up', state:false})
// })

// var downBtn = document.getElementById('down');
// downBtn.addEventListener('touchstart', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'down', state:true})
// })
// downBtn.addEventListener('touchend', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'down', state:false})
// })

// var leftBtn = document.getElementById('left');
// leftBtn.addEventListener('touchstart', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'left', state:true})
// })
// leftBtn.addEventListener('touchend', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'left', state:false})
// })

// var rightBtn = document.getElementById('right');
// rightBtn.addEventListener('touchstart', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'right', state:true})
// })
// rightBtn.addEventListener('touchend', function(e) {
//     e.preventDefault();
//     socket.emit('keyPress', {input: 'right', state:false})
// })
// var a = document.getElementById('a');
// a.addEventListener('touchstart', function (e) {
//     e.preventDefault();
//     socket.emit('keyPress', { input: 'space' })
// }, false)

// var pad = document.getElementById('joystick');
// pad.width = 500;
// pad.height = 500;
// var jctx = pad.getContext('2d');
// var rect = pad.getBoundingClientRect();
// var up_arrow = document.getElementById("img");
// jctx.fillStyle = 'black',
//     jctx.fillRect(0, 0, pad.width, pad.height);
//     jctx.fillStyle = 'black';
//     jctx.fillRect(166, 0, 15, pad.height);
//     jctx.fillRect(333, 0, 15, pad.height);
//     jctx.fillRect(166, 166, 167, 167)

//     jctx.fillRect(0, 166, pad.width, 15);
//     jctx.fillRect(0, 333, pad.width, 15);
// jctx.drawImage(img, 10, 10);

// var cX = Math.floor(pad.width / 2);
// var cY = Math.floor(pad.height / 2);

// var xPos;
// var yPox;
// var des;
// var dist;

// var initialX;
// var initialY;


// function getMousePos(pad, mouseEvent) {
//     var rect = pad.getBoundingClientRect();

//     initialX = mouseEvent.touches[0].clientX - 80;
//     initialY = mouseEvent.touches[0].clientY - 800;

//     if (mouseEvent.touches.length === 1) {
//         initialX = mouseEvent.touches[0].clientX - 80;
//         initialY = mouseEvent.touches[0].clientY - 800;
//     } else if (mouseEvent.touches.length > 1) {
//         initialX = mouseEvent.touches[1].clientX - 80;
//         initialY = mouseEvent.touches[1].clientY - 800;
//         if (initialX > 350 || initialY > 350 || initialX < 0 || initialY < 0) {
//             initialX = mouseEvent.touches[0].clientX - 80;
//             initialY = mouseEvent.touches[0].clientY - 800;
//         }
//     }

    // console.log('moust event touches --- ' + mouseEvent.touches.length);

    // if (mouseEvent.touches.length === 1) {
        // stats.innerText = `One press~~~touches[0].x,y = ${Math.round(mouseEvent.touches[0].clientX - 80)},${Math.round(mouseEvent.touches[0].clientY - 80)}`;
        // return {
            // x: mouseEvent.touches[0].clientX - 80,
            // y: mouseEvent.touches[0].clientY - 800
        // };
    // } else if (mouseEvent.touches.length > 1) {
        // stats.innerText = `TWO presses!!!~~~touches[1].x,y = ${Math.round(mouseEvent.touches[1].clientX - 80)},${Math.round(mouseEvent.touches[1].clientY - 80)} else | ${Math.round(mouseEvent.touches[0].clientX - 80)},${Math.round(mouseEvent.touches[0].clientY - 80)}`;
        // return {
            // x: mouseEvent.touches[1].clientX - 80,
            // y: mouseEvent.touches[1].clientY - 800
        // };
    // }
// }

// var interval;
// pad.addEventListener("touchmove", function (e) {
    // e.preventDefault();
    // e.stopPropagation();

    // var m = getMousePos(pad, e);

    // if (m.x < cX) {
    //     if (m.y < cY) pos = 180 + Math.floor(Math.atan((m.y - cY) / (cX - m.x)) * (180 / Math.PI));
    //     else pos = 180 + -Math.floor(Math.atan((m.y - cY) / (m.x - cX)) * (180 / Math.PI));
    // } else {
    //     if (m.y < cY) pos = - Math.floor(Math.atan((cY - m.y) / (cX - m.x)) * (180 / Math.PI));
    //     else pos = 360 + Math.floor(Math.atan((cY - m.y) / (m.x - cX)) * (180 / Math.PI));
    // }

    // get the distance from the centre
    // tX = Math.abs(cX - m.x);
    // tY = Math.abs(cY - m.y);
    // tD = Math.floor(Math.sqrt(tX * tX + tY * tY));
    // console.log(`
    // X:          ${m.x}  
    // Y:          ${m.y}
    // Degrees:    ${pos}
    // Distance:   ${tD}px ${cX} 30
    //     `)
    // xPos = m.x - 20;
    // yPos = m.y - 80;
    // deg = pos;
    // dist = tD;

    // joystickrender()

    //upper left
    // if (initialX < 242 && initialY < 866 && initialY) {
        // console.log('upleft')
    //     socket.emit('keyTap', {
    //         input: 'upleft',
    //         left: true,
    //         up: true,
    //         down: false,
    //         right: false
    //     })
    // }

    //center left
    // if (initialX < 242 && initialY > 866 && initialY < 1033) {
        // console.log('center left')
    //     socket.emit('keyTap', {
    //         input: 'left',
    //         left: true,
    //         up: false,
    //         down: false,
    //         right: false
    //     })
    // }
    // bottom left
    // if (initialY > 1033 && initialX < 242) {
        // console.log('bottom left')
    //     socket.emit('keyTap', {
    //         input: 'downleft',
    //         left: true,
    //         up: false,
    //         down: true,
    //         right: false
    //     })
    // }
    //bottom center;
    // if (initialX > 242 && initialX < 408 && initialY > 1033) {
        // console.log('bottom center')
    //     socket.emit('keyTap', {
    //         input: 'down',
    //         left: false,
    //         up: false,
    //         down: true,
    //         right: false
    //     })
    // }
    //bottom right
    // if (initialX > 419 && initialY > 1033 && initialX < 533 && initialY < 1188) {
        // console.log('bottom right')
    //     socket.emit('keyTap', {
    //         input: 'downright',
    //         left: false,
    //         up: false,
    //         down: true,
    //         right: true
    //     })
    // }
    //right center
    // if (initialX > 431 && initialY > 877 && initialY < 1044) {
        // console.log('rightcenter')
    //     socket.emit('keyTap', {
    //         input: 'right',
    //         left: false,
    //         up: false,
    //         down: false,
    //         right: true
    //     })
    // }
    //upper right
    // if (initialX > 419 && initialY < 877) {
        // console.log('upperright')
    //     socket.emit('keyTap', {
    //         input: 'upright',
    //         left: false,
    //         up: true,
    //         down: false,
    //         right: true
    //     })
    // }
    //top center 
    // if (initialX > 242 && initialX < 386 && initialY < 855) {
        // console.log('top center')
    //     socket.emit('keyTap', {
    //         input: 'up',
    //         left: false,
    //         up: true,
    //         down: false,
    //         right: false
    //     })
    // }


// }, false);

// function joystickrender() {
    // console.log(initialX, initialY)

    // jctx.fillStyle = 'black',
    // jctx.fillRect(0, 0, pad.width, pad.height);
    // jctx.fillStyle = 'black';
    // jctx.fillRect(166, 0, 15, pad.height);
    // jctx.fillRect(333, 0, 15, pad.height);
    // jctx.fillRect(166, 166, 167, 167)

    // jctx.fillRect(0, 166, pad.width, 15);
    // jctx.fillRect(0, 333, pad.width, 15);

    // jctx.fillStyle = 'yellow',
        
    // jctx.fillRect(initialX, initialY, 15, 15);
    // jctx.drawImage(up_arrow, 50, 50, pad.width, pad.height);
// }

// pad.addEventListener('touchstart', function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     var m = getMousePos(pad, e);

//     if (m.x < cX) {
//         if (m.y < cY) pos = 180 + Math.floor(Math.atan((m.y - cY) / (cX - m.x)) * (180 / Math.PI));
//         else pos = 180 + -Math.floor(Math.atan((m.y - cY) / (m.x - cX)) * (180 / Math.PI));
//     } else {
//         if (m.y < cY) pos = - Math.floor(Math.atan((cY - m.y) / (cX - m.x)) * (180 / Math.PI));
//         else pos = 360 + Math.floor(Math.atan((cY - m.y) / (m.x - cX)) * (180 / Math.PI));
//     }

    // get the distance from the centre
    // tX = Math.abs(cX - m.x);
    // tY = Math.abs(cY - m.y);
    // tD = Math.floor(Math.sqrt(tX * tX + tY * tY));
    // xPos = m.x - 20;
    // yPos = m.y - 80;
    // deg = pos;
    // dist = tD;

    //upper left
    // if (initialX < 242 && initialY < 866 && initialY) {
        // console.log('upleft')
    //     socket.emit('keyTap', {
    //         input: 'upleft',
    //         left: true,
    //         up: true,
    //         down: false,
    //         right: false
    //     })
    // }

    //center left
    // if (initialX < 242 && initialY > 866 && initialY < 1033) {
        // console.log('center left')
    //     socket.emit('keyTap', {
    //         input: 'left',
    //         left: true,
    //         up: false,
    //         down: false,
    //         right: false
    //     })
    // }
    // bottom left
    // if (initialY > 1033 && initialX < 242) {
        // console.log('bottom left')
    //     socket.emit('keyTap', {
    //         input: 'downleft',
    //         left: true,
    //         up: false,
    //         down: true,
    //         right: false
    //     })
    // }
    //bottom center;
    // if (initialX > 242 && initialX < 408 && initialY > 1033) {
        // console.log('bottom center')
    //     socket.emit('keyTap', {
    //         input: 'down',
    //         left: false,
    //         up: false,
    //         down: true,
    //         right: false
    //     })
    // }
    //bottom right
    // if (initialX > 419 && initialY > 1033 && initialX < 533 && initialY < 1188) {
        // console.log('bottom right')
    //     socket.emit('keyTap', {
    //         input: 'downright',
    //         left: false,
    //         up: false,
    //         down: true,
    //         right: true
    //     })
    // }
    //right center
    // if (initialX > 431 && initialY > 877 && initialY < 1044) {
        // console.log('rightcenter')
    //     socket.emit('keyTap', {
    //         input: 'right',
    //         left: false,
    //         up: false,
    //         down: false,
    //         right: true
    //     })
    // }
    //upper right
    // if (initialX > 419 && initialY < 877) {
        // console.log('upperright')
    //     socket.emit('keyTap', {
    //         input: 'upright',
    //         left: false,
    //         up: true,
    //         down: false,
    //         right: true
    //     })
    // }
    //top center 
    // if (initialX > 242 && initialX < 386 && initialY < 855) {
        // console.log('top center')
    //     socket.emit('keyTap', {
    //         input: 'up',
    //         left: false,
    //         up: true,
    //         down: false,
    //         right: false
    //     })
    // }

    // joystickrender()
// }, false)
// pad.addEventListener('touchend', function (e) {
//     e.preventDefault();
//     socket.emit('keyTap', {
//         input: 'end',
//         left: false,
//         up: false,
//         down: false,
//         right: false
//     })
// })