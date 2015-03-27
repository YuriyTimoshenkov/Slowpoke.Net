function gameWorldManager(world) {
    this.world = world

    this.getCurrentFrame = function(){
        return { cells: this.world.gameMap.cells, objects: this.world.allGameObjects }
    }

    this.updateWorld = function () {
        console.log("Start Updating Objects")

        var frame = this.serverFramesQueue.shift()

        if (!frame)
            return

        var self = this;

        // Convert frame data to dict {obj_id: obj} and round Position coordinates
        var frameObjectsDict = (function () {
            var idsDict = {};
            frame.forEach(function (obj) {
                idsDict[obj.Id] = obj;

                obj.Shape.Position.X = Math.round(obj.Shape.Position.X)
                obj.Shape.Position.Y = Math.round(obj.Shape.Position.Y)

                obj.Direction.X = Math.round(obj.Direction.X);
                obj.Direction.Y = Math.round(obj.Direction.Y);
            });
            return idsDict;
        })();

        // Delete
        var deleteIDs = [];
        this.world.allGameObjects.forEach(function (obj) {
            if (!(obj.id in frameObjectsDict)) deleteIDs.push(obj)
        });

        deleteIDs.forEach(function (obj) {
            var i = self.world.allGameObjects.indexOf(obj);
            var deletedItems = self.world.allGameObjects.splice(i, 1);
        });

        // Create and update
        for (var objId in frameObjectsDict) {
            var objData = frameObjectsDict[objId];
            var filtered = this.world.allGameObjects.filter(function (obj) { return objId == obj.id });
            if (filtered.length > 0) this.updateObject(objData);
            else this.createObject(objData)
        }
    }

    this.updateObject = function (objData) {
        var objId = objData["Id"];
        var obj = this.world.allGameObjects.filter(function (obj) { return objId == obj.id })[0];


        if (obj.objectType == "PlayerBody") {
        }

        // Update position
        obj.gameRect.center = objData["Shape"]["Position"];

        // Update direction
        obj.direction = objData["Direction"];

    }

    this.createObject = function (objData) {
        this.world.createGameObject(objData);
    }

    this.init = function (playerId, queue) {
        this.serverFramesQueue = queue
        this.player = this.world.createGameObject({ "Id": playerId, "ActiveBodyType": "PlayerBody", "Direction": { X: 0, Y: 0 }, "Shape": { "Position": { X: 0, Y: 0 }, "Radius": 20 } })
    }
}