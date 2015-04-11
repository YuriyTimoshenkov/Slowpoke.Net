/**
 * Created by dimapct on 17.02.2015.
 */

function Cell(xy, size, color) {
    this.X = xy[0];
    this.Y = xy[1];
    this.size = size;
    this.gameRect = new Rect(xy[0], xy[1], size, size)
    this.image = null;

    this.width = size;
    this.height = size;
    this.color = color;

    this.assignImage = function () {
        var image = new createjs.Shape();
        image.graphics.beginFill(this.color).drawRect(0, 0, this.size, this.size);
        this.image = image;
    }

    this.assignImage();
}

Cell.prototype = {
    draw: function(context) {
        context.clearRect(this.canvasX, this.canvasY, this.width, this.height);
        context.fillStyle = this.color
        context.fillRect(this.canvasX, this.canvasY, this.width, this.height);
    }
};


function GameMap(serverMap) {
    this.width = serverMap.Width;
    this.height = serverMap.Height;
    this.cellSize = serverMap.CellSize;
    this.cells = [];
    var self = this

    this.update = function(tiles) {
        self.cells = [];

        tiles.forEach(function (tile) {
            var gameX = tile.Position.X * self.cellSize;
            var gameY = tile.Position.Y * self.cellSize;

            var cell = new Cell([gameX, gameY], self.cellSize, tile.Color);
            
            self.cells.push(cell)
        })
    }
}
