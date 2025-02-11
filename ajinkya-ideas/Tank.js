class Tank {

    locX;
    locY;
    travelDirection;
    travelSpeed;
    rotationSpeed;
    polygonPoints;
    canMoveForwards;
    canMoveBackwards;
    canRotate;
    firePoint;

    TANK_WIDTH = 22;
    TANK_HT = 30;
    TURRET_RAD = 20;
    GUN_LENGTH = 18;
    GUN_WIDTH = 7;
    NU_POLY_PTS = 6;
    FIRE_PT_POSN = 2;

    //travelDirection is the angle of tank in degrees measured
    //anticlockwise from horizontal
    constructor(locX, locY, travelDirection, travelSpeed, rotationSpeed) {
        this.locX = locX;
        this.locY = locY;
        this.travelSpeed = travelSpeed;
        this.rotationSpeed = rotationSpeed;
        //convert travelDirection to radians
        this.travelDirection = (Math.PI/180)*travelDirection;
        this.canMoveForwards = true;
        this.canMoveBackwards = true;
        this.canRotate = true;

        //create an array of vector points for the tank corners
        this.polygonPoints = [];
        for(let count = 0; count < this.NU_POLY_PTS; count++){
            this.polygonPoints[count] = createVector(0, 0);
        }
        //set the polygon points to their initial values
        this.updatePolygonPoints();

        //create a point from which bullets fired by tank will spwan
        this.firePoint = createVector(0, 0);
        this.updateFirePoint();
    }

    drawTank() {
        push();
        translate(this.locX, this.locY);
        rotate(Math.PI/2 - this.travelDirection);
        strokeWeight(0);
        rectMode(CENTER);
        fill(100, 100, 100);
        rect(0, 0, this.TANK_WIDTH, this.TANK_HT);
        fill(50, 50, 50);
        ellipse(0, 0, this.TURRET_RAD, this.TURRET_RAD);
        rect(0, - this.TURRET_RAD/2, this.GUN_WIDTH, this.GUN_LENGTH);
        rectMode(CORNER);
        pop();
    }

    updatePosition() {
        //rotate tank 
        if (keyIsDown(LEFT_ARROW) && this.canRotate) {
            this.travelDirection += this.rotationSpeed*(Math.PI/180);
        } else if (keyIsDown(RIGHT_ARROW) && this.canRotate) {
            this.travelDirection -= this.rotationSpeed*(Math.PI/180);
        } 
        
        //move tank forwards and backwards
        if (keyIsDown(UP_ARROW) && this.canMoveForwards) {
            this.locX += this.travelSpeed*Math.cos(this.travelDirection);
            this.locY -= this.travelSpeed*Math.sin(this.travelDirection);
        } else if (keyIsDown(DOWN_ARROW) && this.canMoveBackwards){
            this.locX -= this.travelSpeed*Math.cos(this.travelDirection);
            this.locY += this.travelSpeed*Math.sin(this.travelDirection);
        }
    }

    updatePolygonPoints() {
        //define vectors for tank x-axis and y-axis
        let tankYDir = createVector(Math.cos(this.travelDirection), - Math.sin(this.travelDirection));
        let tankXDir = createVector(Math.cos(this.travelDirection - Math.PI/2), - Math.sin(this.travelDirection - Math.PI/2));

        //vector for tank center
        let tankOrigin = createVector(this.locX, this.locY);

        //set all tank points to the center
        for(let count = 0; count < this.NU_POLY_PTS; count++){
            this.polygonPoints[count].set(tankOrigin);
        }

        //calculate four tank corner points
        this.polygonPoints[0] = this.polygonPoints[0].add(tankXDir.copy().mult(this.TANK_WIDTH/2));
        this.polygonPoints[0] = this.polygonPoints[0].add(tankYDir.copy().mult(this.TANK_HT/2));
        this.polygonPoints[1] = this.polygonPoints[1].add(tankXDir.copy().mult(this.TANK_WIDTH/2));
        this.polygonPoints[1] = this.polygonPoints[1].sub(tankYDir.copy().mult(this.TANK_HT/2));
        this.polygonPoints[2] = this.polygonPoints[2].sub(tankXDir.copy().mult(this.TANK_WIDTH/2));
        this.polygonPoints[2] = this.polygonPoints[2].sub(tankYDir.copy().mult(this.TANK_HT/2));
        this.polygonPoints[3] = this.polygonPoints[3].sub(tankXDir.copy().mult(this.TANK_WIDTH/2));
        this.polygonPoints[3] = this.polygonPoints[3].add(tankYDir.copy().mult(this.TANK_HT/2));

        //calculate gun extension points
        this.polygonPoints[4] = this.polygonPoints[4].add(tankXDir.copy().mult(this.GUN_WIDTH/2));
        this.polygonPoints[4] = this.polygonPoints[4].add(tankYDir.copy().mult((this.GUN_LENGTH + this.TURRET_RAD)/2));
        this.polygonPoints[5] = this.polygonPoints[5].sub(tankXDir.copy().mult(this.GUN_WIDTH/2));
        this.polygonPoints[5] = this.polygonPoints[5].add(tankYDir.copy().mult((this.GUN_LENGTH + this.TURRET_RAD)/2));
    }

    updateFirePoint() {
        //define vector for tank y-axis
        let tankYDir = createVector(Math.cos(this.travelDirection), - Math.sin(this.travelDirection));

        //vector for tank center
        let tankOrigin = createVector(this.locX, this.locY);

        //set firePoint a number of pixels in front of tank
        //defined by the FIRE_PT_POSN variable
        this.firePoint.set(tankOrigin);
        let frontOfTank = (this.GUN_LENGTH + this.TURRET_RAD)/2;
        this.firePoint = this.firePoint.add(tankYDir.copy().mult(frontOfTank + this.FIRE_PT_POSN));
    }
}