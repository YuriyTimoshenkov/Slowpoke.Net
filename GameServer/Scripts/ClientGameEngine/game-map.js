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
            console.log(' tile id = ' + tile.Id);
            var mapCellType;
            switch (tile.TileTypeName) {
                case "meadow": mapCellType = gameTypes.tiles.MEADOW; break;
                case "water": mapCellType = gameTypes.tiles.WATER; break;
                case "rock": mapCellType = gameTypes.tiles.ROCK; break;
                case "road": mapCellType = gameTypes.tiles.ROAD; break;
                case "ford": mapCellType = gameTypes.tiles.FORD; break;
                case "tree": mapCellType = gameTypes.tiles.TREE; break;
            }
            var cell = self.mapCellFactory.createMapCell(mapCellType, tile);
            self.cells.push(cell)
        })
    }
}
