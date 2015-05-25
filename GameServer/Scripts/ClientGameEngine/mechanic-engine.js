function MechanicEngine(player, serverMap)
{
    var self = this;

    this.gameObjectFactory = new GameObjectFactory();
    this.mapEngine = new GameMap(serverMap, this.gameObjectFactory);
    this.commandQueue = [];
    this.commandQueueProcessed = [];
    this.bodies = [];

    //Public
    this.addCommand = function (command) {

        //Try tp merge duplication commands 
        if (self.commandQueue.length > 0
            && self.commandQueue[self.commandQueue.length - 1].direction.x === command.direction.x
            && self.commandQueue[self.commandQueue.length - 1].direction.y === command.direction.y
            && self.commandQueue[self.commandQueue.length - 1].syncedWithServer === false) {

            self.commandQueue[self.commandQueue.length - 1] += command.duration;
        }
        else {
            self.commandQueue.push(command);
        }
    }

    this.syncServerFrames = function (frame) {

        self.updateActiveBodies(frame.Bodies);

        if (frame.Map)
            self.updateMap(frame.Map)

        return self.syncPredictiveBodies(frame);
    }

    this.update = function () {
        //Process commands
        var commandToProcess = self.commandQueue.shift();

        if (commandToProcess !== undefined) {
            commandToProcess.process(self);

            commandToProcess.id = new Date().getTime();

            self.commandQueueProcessed.push(commandToProcess);
        }

        //Update predictive bodies
    }


    //Private
    this.syncPredictiveBodies = function(frame){
        var result = [];
        var playerFromFrame = frame.Bodies.filter(function (item) { return item.Id === self.player.id })[0];

        if (playerFromFrame !== undefined) {
            //Find first synced with server command
            var firstSyncedCommand = self.commandQueueProcessed.filter(function (item) {
                return item.id === playerFromFrame.LastProcessedCommandId;
            })[0];

            //Remove all commands till synced one
            self.commandQueueProcessed = self.commandQueueProcessed.slice(
                self.commandQueueProcessed.indexOf(firstSyncedCommand) + 1,
                self.commandQueueProcessed.length
                );

            //Update body if needed
            if (firstSyncedCommand !== undefined && !firstSyncedCommand.compareState(playerFromFrame)) {

                self.player.gameRect.centerx = playerFromFrame.Shape.Position.X;
                self.player.gameRect.centery = playerFromFrame.Shape.Position.Y;

                //Recalculate applied commands
                self.commandQueueProcessed.forEach(function (item) {
                    item.process(self);
                });

                console.log('[Sync server] Recalculation applied.');
                console.log('Player X diff mod: ' + (Math.abs(firstSyncedCommand.state.x - playerFromFrame.Shape.Position.X)));
                console.log('Player Y diff mod: ' + (Math.abs(firstSyncedCommand.state.y - playerFromFrame.Shape.Position.Y)));
            }

            //Prepeare command for server
            var resultNotYetsyncedItems = self.commandQueueProcessed.filter(function (item) {
                return item.syncedWithServer === false;
            });
            
            //Mark as sent
            resultNotYetsyncedItems.forEach(function (item) {
                item.syncedWithServer = true;
            });
            
            //Convert to DTO
            var result = resultNotYetsyncedItems.map(function (item) {
                return item.toServerCommand();
            });

            return result;
        }
        else
        {
            console.log('[Sync server] Player body not found');
        }

        return result;
    }

    this.updateMap = function (tiles) {
        self.mapEngine.cells.forEach(function (cell) {
            self.onObjectStateChanged(cell, 'remove');
        });
        self.mapEngine.update(tiles)

        self.mapEngine.cells.forEach(function (cell) {
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
        this.bodies.forEach(function (obj) {
            if (!(obj.id in frameObjectsDict)) deleteIDs.push(obj)
        });

        deleteIDs.forEach(function (obj) {
            // KOSTIL for the game restart
            if (!(obj.objectType === "PlayerBody")) {
                var i = self.bodies.indexOf(obj);
                var deletedItems = self.bodies.splice(i, 1);
                self.onObjectStateChanged(obj, 'remove');
            }
        });

        // Create and update
        for (var objId in frameObjectsDict) {
            var objData = frameObjectsDict[objId];
            var filtered = this.bodies.filter(function (obj) { return objId == obj.id });
            if (filtered.length > 0) {
                filtered[0].updateObject(objData, self.player);
                self.onObjectStateChanged(objData, 'update');
            }
            else {
                var newObject = self.gameObjectFactory.createGameObjectbyServerBody(objData)
                this.bodies.push(newObject);
                self.onObjectStateChanged(newObject, 'add');
            }
        }
    }

   

    this.onObjectStateChanged = function (object, state) { }

    this.player = self.gameObjectFactory.createGameObject(gameTypes.gameObjects.PLAYER, player)
    this.bodies.push(this.player);
}

