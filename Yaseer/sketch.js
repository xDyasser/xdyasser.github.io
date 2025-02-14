function setup() {
  new Canvas(960, 640);
  tiles = new Group();
  setMap();
  player1 = new Player("Player 1");
  player2 = new Player("Player 2");
  
}

function draw() {
  background(40);
  player1.controller1();
  player1.collision();
  player2.controller2();
  player2.collision();  
}