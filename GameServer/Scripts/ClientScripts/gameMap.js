/**
 * Created by dimapct on 17.02.2015.
 */

function Cell(xy, size, terrain) {
    this.X = xy[0];
    this.Y = xy[1];
    this.size = size;
    this.gameRect = new Rect(xy[0], xy[1], size, size)
    this.image = null;

    this.width = size;
    this.height = size;
    this.terrain = terrain || "meadow";

    this.assignImage = function () {
        var terrainID = terrainClass[this.terrain];
        var color = terrainClass.props[terrainID].color;
        var image = new createjs.Shape();
        image.graphics.beginFill(color).drawRect(0, 0, this.size, this.size);
        this.image = image;
    }

    this.assignImage();
}

Cell.prototype = {
    draw: function(context) {
        context.clearRect(this.canvasX, this.canvasY, this.width, this.height);
        var terrainID = terrainClass[this.terrain];
        context.fillStyle = terrainClass.props[terrainID].color;
        context.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    }
};


function GameMap(serverMap) {
    this.width = serverMap.Width;
    this.height = serverMap.Height;
    this.cellSize = serverMap.CellSize;
    this.tiles = serverMap.Tiles;
    var self = this

    this.cells = (function() {
        var cells = [];
        for (var y = 0; y < self.height; y++) {
            cells.push([]);
            var currentRow = cells[y];
            for (var x = 0; x < self.width; x++) {
                var gameX = x * self.cellSize;
                var gameY = y * self.cellSize;
                var cell = new Cell([gameX, gameY], self.cellSize, self.tiles[y][x].TerrainType);
                currentRow.push(cell)
            }
        }
        return cells})();
    this.create_terrain(self.tiles);
}

GameMap.prototype = {
    create_terrain: function(inputMap) {
        for (var y = 0; y < this.cells.length; y++) {
            var row = this.cells[y];
            for (var x = 0; x < row.length; x++) {
                var cell = row[x];
                cell.terrain = inputMap[y][x];
            }
        }
    }
};