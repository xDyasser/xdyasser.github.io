let tiles;
let tileSize = 24;
let cols = map1[0].length;
let  rows = map1.length;


function setMap() {
  for(let row = 0; row < rows; row++){
    for(let col = 0; col < cols; col++){
      if(map1[row][col] === 1){
        let tile = new tiles.Sprite(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, tileSize, tileSize);
        tile.color = 'gray';
        tile.collider = 'static';
        tile.stroke = 'gray';
      }
    }
  }
}