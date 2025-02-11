class Bullet {

    locX;
    locY;
    radius;
    incX;
    incY; 
    travelSpeed;
    oldLocX;
    oldLocY;

    //travelDirection is the angle of bullet travel in radians measured
    //anticlockwise from horizontal
    constructor(locX, locY, radius, travelDirection, travelSpeed) {
        this.locX = locX;
        this.locY = locY;
        this.radius = radius;
        this.incX = travelSpeed*Math.cos(travelDirection);
        this.incY = - travelSpeed*Math.sin(travelDirection);
        this.travelSpeed = travelSpeed;
    }

    drawBullet() {
        strokeWeight(0);
        fill(0, 0, 0);
        ellipse(this.locX, this.locY, 2*this.radius, 2*this.radius);
    }

    updateLocation() {
        this.oldLocX = this.locX;
        this.oldLocY = this.locY;
        this.locX = this.locX + this.incX;
        this.locY = this.locY + this.incY;
    }

    reverseVerticalTravel() {
        this.incY = -this.incY;
    }

    reverseHorizontalTravel() {
        this.incX = -this.incX;
    }

    getMaxDimX() {
        return this.locX + this.radius;
    }
    getMinDimX() {
        return this.locX - this.radius;
    }
    getMaxDimY() {
        return this.locY + this.radius;
    }
    getMinDimY() {
        return this.locY - this.radius;
    }
}