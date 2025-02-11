class Grid{

    numRows;
    numCols;
    gridVertWalls;
    gridHorzWalls;
    gridCellSize;
    wallWidth;
    canvasOffsetX;
    canvasOffsetY;
    activeBullets;
    tanks;

    BULLET_SIZE = 5;
    BULLET_SPEED = 4;
    TANK_TRAVEL_SPD = 5;
    TANK_ROT_SPD = 5;

    constructor(numRows, numCols, gridCellSize, canvasOffsetX, canvasOffsetY){
        this.numRows = numRows;
        this.numCols = numCols;
        this.canvasOffsetX = canvasOffsetX;
        this.canvasOffsetY = canvasOffsetY;
        this.gridCellSize = gridCellSize;
        this.wallWidth = Math.ceil(gridCellSize/10); //wall width is grid cell width divided by 10
        this.wallWidth = 2*Math.ceil(this.wallWidth/2); //make wall width an even number
        this.activeBullets = []; //make activeBullets a list with no elements for now
        this.tanks = [];

        //create 2D arrays representing horizontal and vertical walls
        //set all walls to 0 meaning non-existent
        this.gridVertWalls = [];
        this.gridHorzWalls = [];

        for (let rowCount = 0; rowCount < this.numRows; rowCount++) {
            this.gridVertWalls[rowCount] = [];
            for (let colCount = 0; colCount <= this.numCols; colCount++) {
                this.gridVertWalls[rowCount][colCount] = 0;
            }
        }

        for (let rowCount = 0; rowCount <= this.numRows; rowCount++) {
            this.gridHorzWalls[rowCount] = [];
            for (let colCount = 0; colCount < this.numCols; colCount++) {
                this.gridHorzWalls[rowCount][colCount] = 0;
            }
        }

        this.generateMap();
        //create tank (note - the placement is currently fixed)
        this.tanks[0] = new Tank(150, 100, 90, 
            this.TANK_TRAVEL_SPD, this.TANK_ROT_SPD);
    }

    generateMap(){
        //at the moment, this only generates a manual map for a 6-by-10 grid
        if (this.numRows == 6 && this.numCols == 10) {
            this.gridVertWalls = [
                [1,1,0,0,0,0,0,1,0,0,1],
                [1,1,0,1,0,0,0,0,0,0,1],
                [1,0,0,1,0,0,1,0,0,1,1],
                [1,0,0,1,0,0,1,0,0,1,1],
                [1,1,0,1,0,0,0,0,0,1,1],
                [1,1,0,0,0,0,0,0,0,1,1]
            ];
            this.gridHorzWalls = [
                [1,1,1,1,1,1,1,1,1,1],
                [0,0,0,1,1,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,1,1,1,0,1,1,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1,1]
            ];
        }
    }

    drawMap(){
        fill(255, 255, 255);
        strokeWeight(0);
        rect(this.canvasOffsetX, this.canvasOffsetY, this.numCols*this.gridCellSize, this.numRows*this.gridCellSize);

        strokeWeight(this.wallWidth);
        for (let rowCount = 0; rowCount < this.numRows; rowCount++) {
            for (let colCount = 0; colCount <= this.numCols; colCount++) {
                if (this.gridVertWalls[rowCount][colCount] == 1){
                    let startX = this.canvasOffsetX + colCount*this.gridCellSize;
                    let startY = this.canvasOffsetY + rowCount*this.gridCellSize;
                    line(startX, startY, startX, startY + this.gridCellSize);
                }
            }
        }

        for (let rowCount = 0; rowCount <= this.numRows; rowCount++) {
            for (let colCount = 0; colCount < this.numCols; colCount++) {
                if (this.gridHorzWalls[rowCount][colCount] == 1){
                    let startX = this.canvasOffsetX + colCount*this.gridCellSize;
                    let startY = this.canvasOffsetY + rowCount*this.gridCellSize;
                    line(startX, startY, startX + this.gridCellSize, startY);
                }
            }
        }

        for (let count = 0; count < this.activeBullets.length; count++) {
            this.activeBullets[count].drawBullet();
        }
        for (let count = 0; count < this.tanks.length; count++){
            this.tanks[count].drawTank();
        }
    }

    updateState() {
        for (let count = 0; count < this.activeBullets.length; count++) {
            this.activeBullets[count].updateLocation();
            this.checkBulletWallCollision(this.activeBullets[count]);
        }

        for (let count = 0; count < this.tanks.length; count++){
            this.tanks[count].updatePosition();
            this.tanks[count].updatePolygonPoints();
            this.tanks[count].updateFirePoint();
            this.updateTankMobility(this.tanks[count]);
        }
    }

    updateTankMobility(tank) {
        //find out whether any vertices of the tank have hit a wall
        let ptCollisionStatus = [];
        for(let ptCnt = 0; ptCnt < tank.NU_POLY_PTS; ptCnt++){
            ptCollisionStatus[ptCnt] = this.checkPointWallCollision(tank.polygonPoints[ptCnt]);
        }
        let s = ptCollisionStatus;
        tank.canRotate = true;

        //if front vertices have hit a wall, stop it moving forwards
        if(s[0] || s[3] || s[4] || s[5]) {
            tank.canMoveForwards = false;
            //CURRENTLY THE TANK ROTATION IS DISABLED IF FRONT COLLIDES
            //SOMETHING TO IMPROVE UPON
            tank.canRotate = false;
        } else {
            tank.canMoveForwards = true;
        }

        //if back vertices have hit a wall, stop it moving backwards
        if(s[1] || s[2]) {
            tank.canMoveBackwards = false;
            //CURRENTLY THE TANK ROTATION IS DISABLED IF REAR COLLIDES
            //SOMETHING TO IMPROVE UPON
            tank.canRotate = false;
        } else {
            tank.canMoveBackwards = true;
        }
    }

    checkBulletWallCollision(bullet) {
        //get row and column within grid where bullet is
        let colNum = Math.floor((bullet.locX - this.canvasOffsetX)/this.gridCellSize);
        let rowNum = Math.floor((bullet.locY - this.canvasOffsetY)/this.gridCellSize);

        //get row and column of bullet at previous timestep
        let oldColNum = Math.floor((bullet.oldLocX - this.canvasOffsetX)/this.gridCellSize);
        let oldRowNum = Math.floor((bullet.oldLocY - this.canvasOffsetY)/this.gridCellSize);

        //determine whether bullet has changed cell
        let cellChanged = false;
        if (colNum != oldColNum || rowNum != oldRowNum) {
            cellChanged = true;
        }

        //get position of closest grid vertex to bullet
        let xVertex = Math.round((bullet.locX - this.canvasOffsetX)/this.gridCellSize);
        let yVertex = Math.round((bullet.locY - this.canvasOffsetY)/this.gridCellSize);

        //determine whether the closest grid vertex is an "exposed" wall end
        let wallExposed = this.checkVertexExposed(yVertex, xVertex);

        //check if there is a wall on the right
        if (this.gridVertWalls[rowNum][colNum + 1] == 1) {
            //check whether the bullet overlaps with the wall
            if (bullet.getMaxDimX() > this.minVertWall(colNum + 1)) {
                if (!cellChanged || !wallExposed) {
                    //reverse direction of travel perpendicular to wall
                    bullet.reverseHorizontalTravel();
                } else {
                    //otherwise you have hit the "end" of a wall
                    //to avoid funny bullet behaviour reverse direction
                    //and return from function
                    bullet.reverseVerticalTravel();
                    return;
                }
            }
        }

        if (this.gridVertWalls[rowNum][colNum] == 1) {
            if (bullet.getMinDimX() < this.maxVertWall(colNum)) {
                if (!cellChanged || !wallExposed) {
                    bullet.reverseHorizontalTravel();
                } else {
                    bullet.reverseVerticalTravel();
                    return;
                }
            }
        }

        if (this.gridHorzWalls[rowNum + 1][colNum] == 1) {
            if (bullet.getMaxDimY() > this.minHorWall(rowNum + 1)) {
                if (!cellChanged || !wallExposed) {
                    bullet.reverseVerticalTravel();
                } else {
                    bullet.reverseHorizontalTravel();
                    return;
                }
            }
        }

        if (this.gridHorzWalls[rowNum][colNum] == 1) {
            if (bullet.getMinDimY() < this.maxHorWall(rowNum)) {
                if (!cellChanged || !wallExposed) {
                    bullet.reverseVerticalTravel();
                } else {
                    bullet.reverseHorizontalTravel();
                    return;
                }
            }
        }
    }

    checkVertexExposed(rowNum, colNum) {
        //by definition vertices on the map boundary cannot be exposed
        if (rowNum == 0 || colNum == 0 || rowNum == this.numRows || colNum == this.numCols) {
            return false;
        }

        //count number of walls connecting to vertex
        let wallCount = 0;
        wallCount += this.gridVertWalls[rowNum][colNum];
        wallCount += this.gridVertWalls[rowNum - 1][colNum];
        wallCount += this.gridHorzWalls[rowNum][colNum];
        wallCount += this.gridHorzWalls[rowNum][colNum - 1];

        //return true if only one wall connects to vertex
        return wallCount == 1 ? true : false;
    }

    maxVertWall(colNum) {
        return this.canvasOffsetX + colNum*this.gridCellSize + this.wallWidth/2;
    }
    minVertWall(colNum) {
        return this.canvasOffsetX + colNum*this.gridCellSize - this.wallWidth/2;
    }
    maxHorWall(rowNum) {
        return this.canvasOffsetY + rowNum*this.gridCellSize + this.wallWidth/2;
    }
    minHorWall(rowNum) {
        return this.canvasOffsetY + rowNum*this.gridCellSize - this.wallWidth/2;
    }

    //returns true if the point intersects with a grid wall
    checkPointWallCollision(pointIn) {
        //get row and column within grid where point is
        let colNum = Math.floor((pointIn.x - this.canvasOffsetX)/this.gridCellSize);
        let rowNum = Math.floor((pointIn.y - this.canvasOffsetY)/this.gridCellSize);

        //FIXING A BUG - PLEASE SOLVE THE BUG AND DELETE THIS
        rowNum = rowNum >= this.numRows ? this.numRows - 1 : rowNum;
        rowNum = rowNum < 0 ? 0 : rowNum;

        //check if there is a wall on the right
        if (this.gridVertWalls[rowNum][colNum + 1] == 1) {
            //check whether the point lies within the wall
            if (pointIn.x > this.minVertWall(colNum + 1)) {
                return true;
            }
        }

        if (this.gridVertWalls[rowNum][colNum] == 1) {
            if (pointIn.x < this.maxVertWall(colNum)) {
                return true;
            }
        }

        if (this.gridHorzWalls[rowNum + 1][colNum] == 1) {
            if (pointIn.y > this.minHorWall(rowNum + 1)) {
                return true;
            }
        }

        if (this.gridHorzWalls[rowNum][colNum] == 1) {
            if (pointIn.y < this.maxHorWall(rowNum)) {
                return true;
            }
        }

        return false;
    }

    //creates new bullet and fires from tank
    fireBullet(tank) {
        let newBullet = new Bullet(tank.firePoint.x, tank.firePoint.y, 
            this.BULLET_SIZE, tank.travelDirection, this.BULLET_SPEED);
        this.activeBullets.push(newBullet);
    }
}