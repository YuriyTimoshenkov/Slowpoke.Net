function gameWorldManager(world) {
    this.world = world
    var self = this;


    this.init = function (player, queue) {
        this.serverFramesQueue = queue;

        this.player = this.world.createGameObject(player)
        self.onObjectStateChanged(this.player, 'add');
    }

    this.updateWorld = function () {
        var frame = this.serverFramesQueue.shift()
        var self = this;

        if (!frame)
            return

        if (frame.Map)
            self.updateMap(frame.Map)

        self.updateActiveBodies(frame.Bodies);
    }

    this.getCurrentFrame = function(){
        return { cells: this.world.gameMap.cells, objects: this.world.allGameObjects }
    }

    this.updateMap = function (tiles) {
        self.world.gameMap.cells.forEach(function (cell) {
            self.onObjectStateChanged(cell, 'remove');
        });
        self.world.gameMap.update(tiles)

        self.world.gameMap.cells.forEach(function (cell) {
            self.onObjectStateChanged(cell, 'add');
        });
    }

    this.updateActiveBodies = function (bodyList) {
        // Convert frame data to dict {obj_id: obj} and round Position coordinates
        var frameObjectsDict = (function () {
            var idsDict = {};
            bodyList.forEach(function (obj) {
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
            // KOSTIL for the game restart
            if (!(obj.objectType === "PlayerBody")) {
                var i = self.world.allGameObjects.indexOf(obj);
                var deletedItems = self.world.allGameObjects.splice(i, 1);
                self.onObjectStateChanged(obj, 'remove');
            }
        });

        // Create and update
        for (var objId in frameObjectsDict) {
            var objData = frameObjectsDict[objId];
                var filtered = this.world.allGameObjects.filter(function (obj) { return objId == obj.id });
                if (filtered.length > 0) {
                    this.updateObject(objData);
                    self.onObjectStateChanged(objData, 'update');
                }
                else {
                    var newObject = this.createObject(objData)
                    self.onObjectStateChanged(newObject, 'add');
                }
        }
    }

    this.updateObject = function (objData) {
        var objId = objData["Id"];
        var obj = this.world.allGameObjects.filter(function (obj) { return objId == obj.id })[0];

        // Update position
        if (obj.id !== self.player.id)
            obj.gameRect.center = objData["Shape"]["Position"];

        if (obj.objectType === "NPCAI" || obj.objectType === "PlayerBody" || obj.objectType === "Bullet") {
            // Update direction
            var newDirection = objData["Direction"];

            if (obj.direction.X !== newDirection.X || obj.direction.Y !== newDirection.Y) {
                obj.updateDirection(newDirection);
                }
            

            // Update weapon
            var currentWeapon = objData["CurrentWeapon"];
            if (currentWeapon != 'undefined' && obj.currentWeapon !== currentWeapon) {
                obj.currentWeapon = currentWeapon;
            }

            // Update life
            var newLife = objData["Life"];
            if (obj.life !== newLife) {
                obj.updateLife(newLife);
            }

            // Update score
            var newScore = objData["Score"];
            if (newScore) {
                obj.score = newScore;
            }
        }
    }

    this.createObject = function (objData) {
        return this.world.createGameObject(objData);
    }

    this.onObjectStateChanged = function (object, state) { }
}