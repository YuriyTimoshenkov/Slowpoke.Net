/**
 * Created by dimapct on 17.02.2015.
 */

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

            var cell = new MapCell([gameX, gameY], self.cellSize, tile.Color);
            
            self.cells.push(cell)
        })
    }
}