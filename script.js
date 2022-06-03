var backCanvas = document.getElementById("backCanvas");
var backCtx = backCanvas.getContext("2d");


backCanvas.width = 1920;
backCanvas.height = 1080

backCtx.imageSmoothingEnabled = false;

var seed = Math.floor(Math.random()*100000);

var map = [];
var negativeMap = []

var chunkArray = [];
var negativechunkArray = [];

var doneChunks = [];

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
          // no longer need to read the blob so it's revoked
          URL.revokeObjectURL(url);
        };

        image.src = url;

      })
    return image;
}

function generateChunk(chunkX,chunkY){
    
    for(let x = 0; x <= chunkY; x++){
        let tmp1 = []
        for(let y = 0; y <= chunkX; y++){
            try{

    
                if(typeof map[x][y]){}
            }catch{
                tmp1.push(0)
            }
            try{


                if(chunkArray[x][y]){}
            }catch{
                tmp1.push(0)
            }
        }
        map.push(tmp1)
        chunkArray.push(tmp1)

    }

    
    var tmpMap2 = [];
    for(var z = 0; z < 5; z++){
        let tmpMap1 = []
        for(var y = 0; y < chunkSize; y++){
            let tmpMap = []
            for(var x = 0; x < chunkSize; x++){
                if(z == 0){

                    if(getPerlinNoise(x+chunkY*chunkSize,y+chunkX*chunkSize) > 50){
                        tmpMap.push(4);
                    }else{
                        tmpMap.push(0);
                    }
                }
                if(z == 1){
                    if(tmpMap2[z-1][y][x] != 4){
                        if(seedRandomizer(seed + (x + chunkX*chunkSize)*10 + (y+ chunkY*chunkSize)*100) < 0.03){
                            tmpMap.push(1);
                        }else if(seedRandomizer(seed + (x + chunkX*chunkSize)*1000 + (y+ chunkY*chunkSize)*10) < 0.01){
                            tmpMap.push(3);
                        }else if(seedRandomizer(seed + (x + chunkX*chunkSize)*10000 + (y+ chunkY*chunkSize)*1000) < 0.05){
                            tmpMap.push(0);
                        }else{
                            tmpMap.push(-1);
                        }
                    }else{
                        tmpMap.push(-1)
                    }
                }

            }
            tmpMap1.push(tmpMap);
        }
        tmpMap2.push(tmpMap1);
    }

    map[chunkY][chunkX] = tmpMap2;

    var preRenderCanvas = document.createElement("canvas");
    var preRenderCtx = preRenderCanvas.getContext("2d");
    
    preRenderCanvas.width = 1920/2;
    preRenderCanvas.height = 1080/2;

    for(var z = 0; z < 5; z++){
        for(var y = 0; y < chunkSize; y++){
            for(var x = 0; x < chunkSize; x++){
                if(map[chunkY][chunkX][z][y][x] >= 0){
                    preRenderCtx.drawImage(blocks,map[chunkY][chunkX][z][x][y]*20,0,20,20,to_screen_coordinate(x,y).x/5 + chunkSize*10 - 10,to_screen_coordinate(x,y+z*2).y/5-z*scale/5,20,20);
                }
            }
        }
    }


    image = convertCanvasToImage(preRenderCanvas);



    chunkArray[chunkY][chunkX] = image;

    return image
    
} 

function generateNegativeChunk(chunkX,chunkY){
    
    for(let x = 0; x <= chunkY; x++){
        let tmp1 = []
        for(let y = 0; y <= chunkX; y++){
            try{

    
                if(typeof map[x][y]){}
            }catch{
                tmp1.push(0)
            }
            try{


                if(chunkArray[x][y]){}
            }catch{
                tmp1.push(0)
            }
        }
        negativeMap.push(tmp1)
        negativechunkArray.push(tmp1)

    }

    
    var tmpMap2 = [];
    for(var z = 0; z < 5; z++){
        let tmpMap1 = []
        for(var y = 0; y < chunkSize; y++){
            let tmpMap = []
            for(var x = 0; x < chunkSize; x++){
                if(z == 0){

                    if(getPerlinNoise(x+(-chunkY)*chunkSize,y+(-chunkX)*chunkSize) > 50){
                        tmpMap.push(4);
                    }else{
                        tmpMap.push(0);
                    }
                }
                if(z == 1){
                    if(tmpMap2[z-1][y][x] != 4){
                        if(seedRandomizer(seed + (x + (-chunkX)*chunkSize)*10 + (y+ (-chunkY)*chunkSize)*100) < 0.03){
                            tmpMap.push(1);
                        }else if(seedRandomizer(seed + (x + (-chunkX)*chunkSize)*1000 + (y+ (-chunkY)*chunkSize)*10) < 0.01){
                            tmpMap.push(3);
                        }else if(seedRandomizer(seed + (x + (-chunkX)*chunkSize)*10000 + (y+ (-chunkY)*chunkSize)*1000) < 0.05){
                            tmpMap.push(0);
                        }else{
                            tmpMap.push(-1);
                        }
                    }else{
                        tmpMap.push(-1)
                    }
                }

            }
            tmpMap1.push(tmpMap);
        }
        tmpMap2.push(tmpMap1);
    }

    negativeMap[chunkY][chunkX] = tmpMap2;

    var preRenderCanvas = document.createElement("canvas");
    var preRenderCtx = preRenderCanvas.getContext("2d");
    
    preRenderCanvas.width = 1920/2;
    preRenderCanvas.height = 1080/2;

    for(var z = 0; z < 5; z++){
        for(var y = 0; y < chunkSize; y++){
            for(var x = 0; x < chunkSize; x++){
                if(negativeMap[chunkY][chunkX][z][y][x] >= 0){
                    preRenderCtx.drawImage(blocks,negativeMap[chunkY][chunkX][z][x][y]*20,0,20,20,to_screen_coordinate(x,y).x/5 + chunkSize*10 - 10,to_screen_coordinate(x,y+z*2).y/5-z*scale/5,20,20);
                }
            }
        }
    }


    image = convertCanvasToImage(preRenderCanvas);



    negativechunkArray[chunkY][chunkX] = image;

    return image
    
} 

