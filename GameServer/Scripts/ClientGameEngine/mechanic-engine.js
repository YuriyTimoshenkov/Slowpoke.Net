function MechanicEngine(gameWorldManager)
{
    var self = this;

    this.gameWorldManager = gameWorldManager;
    this.commandQueue = [];
    this.commandQueueProcessed = [];

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

    this.update = function () {
        var commandToProcess = self.commandQueue.shift();

        if (commandToProcess !== undefined) {
            commandToProcess.process(self);

            commandToProcess.id = new Date().getTime();

            self.commandQueueProcessed.push(commandToProcess);
        }
    }

    this.syncWithServer = function (frame) {
        var result = [];
        var playerFromFrame = frame.Bodies.filter(function (item) { return item.Id === self.gameWorldManager.player.id })[0];

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

                self.gameWorldManager.player.gameRect.centerx = playerFromFrame.Shape.Position.X;
                self.gameWorldManager.player.gameRect.centery = playerFromFrame.Shape.Position.Y;

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
}

function CommandMove(bodyId, duration, direction) {
    var self = this;
    this.duration = duration;
    this.bodyId = bodyId;
    this.direction = new Vector(direction.x, direction.y);
    this.unitDirection = self.direction.calculateUnitVector();
    this.syncedWithServer = false

    this.process = function (mechanicEngine) {

        var bodies= mechanicEngine.gameWorldManager.world.allGameObjects.filter(function (item) {
            return item.id === self.bodyId;
        });

        if (bodies !== undefined && bodies.length > 0) {
            var body = bodies[0];

            body.gameRect.center = {
                X: body.gameRect.centerx + body.speed * self.duration * self.unitDirection.x / 1000,
                Y: body.gameRect.centery + body.speed * self.duration * self.unitDirection.y / 1000
            };

            //save state
            self.state = {
                x: body.gameRect.centerx,
                y: body.gameRect.centery,
            };

            console.log('Key duration:' + self.duration);
        }
    }

    this.toServerCommand = function () {
        return {
            Name: "Move",
            Id: self.id,
            Data: [
                ["X", self.direction.x],
                ["Y", self.direction.y ],
                ["Duration", self.duration ]]
        }
    };

    this.compareState = function (body) {
        return body.Shape.Position.X === self.state.x
        && body.Shape.Position.Y === self.state.y
    }
}