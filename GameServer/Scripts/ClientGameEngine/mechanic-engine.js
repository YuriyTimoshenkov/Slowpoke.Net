function MechanicEngine(gameWorldManager)
{
    var self = this;

    this.gameWorldManager = gameWorldManager;
    this.commandQueue = [];
    this.commandQueueProcessed = [];

    this.addCommand = function (command) {
        self.commandQueue.push(command);
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
        var currentPlayer = frame.Bodies.filter(function (item) { return item.Id === self.gameWorldManager.player.id })[0];

        if (currentPlayer !== undefined) {
            //Find first synced with server command
            var firstSyncedCommand = self.commandQueueProcessed.filter(function (item) {
                return item.id === currentPlayer.LastProcessedCommandId;
            })[0];

            if (self.commandQueueProcessed.length > 0 && self.commandQueueProcessed[0].id < currentPlayer.LastProcessedCommandId) {
                self.commandQueueProcessed = []
            }
            else {
                //Remove all commands till synced one
                self.commandQueueProcessed = self.commandQueueProcessed.slice(
                    self.commandQueueProcessed.indexOf(firstSyncedCommand) + 1,
                    self.commandQueueProcessed.length
                    );
            }

                //Update body
                var xStart = self.gameWorldManager.player.gameRect.centerx;
                var yStart = self.gameWorldManager.player.gameRect.centery;

                self.gameWorldManager.player.gameRect.centerx = currentPlayer.Shape.Position.X;
                self.gameWorldManager.player.gameRect.centery = currentPlayer.Shape.Position.Y;

                //Prepeare command for server
                var result = self.commandQueueProcessed.filter(function (item) {
                    return item.syncedWithServer === false;
                }).map(function (item) {
                    return item.toServerCommand();
                });

                //Recalculate applied commands
                self.commandQueueProcessed.forEach(function (item) {
                    item.process(self);
                    item.syncedWithServer = true;
                });

                if ((Math.abs(self.gameWorldManager.player.gameRect.centerx - xStart)) > 10) {
                    console.log('Player X diff mod: ' + (Math.abs(self.gameWorldManager.player.gameRect.centerx - xStart)));
                    console.log('Player Y diff mod: ' + (Math.abs(self.gameWorldManager.player.gameRect.centery - yStart)));
                }

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
    this.direction = direction;
    this.syncedWithServer = false

    this.process = function (mechanicEngine) {

        var bodies= mechanicEngine.gameWorldManager.world.allGameObjects.filter(function (item) {
            return item.id === self.bodyId;
        });

        if (bodies !== undefined && bodies.length > 0) {
            var body = bodies[0];
            body.gameRect.center = {
                X: body.gameRect.centerx + body.speed * self.duration * self.direction.x / 1000,
                Y: body.gameRect.centery + body.speed * self.duration * self.direction.y / 1000
            };

            console.log('Key duration:' + self.duration);
            //console.log('Player y changed to:' + currentPlayer[0].Shape.Position.Y);
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
}