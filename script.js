var backCanvas = document.getElementById("backCanvas");
var backCtx = backCanvas.getContext("2d");


backCanvas.width = 5920;
backCanvas.height = 5080

backCtx.imageSmoothingEnabled = false;



var seed = 3//Math.floor(Math.random()*100000);

var map = {};

var chunkList = {};

const chunkSize = 45;
const mapSize = 0;

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

window.addEventListener("mousemove", function(e){
})


window.addEventListener("keydown",function(e){
    console.log(e.keyCode);

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

function convertCanvasToImage(canvas) {
    var image = new Image();
    canvas.toBlob(function(blob) {
            url = URL.createObjectURL(blob);
            image.onload = function() {
          URL.revokeObjectURL(url);
        };

        image.src = url;

    })
    return image;
}

function generateChunk(chunkX,chunkY){
    for(var z = 0; z < 5; z++){
        for(var y = 0; y < chunkSize; y++){
            for(var x = 0; x < chunkSize; x++){
                if(z == 0){

                    if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+1,250) > 140){
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = 4
                    }else if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+1,250) > 120){
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = 6
                    }else{
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = 0
                    }
                }
                if(z == 1){
                    map[`${chunkY},${chunkX},${z},${x},${y}`] = -1
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] != 4){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+5,10)  > 80){
                            if(seedRandomizer(seed+5 + (x + (chunkX)*chunkSize)*3000 + (y+ (chunkY)*chunkSize)*200) > 0.95){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 3
                            }
                        }
                        if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] != 6){
                            if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+3,60)> 100){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 0;

                            }else if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+3,60)> 0){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 1;
                            } 

                            if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+2,90) > 150){
                                map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                            } 
                        }
                    }else{
                        map[`${chunkY},${chunkX},${z},${x},${y}`] = -1                    
                    }
                }
                if(z == 2){
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] == 5){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+2,80) > 100){
                            map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                        }
                    }
                }
                if(z == 3){
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] == 5){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+2,80) > 150){
                            map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                        }
                    }
                }
                if(z == 4){
                    if(map[`${chunkY},${chunkX},${z-1},${x},${y}`] == 5){
                        if(getPerlinNoise(y+chunkY*chunkSize,x+chunkX*chunkSize,seed+2,80) > 220){
                            map[`${chunkY},${chunkX},${z},${x},${y}`] = 5;
                        }
                    }
                }
            }
        }
    }


    var preRenderCanvas = document.createElement("canvas");
    var preRenderCtx = preRenderCanvas.getContext("2d");
    
    preRenderCanvas.width = 1920/2 - 60;
    preRenderCanvas.height = 1080/2;

    for(var z = 0; z < 5; z++){
        for(var y = 0; y < chunkSize; y++){
            for(var x = 0; x < chunkSize; x++){
                if(map[`${chunkY},${chunkX},${z},${x},${y}`] >= 0){
                    preRenderCtx.drawImage(blocks,map[`${chunkY},${chunkX},${z},${x},${y}`]*20,0,20,20,to_screen_coordinate(x,y).x/5 + chunkSize*10 - 10,to_screen_coordinate(x,y+z*2).y/5-z*scale/5 + 80,20,20);
                }
            }
        }
    }


    image = convertCanvasToImage(preRenderCanvas);



    chunkList[`${chunkY},${chunkX}`] = image;

    return image
    
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

function show_map(){
    backCtx.clearRect(0,0,backCanvas.width,backCanvas.height);

    
    let listOfcoordinates = {
        third:{
            x: Math.floor(to_grid_coordinate(0+player.x*5,200+player.y*5).x/chunkSize),
            y: Math.floor(to_grid_coordinate(0+player.x*5,200+player.y*5).y/chunkSize)
        },
        fourth:{
            x: Math.floor(to_grid_coordinate(1080+player.x*5,0+player.y*5).x/chunkSize),
            y: Math.floor(to_grid_coordinate(1080+player.x*5,0+player.y*5).y/chunkSize)
        }
    }


    for(var x = listOfcoordinates.third.x-1; x <= listOfcoordinates.fourth.x+1; x++){
        for(var y = listOfcoordinates.third.y-1; y <= listOfcoordinates.fourth.y+1; y++){
            try{

                backCtx.drawImage(chunkList[`${y},${x}`],player.x + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).x + chunkSize*10,player.y + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).y,backCanvas.width/5,backCanvas.height/5,0,0,backCanvas.width,backCanvas.height);
            }catch{
                generateChunk(x,y)                    
            
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

    
    testCanvasCtx.fillStyle = "rgba("+value+","+value+","+value+","+1+")";
    testCanvasCtx.fillRect(-to_screen_coordinate(x,y).x/10 + 500,to_screen_coordinate(x,y).y/10 + 500,5,5);
    
    return value;

}
function seedRandomizer(mySeed){
    let newSeed = (Math.sin(mySeed) + 1)/2;
    return(newSeed);
}