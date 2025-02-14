let bullets;

function setBullets() {
  bullets = new Group();
  bullets.diameter = 6;
  bullets.color = 'gray';
  bullets.speed = 5;
  bullets.bounciness = 1;
  bullets.friction = 0;
}

class Bullet {
  constructor(tank){
    this.bullet = new bullets.Sprite(tank.x + cos(tank.rotation)*30, tank.y + sin(tank.rotation)*30);
    this.bullet.direction = tank.rotation;
    
  }
}