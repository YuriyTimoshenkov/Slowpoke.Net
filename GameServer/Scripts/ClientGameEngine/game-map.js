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

    this.update = function (tiles) {
        console.log("GameMap update")
        ObjectsContainersSynchronizer.syncObjectsContainers(self.cells, tiles, self.createHandler, self.updateHandler)
    }

    this.createHandler = function (tileData) {
        var mapCellType;
        switch (tileData.TileTypeName) {
            case "meadow": mapCellType = gameTypes.tiles.MEADOW; break;
            case "water": mapCellType = gameTypes.tiles.WATER; break;
            case "rock": mapCellType = gameTypes.tiles.ROCK; break;
            case "road": mapCellType = gameTypes.tiles.ROAD; break;
            case "ford": mapCellType = gameTypes.tiles.FORD; break;
            case "tree": mapCellType = gameTypes.tiles.TREE; break;
        }
        var cell = self.mapCellFactory.createMapCell(mapCellType, tileData);
        self.cells.push(cell)
    }

    this.updateHandler = function (tile, tileData) {

    }
}
