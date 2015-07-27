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
                tile.Shape.Radius = self.tileSize;
                var newTile = new Tile(
                    {
                        Id: tile.Id,
                        BodyType: tile.BodyType,
                        LastProcessedCommandId: tile.LastProcessedCommandId,
                        CreatedByCommandId: tile.CreatedByCommandId,
                        Shape: tile.Shape,
                        Name: tile.Name
                    }
                    );

                //generate add tile event
                self.mechanicEngine.onBodyAdd.trigger(newTile);

                //self.mechanicEngine.passiveBodies.push(newTile);

                return newTile;
            },
            function (body: Body) {
                //self.mechanicEngine.onBodyChanged.forEach(function (item) {
                //    item(body, BodyChangesType.direction);
                //});
            },
            function (body: Body) {
                //Remove passive body
                //self.mechanicEngine.passiveBodies = self.mechanicEngine.passiveBodies.filter(function (item)
                //{
                //    if (item.id != body.id) {
                //        return true;
                //    }
                //});

                //Generate event
                if (self.mechanicEngine.onBodyRemove != undefined)
                    self.mechanicEngine.onBodyRemove.trigger(body);
            });
    }
} 