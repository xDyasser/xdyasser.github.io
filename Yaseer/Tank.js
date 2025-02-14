

class Tanks {
  constructor(){

    this.tank = new Sprite(random(24, width-24), random(24, 480-24));
    this.tank.image = "./tank.png";
    this.tank.image.scale = 0.055;
    this.tank.rotationLock = true;
    this.tank.h = this.tank.h * 0.5;
    this.bullets = 5;
  }
  
  controller1() {
    if(kb.pressing(RIGHT_ARROW)){
      if (this.tank.speed === 0) this.tank.rotation += 1;
      else this.tank.rotation +=2;
    }
    if(kb.pressing(LEFT_ARROW)){
      if (this.tank.speed === 0) this.tank.rotation -= 1;
      else this.tank.rotation -=2;
    }
    if(kb.pressing(UP_ARROW)){
      this.tank.direction = this.tank.rotation;
      this.tank.speed = 1;
    }
    else if(kb.pressing(DOWN_ARROW)){
      this.tank.direction = this.tank.rotation;
      this.tank.speed = -0.5;
    }
    else {
      this.tank.speed = 0;
    }
    if(kb.presses("space") && !this.tank.removed){
      if(this.bullets > 0) {
        this.shoot();
        this.bullets -= 1;
      }
    }
  }
  
  controller2() {
    if(kb.pressing('d')){
      if (this.tank.speed === 0) this.tank.rotation += 1;
      else this.tank.rotation +=2;
    }
    if(kb.pressing('a')){
      if (this.tank.speed === 0) this.tank.rotation -= 1;
      else this.tank.rotation -=2;
    }
    if(kb.pressing('w')){
      this.tank.direction = this.tank.rotation;
      this.tank.speed = 1;
    }
    else if(kb.pressing('s')){
      this.tank.direction = this.tank.rotation;
      this.tank.speed = -0.5;
    }
    else {
      this.tank.speed = 0;
    }
    if(kb.presses('q') && !this.tank.removed){
      if(this.bullets > 0) {
        this.shoot();
        this.bullets -= 1;
      }
    }
  }
  shoot(){
    return new Bullet(this.tank);
  }
  
  destroy() {
    this.tank.remove();
  }
}