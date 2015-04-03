function gameWorldManager(world) {
    this.world = world

    this.getCurrentFrame = function(){
        return { cells: this.world.gameMap.cells, objects: this.world.allGameObjects }
    }

    this.updateWorld = function () {
        var frame = this.serverFramesQueue.shift()

        if (!frame)
            return

        var self = this;

        // Convert frame data to dict {obj_id: obj} and round Position coordinates
        var frameObjectsDict = (function () {
            var idsDict = {};
            frame.forEach(function (obj) {
                idsDict[obj.Id] = obj;
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

        // Update position
        obj.gameRect.center = objData["Shape"]["Position"];

        // Update direction
        var newDirection = objData["Direction"];
        if (obj.direction.X !== newDirection.X || obj.direction.Y !== newDirection.Y) {
            obj.direction = newDirection;
            obj.updateWeapon();
        }

        // Update weapon
        var currentWeapon = objData["CurrentWeapon"];
        if (obj.currentWeapon !== currentWeapon) {
            obj.currentWeapon = currentWeapon;
        }

        // Update life
        var newLife = objData["Life"];
        if (obj.life !== newLife && obj.lifeText){
            obj.updateLife(newLife);
        }
    }

    this.createObject = function (objData) {
        this.world.createGameObject(objData);
    }

    this.init = function (player, queue) {
        this.serverFramesQueue = queue;
        //Game.getFrameFromServer();
        //this.player = this.world.createGameObject({ "Id": playerId, "ActiveBodyType": "PlayerBody", "LifeMax": 123, "Life": 123, "Direction": { X: 0, Y: 0 }, "Shape": { "Position": { X: 0, Y: 0 }, "Radius": 20 } })
        this.player = this.world.createGameObject(player)
    }
}