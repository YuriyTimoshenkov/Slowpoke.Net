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
            && command.__proto__ === CommandMove.prototypes
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
        var syncSessionId = new Date().getTime();
        var serverCommands = [];

        frame.Bodies.forEach(function (serverBody) {
            switch (self.getServerBodyProcessingType(serverBody))
            {
                case bodyProcessingTypes.ServerSide:
                    {

                        self.syncServerSideBody(serverBody, syncSessionId);

                        break;
                    };
                case bodyProcessingTypes.ClientSide:
                    {
                        self.syncClientSideBody(serverBody, syncSessionId);

                        break;
                    }
                case bodyProcessingTypes.ClientSidePrediction:
                    {
                        serverCommands = serverCommands.concat(self.syncPredictiveBodies(serverBody));
                        self.player.syncSessionId = syncSessionId;
                     
                        self.player.serverSync(serverBody);
    
                        break;
                    }
            }
        });

        self.bodies = self.bodies.filter(function (body) {
            if (body.syncSessionId === syncSessionId || body.syncSessionId === undefined) {
                return true;
            }
            else {
                self.onObjectStateChanged(body, 'remove');
                return false;
            }
        });

        
        if (frame.Map)
            self.updateMap(frame.Map)
        
        return serverCommands;
    }

    this.update = function () {
        //Process commands
        while (self.commandQueue.length > 0) {
            var commandToProcess = self.commandQueue.shift();

            if (commandToProcess !== undefined) {
                commandToProcess.id = new Date().getTime();

                commandToProcess.process(self);

                self.commandQueueProcessed.push(commandToProcess);
            }
        }

        //Update predictive bodies
        self.bodies.filter(function (body) { return self.getBodyProcessingType(body) === bodyProcessingTypes.ClientSide })
            .forEach(function (body) {
                body.update()
            });
    }


    //Private
    this.syncPredictiveBodies = function (serverBody) {
        //Find first synced with server command
        var firstSyncedCommand = self.commandQueueProcessed.filter(function (item) {
            return item.id === serverBody.LastProcessedCommandId;
        })[0];

        //Remove all commands till synced one
        self.commandQueueProcessed = self.commandQueueProcessed.slice(
            self.commandQueueProcessed.indexOf(firstSyncedCommand) + 1,
            self.commandQueueProcessed.length
            );

        //Update body if needed
        if (firstSyncedCommand !== undefined && !firstSyncedCommand.compareState(serverBody)) {

            self.player.gameRect.centerx = serverBody.Shape.Position.X;
            self.player.gameRect.centery = serverBody.Shape.Position.Y;
            self.player.direction = new Vector(serverBody.Direction.x, serverBody.Direction.y).calculateUnitVector();

            //Recalculate applied commands
            self.commandQueueProcessed.forEach(function (item) {
                item.process(self);
            });

            console.log('[Sync server] Recalculation applied.');
            console.log('Player X diff mod: ' + (Math.abs(firstSyncedCommand.state.x - serverBody.Shape.Position.X)));
            console.log('Player Y diff mod: ' + (Math.abs(firstSyncedCommand.state.y - serverBody.Shape.Position.Y)));
        }

        //Prepeare command for server
        var resultNotYetSyncedItems = self.commandQueueProcessed.filter(function (item) {
            return item.syncedWithServer === false;
        });

        //Mark as sent
        resultNotYetSyncedItems.forEach(function (item) {
            item.syncedWithServer = true;
        });

        //Convert to DTO
        var result = resultNotYetSyncedItems.map(function (item) {
            return item.toServerCommand();
        });

        return result;
    }

    this.syncServerSideBody = function (serverBody, syncSessionId) {
        // Create and update
        var filtered = this.bodies.filter(function (body) { return serverBody.Id === body.Id });

        if (filtered.length > 0) {
            try
            {
                filtered[0].serverSync(serverBody);
            }
            catch (ex) {
                console.log("syncServerSideBody: " + ex)
            }
            filtered[0].syncSessionId = syncSessionId;

            self.onObjectStateChanged(filtered[0], 'update');
        }
        else {
            var newObject = self.gameObjectFactory.createGameObjectbyServerBody(serverBody)

            newObject.syncSessionId = syncSessionId;
            this.bodies.push(newObject);

            self.onObjectStateChanged(newObject, 'add');
        }
    }

    this.syncClientSideBody = function (serverBody, syncSessionId) {
        // Create and update
        var filtered = this.bodies.filter(function (body) {
            return serverBody.Id === body.Id
            || serverBody.CreatedByCommandId >= body.CreatedByCommandId
        });
        
        if (filtered.length === 0) {
            var newObject = self.gameObjectFactory.createGameObjectbyServerBody(serverBody)
            newObject.syncSessionId = syncSessionId;
            this.bodies.push(newObject);
            self.onObjectStateChanged(newObject, 'add');
        }
        else {
            filtered.forEach(function (item) {
                item.syncSessionId = syncSessionId;
            });
        }
    }



    this.updateMap = function (tiles) {
        self.mapEngine.update(tiles,
            function (cell) { self.onObjectStateChanged(cell, 'add'); return cell; },
            null,
            function (cell) { self.onObjectStateChanged(cell, 'remove') }
            );
    }

    this.onObjectStateChanged = function (object, state) { }

    this.getServerBodyProcessingType = function (serverBody) {
        if (serverBody.BodyType === 'Bullet') return bodyProcessingTypes.ClientSide;
        if (serverBody.Id === self.player.Id) return bodyProcessingTypes.ClientSidePrediction;
        
        return bodyProcessingTypes.ServerSide;
    }

    this.getBodyProcessingType = function (body) {
        return self.getServerBodyProcessingType(body.serverBody);
    }

    this.player = self.gameObjectFactory.createGameObject(gameTypes.gameObjects.PLAYER, player)
    this.bodies.push(this.player);
}
