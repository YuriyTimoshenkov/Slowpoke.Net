interface ServerMap {
    Width: number;
    Height: number;
    CellSize: number;
}

class MapEngine {
    width: number;
    height: number;
    MapTileSize: number;
    MapTiles: MapTile[];
    mechanicEngine: MechanicEngineTS;
    serverSynchronizer: ObjectsContainersSynchronizerTS<MapTile, MapTile>;

    constructor(serverMap: ServerMap, mechanicEngine: MechanicEngineTS) {
        this.height = serverMap.Height;
        this.width = serverMap.Width;
        this.MapTileSize = serverMap.CellSize;
        this.mechanicEngine = mechanicEngine;
        this.MapTiles = [];
        this.serverSynchronizer = new ObjectsContainersSynchronizerTS<MapTile, MapTile>();
    }

    update(MapTiles: MapTile[]) {
        var self = this;
        this.MapTiles = this.serverSynchronizer.syncObjectsContainersTS(this.MapTiles, MapTiles,
            function (MapTile: MapTile) {
                //generate add MapTile event
                self.mechanicEngine.onBodyAdd.trigger(MapTile);

                //self.mechanicEngine.passiveBodies.push(newMapTile);

                return MapTile;
            },
            function (body: Body) {
                //self.mechanicEngine.onBodyChanged.forEach(function (item) {
                //    item(body, BodyChangesType.Direction);
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