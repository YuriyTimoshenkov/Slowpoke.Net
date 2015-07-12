interface ServerMap {
    Width: number;
    Height: number;
    CellSize: number;
}

class MapEngine {
    width: number;
    height: number;
    tileSize: number;
    tiles: Tile[];
    mechanicEngine: MechanicEngineTS;
    serverSynchronizer: ObjectsContainersSynchronizerTS<Tile, ServerTile>;

    constructor(serverMap: ServerMap, mechanicEngine: MechanicEngineTS) {
        this.height = serverMap.Height;
        this.width = serverMap.Width;
        this.tileSize = serverMap.CellSize;
        this.mechanicEngine = mechanicEngine;
        this.tiles = [];
        this.serverSynchronizer = new ObjectsContainersSynchronizerTS<Tile, ServerTile>();
    }

    update(tiles: ServerTile[]) {
        var self = this;
        this.tiles = this.serverSynchronizer.syncObjectsContainersTS(this.tiles, tiles,
            function (tile: ServerTile) {
                var newTile = new Tile(
                    tile.Id,
                    new Point(tile.Shape.Position.X, tile.Shape.Position.Y),
                    self.tileSize,
                    tile.BodyType);

                //generate add tile event
                self.mechanicEngine.onBodyAdd.forEach(function (item) {
                    item(newTile);
                });

                self.mechanicEngine.passiveBodies.push(newTile);

                return newTile;
            },
            function (body: Body) {
                //self.mechanicEngine.onBodyChanged.forEach(function (item) {
                //    item(body, BodyChangesType.direction);
                //});
            },
            function (body: Body) {
                //Remove passive body
                self.mechanicEngine.passiveBodies = self.mechanicEngine.passiveBodies.filter(function (item)
                {
                    if (item.id != body.id) {
                        return true;
                    }
                });

                //Generate event
                if (self.mechanicEngine.onBodyRemove != undefined)
                    self.mechanicEngine.onBodyRemove.forEach(function (item) {
                        item(body);
                    });
            });
    }
} 