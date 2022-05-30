var backCanvas = document.getElementById("backCanvas");
var backCtx = backCanvas.getContext("2d");
var preRenderCanvas = document.getElementById("prerender");
var preRenderCtx = preRenderCanvas.getContext("2d");

preRenderCanvas.style.display = "none";

backCanvas.width = 1920;
backCanvas.height = 1080
preRenderCanvas.width = 6000;
preRenderCanvas.height = 4000;

backCtx.imageSmoothingEnabled = false;
preRenderCtx.imageSmoothingEnabled = false;

var map = [];
const mapSize = 200;

const scale = 100;

var player = {
    x: 2410,
    y: 905,
    z: 0,
    rotation: 0,
    speed: 2,
    direction: 0
}

var blocks = new Image();

blocks.src = "blocks.png"

var image = new Image();


window.addEventListener("keydown",function(e){
    console.log(e.keyCode);
    if(e.keyCode == 87){
        if(player.direction == 4){
            player.direction = 5;
        }else if(player.direction == 3){
            player.direction = 6;
        }else if(player.direction !== 5 && player.direction !== 6){
            player.direction = 1
        }
        
    }
    if(e.keyCode == 83){
        if(player.direction == 4){
            player.direction = 7;
        }else if(player.direction == 3){
            player.direction = 8;
        }else if(player.direction != 7 && player.direction != 8){
            player.direction = 2;
        }
        
    }
    if(e.keyCode == 65){
        if(player.direction == 1){
            player.direction = 6;
        }else if(player.direction == 2){
            player.direction = 8;
        }else if(player.direction !== 6 && player.direction !== 8){
            player.direction = 3;
        }
    }
    if(e.keyCode == 68){
        if(player.direction == 1){
            player.direction = 5;
        }else if(player.direction == 2){
            player.direction = 7;
        }else if(player.direction !== 5 && player.direction !== 7){
            player.direction = 4
        }        
    }
});

window.addEventListener("keyup",function(e){
    if(e.keyCode == 87 && player.direction == 1){
        player.direction = 0;
    }
    if(e.keyCode == 83 && player.direction == 2){
        player.direction = 0;
    }
    if(e.keyCode == 65 && player.direction == 3){
        player.direction = 0;
    }
    if(e.keyCode == 68 && player.direction == 4){
        player.direction = 0;
    }

    if(e.keyCode == 68 && player.direction == 5){
        player.direction = 1;
    }
    if(e.keyCode == 87 && player.direction == 5){
        player.direction = 4;
    }

    if(e.keyCode == 65 && player.direction == 6){
        player.direction = 1;
    }
    if(e.keyCode == 87 && player.direction == 6){
        player.direction = 3;
    }

    if(e.keyCode == 83 && player.direction == 7){
        player.direction = 4;
    }
    if(e.keyCode == 68 && player.direction == 7){
        player.direction = 2;
    }

    if(e.keyCode == 83 && player.direction == 8){
        player.direction = 3;
    }
    if(e.keyCode == 65 && player.direction == 8){
        player.direction = 2;
    }
});

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}

function generateMap(){
    for(var z = 0; z < 5; z++){
        let tmpMap1 = []
        for(var y = 0; y < mapSize; y++){
            let tmpMap = []
            for(var x = 0; x < mapSize; x++){
                if(z == 0){
                    tmpMap.push(0);
                }
                if(z == 1){
                    if(Math.random() < 0.1){
                        tmpMap.push(1);
                    }else if(Math.random() < 0.1){
                        tmpMap.push(3);
                    }else if(Math.random() < 0.05){
                        tmpMap.push(0);
                    }else{
                        tmpMap.push(-1);
                    }
                }

            }
            tmpMap1.push(tmpMap);
        }
        map.push(tmpMap1);
    }
    for(var z = 0; z < 4; z++){
        for(var y = 1; y < mapSize-1; y++){
            for(var x = 1; x < mapSize-1; x++){
                if(z == 1){
                    if(map[z][y][x] == 0){
                        map[z][y-1][x] = 1
                        map[z][y][x-1] = 1
                        map[z][y][x+1] = 1
                        map[z][y+1][x] = 1
                    }
                }
            }
        }
    }
    prerender()
}

function prerender(){
    preRenderCtx.clearRect(0,0,preRenderCanvas.width,preRenderCanvas.height);
    for(var z = 0; z < 5; z++){
        for(var y = 0; y < map[0].length; y++){
            for(var x = 0; x < map[0].length; x++){
                if(map[z][y][x] >= 0){
                    preRenderCtx.drawImage(blocks,map[z][x][y]*20,0,20,20,to_screen_coordinate(x,y).x/5,to_screen_coordinate(x,y+z*2).y/5-z*scale/5,20,20);
                }
            }
        }
    }
    image = convertCanvasToImage(preRenderCanvas);
    backCtx.drawImage(image,0,0);
}


function to_screen_coordinate(x,y){
    return {
        x: x*0.5*scale+y*-0.5*scale - 0.5*scale + preRenderCanvas.width/2 +mapSize*scale/2,
        y: x*0.25*scale+y*0.25*scale
    }
}

function show_map(){
    backCtx.clearRect(0,0,backCanvas.width,backCanvas.height);
    backCtx.drawImage(image,player.x,player.y,backCanvas.width/5,backCanvas.height/5,0,0,backCanvas.width,backCanvas.height);
}

setTimeout(() => {
    generateMap()
}, 20);

function update(){
    show_map()
    requestAnimationFrame(update);

    if(player.direction == 4){
        moveRight(player.speed);
    }
    if(player.direction == 3){
        moveLeft(player.speed);
    }
    if(player.direction == 1){
        moveUp(player.speed);
    }
    if(player.direction == 2){
        moveDown(player.speed);
    }
    if(player.direction == 5){
        moveUp(player.speed/2);
        moveRight(player.speed);
    }
    if(player.direction == 6){
        moveUp(player.speed/2);
        moveLeft(player.speed);
    }
    if(player.direction == 7){
        moveDown(player.speed/2);
        moveRight(player.speed);
    }
    if(player.direction == 8){
        moveDown(player.speed/2);
        moveLeft(player.speed);
    }

}

function moveRight(speed){
    player.x += speed;
}
function moveLeft(speed){
    player.x -= speed;
}
function moveUp(speed){
    player.y -= speed;
}
function moveDown(speed){
    player.y += speed;
}

update()
