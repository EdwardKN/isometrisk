var backCanvas = document.getElementById("backCanvas");
var backCtx = backCanvas.getContext("2d");


backCanvas.width = 1920;
backCanvas.height = 1080

backCtx.imageSmoothingEnabled = false;




var map = {};

var chunkList = {
    seed:Math.floor(Math.random()*100000)
};




const chunkSize = 24;
const mapSize = 0;

const scale = 100;

var drawScale = 1;

var player = {
    x: 0,
    y: 0,
    z: 0,
    rotation: 0,
    speed: 4,
    direction: 0
}

var mouse = {
    x: 0,
    y: 0
}

var blocks = new Image();

blocks.src = "blocks.png"

var image = new Image();

window.addEventListener('wheel', function(e){
    if(e.deltaY < 0 && drawScale < 2){
        player.x += mouse.x/55/drawScale
        player.y += mouse.y/55/drawScale
        drawScale *= 1.1;

    }
    if(e.deltaY > 0 && drawScale > 0.2){
        player.y -= mouse.y/45/drawScale
        player.x -= mouse.x/45/drawScale

        drawScale *= 0.9;


    }
});

window.addEventListener("mousemove", function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
})

window.addEventListener("keydown",function(e){

    if(e.keyCode == 70){
        var parentDiv = document.getElementById("content");
        parentDiv.requestFullscreen();
    }
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



function generateChunk(chunkX,chunkY){
    for(var z = 0; z < 5; z++){
        for(var y = 0; y < chunkSize; y++){
            for(var x = 0; x < chunkSize; x++){
                if(z == 0){

                    if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+1,250) > 140){
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = 4
                    }else if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+1,250) > 120){
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = 6
                    }else{
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = 0
                    }
                }
                if(z == 1){
                    map[`${chunkY},${chunkX},${z},${x},${y}`] = -1
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] != 4){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+5,10)  > 80){
                            if(seedRandomizer(chunkList.seed+5 + (x + (chunkX)*chunkSize)*3000 + (y+ (chunkY)*chunkSize)*200) > 0.95){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 3
                            }
                        }
                        if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] != 6){
                            if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+3,60)> 100){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 0;

                            }else if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+3,60)> 0){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 1;
                            } 

                            if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+2,90) > 150){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                            } 
                        }
                    }else{
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = -1                    
                    }
                }
                if(z == 2){
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] == 5){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+2,80) > 100){
                            map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                        }
                    }
                }
                if(z == 3){
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] == 5){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+2,80) > 150){
                            map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                        }
                    }
                }
                if(z == 4){
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] == 5){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,chunkList.seed+2,80) > 220){
                            map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                        }
                    }
                }
            }
        }
    }
    var preRenderCanvas = document.createElement("canvas")
    preRenderCanvas.width = 1920/2 - 60
    preRenderCanvas.height = 1080/2

    var preRenderCtx = preRenderCanvas.getContext("2d");
    

    for(var z = 0; z < 5; z++){
        for(var y = 0; y < chunkSize; y++){
            for(var x = 0; x < chunkSize; x++){
                if(map[`${chunkY},${chunkX},${z},${x},${y}`] >= 0){
                    preRenderCtx.drawImage(blocks,map[`${chunkY},${chunkX},${z},${x},${y}`]*20,0,20,20,to_screen_coordinate(x,y).x/5 + chunkSize*10 - 10,to_screen_coordinate(x,y+z*2).y/5-z*scale/5 + 80,20,20);
                }
            }
        }
    }





    chunkList[`${chunkY},${chunkX}`] = preRenderCanvas;

    
} 


function to_screen_coordinate(x,y){
    return {
        x: x*0.5*scale+y*-0.5*scale,
        y: x*0.25*scale+y*0.25*scale
    }
}

function invert_matrix(a, b, c, d) {
  const det = (1 / (a * d - b * c));
  
  return {
    a: det * d,
    b: det * -b,
    c: det * -c,
    d: det * a,
  }
}

function to_grid_coordinate(x,y) {
  const a = 1 * 0.5 * scale;
  const b = -1 * 0.5 * scale;
  const c = 0.5 * 0.5 * scale;
  const d = 0.5 * 0.5 * scale;
  
  const inv = invert_matrix(a, b, c, d);
  
  return {
    x: Math.floor(x * inv.a + y * inv.b),
    y: Math.floor(x * inv.c + y * inv.d),
  }
}
var list = {};
function show_map(){
    backCtx.clearRect(0,0,backCanvas.width,backCanvas.height);

    
    let listOfcoordinates = {
        third:{
            x: Math.floor(to_grid_coordinate((-500+player.x*5) + 1920/drawScale,(-1020+player.y*5) - 1920/drawScale).x/chunkSize),
            y: Math.floor(to_grid_coordinate((-500+player.x*5) + 1920/drawScale,(-1020+player.y*5) - 1920/drawScale).y/chunkSize)
        },
        fourth:{
            x: Math.floor(to_grid_coordinate((500+player.x*5) + 1920/drawScale,(1020+player.y*5) + 1920/drawScale).x/chunkSize),
            y: Math.floor(to_grid_coordinate((500+player.x*5) + 1920/drawScale,(1020+player.y*5) + 1920/drawScale).y/chunkSize)
        }
    }


    for(var x = listOfcoordinates.third.x-1; x <= listOfcoordinates.fourth.x+1; x++){
        for(var y = listOfcoordinates.third.y-1; y <= listOfcoordinates.fourth.y+1; y++){
            try{
                backCtx.drawImage(chunkList[`${y},${x}`],player.x + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).x + chunkSize*10,player.y + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).y,backCanvas.width/5/drawScale,backCanvas.height/5/drawScale,0,0,backCanvas.width,backCanvas.height);
            }catch{
                if(list[`${y},${x}`] == undefined){
                    list[`${y},${x}`] = true;
                    generateChunk(x,y)     
                }               
            
            }
            
        }
    }


}



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

function makePositive(a){
    if (a < 0) {
        a = a * -1;
    }
    return a;
}

var testCanvas = document.getElementById("canvas");
var testCanvasCtx = testCanvas.getContext("2d");

testCanvas.width = backCanvas.width;
testCanvas.height = backCanvas.height;

function getPerlinNoise(x,y,perlinSeed, resolution){
    noise.seed(perlinSeed);

    var value = noise.simplex2(x / resolution, y / resolution);

    if(value < 0){
        value = 0;
    }   
    value = Math.abs(value) * 255

    //testCanvasCtx.globalAlpha = 0.05;
    //testCanvasCtx.fillStyle = "rgba("+value+","+value+","+value+","+1+")";
    //testCanvasCtx.fillRect(-to_screen_coordinate(x,y).x/50 + 500,to_screen_coordinate(x,y).y/50 + 500,5,1);
    
    return value;

}
function seedRandomizer(mySeed){
    let newSeed = (Math.sin(mySeed) + 1)/2;
    return(newSeed);
}