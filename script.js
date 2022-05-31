var backCanvas = document.getElementById("backCanvas");
var backCtx = backCanvas.getContext("2d");


backCanvas.width = 1920;
backCanvas.height = 1080

backCtx.imageSmoothingEnabled = false;

var map = [];

var chunkArray = [];
const chunkSize = 20;
const mapSize = 3;

const scale = 100;

var player = {
    x: 0,
    y: 0,
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
    for(var chunkX = 0; chunkX < mapSize; chunkX++){
        var tmpMap3 = [];
        for(var chunkY = 0; chunkY < mapSize; chunkY++){
            var tmpMap2 = [];
            for(var z = 0; z < 5; z++){
                let tmpMap1 = []
                for(var y = 0; y < chunkSize; y++){
                    let tmpMap = []
                    for(var x = 0; x < chunkSize; x++){
                        if(z == 0){
                            if(Math.random() < 0.01){
                                tmpMap.push(4);
                            }else{
                                tmpMap.push(0);
                            }
                        }
                        if(z == 1){
                            if(Math.random() < 0.1){
                                tmpMap.push(1);
                            }else if(Math.random() < 0.1){
                                tmpMap.push(3);
                            }else if(Math.random() < 0.05){
                                tmpMap.push(0);
                            }else if(Math.random() < 0.05){
                                tmpMap.push(5);
                            }else{
                                tmpMap.push(-1);
                            }
                        }

                    }
                    tmpMap1.push(tmpMap);
                }
                tmpMap2.push(tmpMap1);
            }
            tmpMap3.push(tmpMap2);
        }
        map.push(tmpMap3);
    }
    prerender()
}

function prerender(){
    

    //preRenderCanvas.style.display = "none";

    for(var chunkX = 0; chunkX < mapSize; chunkX++){
        var tmpchunkArray = [];
        for(var chunkY = 0; chunkY < mapSize; chunkY++){

            var preRenderCanvas = document.createElement("canvas");
            var preRenderCtx = preRenderCanvas.getContext("2d");
            
            preRenderCanvas.width = 1920;
            preRenderCanvas.height = 1080;

            for(var z = 0; z < 5; z++){
                for(var y = 0; y < chunkSize; y++){
                    for(var x = 0; x < chunkSize; x++){
                        if(map[chunkX][chunkY][z][y][x] >= 0){
                            preRenderCtx.drawImage(blocks,map[chunkX][chunkY][z][x][y]*20,0,20,20,to_screen_coordinate(x,y).x/5 + 150,to_screen_coordinate(x,y+z*2).y/5-z*scale/5 + 10,20,20);
                        }
                    }
                }
            }


            image = convertCanvasToImage(preRenderCanvas);

            tmpchunkArray.push(image);
            
            preRenderCtx.drawImage(image,0,0);


        }
        chunkArray.push(tmpchunkArray)

    }
}


function to_screen_coordinate(x,y){
    return {
        x: x*0.5*scale+y*-0.5*scale - 0.5*scale,
        y: x*0.25*scale+y*0.25*scale
    }
}

function show_map(){
    backCtx.clearRect(0,0,backCanvas.width,backCanvas.height);
    for(let chunkX = 0; chunkX < mapSize; chunkX++){
        for(let chunkY = 0; chunkY < mapSize; chunkY++){
            backCtx.drawImage(chunkArray[chunkY][chunkX],player.x + to_screen_coordinate(-chunkX*2,-chunkY*2).x,player.y + to_screen_coordinate(-chunkX*2,-chunkY*2).y,backCanvas.width/5,backCanvas.height/5,0,0,backCanvas.width,backCanvas.height);
        }
    }
}

setTimeout(() => {
    generateMap()
}, 200);
setTimeout(() => {
    update()
}, 400);
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

