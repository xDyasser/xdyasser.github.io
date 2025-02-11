//global declaration of Grid object
let gameMap;
//spacebar is keycode 32
let SPACEBAR_CODE = 32;

function setup() {
    createCanvas(640, 480);
    gameMap = new Grid(6, 10, 50, 50, 50);
}

function draw() {
    background(150, 150, 150);
    gameMap.drawMap();
    gameMap.updateState();
}

//detect if spacebar is pressed to fire bullet of tank
function keyPressed() {
    if (keyCode === SPACEBAR_CODE) {
        gameMap.fireBullet(gameMap.tanks[0]);
    }
}