function to_screen_coordinate(x,y){
    return {
        x: x*0.5*scale+y*-0.5*scale,
        y: x*0.25*scale+y*0.25*scale
    }
}

function invert_matrix(a, b, c, d) {
  // Determinant 
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
        first:{
            x: Math.floor(to_grid_coordinate(0+player.x*5,0+player.y*5).x/chunkSize),
            y: Math.floor(to_grid_coordinate(0+player.x*5,0+player.y*5).y/chunkSize)
        }
        ,second:{
            x: Math.floor(to_grid_coordinate(1920+player.x*5,1080+player.y*5).x/chunkSize),
            y: Math.floor(to_grid_coordinate(1920+player.x*5,1080+player.y*5).y/chunkSize)
        }
        ,third:{
            x: Math.floor(to_grid_coordinate(0+player.x*5,1080+player.y*5).x/chunkSize),
            y: Math.floor(to_grid_coordinate(0+player.x*5,1080+player.y*5).y/chunkSize)
        },
        fourth:{
            x: Math.floor(to_grid_coordinate(1920+player.x*5,0+player.y*5).x/chunkSize),
            y: Math.floor(to_grid_coordinate(1920+player.x*5,0+player.y*5).y/chunkSize)
        }
    }

    
    for(var x = listOfcoordinates.first.x; x <= listOfcoordinates.second.x; x++){
        for(var y = listOfcoordinates.first.y; y <= listOfcoordinates.second.y; y++){
            if(x >= 0 && y >= 0){
                try{
                    backCtx.drawImage(chunkArray[y][x],player.x + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).x + chunkSize*10,player.y + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).y,backCanvas.width/5,backCanvas.height/5,0,0,backCanvas.width,backCanvas.height);
                }catch{
                    
                    generateChunk(x,y)
                }
                
            }else{
                try{
                    backCtx.drawImage(negativechunkArray[makePositive(y)][makePositive(x)],player.x + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).x + chunkSize*10,player.y + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).y,backCanvas.width/5,backCanvas.height/5,0,0,backCanvas.width,backCanvas.height);
                }catch{
                    
                    generateNegativeChunk(makePositive(x),makePositive(y))
                }  
            }
        }
    }
    for(var x = listOfcoordinates.third.x-1; x <= listOfcoordinates.fourth.x+1; x++){
        for(var y = listOfcoordinates.third.y-1; y <= listOfcoordinates.fourth.y+1; y++){
            if(x >= 0 && y >= 0){
                try{

                    backCtx.drawImage(chunkArray[y][x],player.x + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).x + chunkSize*10,player.y + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).y,backCanvas.width/5,backCanvas.height/5,0,0,backCanvas.width,backCanvas.height);
                }catch{
                    generateChunk(x,y)                    
                
                }
            }else{
                try{
                    backCtx.drawImage(negativechunkArray[makePositive(y)][makePositive(x)],player.x + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).x + chunkSize*10,player.y + to_screen_coordinate(-x*chunkSize/5,-y*chunkSize/5).y,backCanvas.width/5,backCanvas.height/5,0,0,backCanvas.width,backCanvas.height);
                }catch{
                    generateNegativeChunk(makePositive(x),makePositive(y))                 
                
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

testCanvas.width = 1920;
testCanvas.height = 1080;

function getPerlinNoise(x,y){
    let perlinNoise = makePositive(parseInt(perlin.get(x/30, y/30,seed) * 255))
    if(perlinNoise < 0){
        perlinNoise = 0;
    }   

    
    //testCanvasCtx.fillStyle = "rgba("+perlinNoise+","+perlinNoise+","+perlinNoise+","+1+")";
    //testCanvasCtx.fillRect(-to_screen_coordinate(x,y).x/10 + 500,to_screen_coordinate(x,y).y/10 + 500,5,5);
    
    return perlinNoise

}
function seedRandomizer(mySeed){
    let newSeed = (Math.sin(mySeed) + 1)/2;
    return(newSeed);
}