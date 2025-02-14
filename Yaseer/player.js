let player1;
let player2;


class Player extends Tanks {
  
  constructor(name) {
    super();
    this.name = name;
    setBullets();
  }
  
  collision() {
    if(bullets != undefined) if(this.tank.collides(bullets))  this.destroy();
  }
}