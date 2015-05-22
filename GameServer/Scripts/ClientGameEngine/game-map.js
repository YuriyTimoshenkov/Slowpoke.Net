/**
 * Created by dimapct on 17.02.2015.
 */

function GameMap(serverMap, gameObjectFactory) {
    this.width = serverMap.Width;
    this.height = serverMap.Height;
    this.cellSize = serverMap.CellSize;
    this.cells = [];
    this.mapCellFactory = new MapCellFactory(this.cellSize, gameObjectFactory);
    var self = this

    this.update = function(tiles) {
        self.cells = [];
        tiles.forEach(function (tile) {
            var mapCellType;
            switch (tile.TileTypeName) {
                case "meadow": mapCellType = gameTypes.tiles.MEADOW;
                case "water": mapCellType = gameTypes.tiles.WATER;
                case "rock": mapCellType = gameTypes.tiles.ROCK;
                case "road": mapCellType = gameTypes.tiles.ROAD;
                case "ford": mapCellType = gameTypes.tiles.FORD;
                case "tree": mapCellType = gameTypes.tiles.TREE;
            }
            tile["CellSize"] = self.cellSize;
            var cell = self.mapCellFactory.createMapCell(mapCellType, tile);
            self.cells.push(cell)
        })
    }
}
