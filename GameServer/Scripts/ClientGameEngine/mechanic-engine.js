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
            self.commandQueueProcessed.push(commandToProcess);
        }
    }

    this.syncWithServer = function (frame) {
        var result = [];
        var currentPlayer = frame.Bodies.filter(function (item) { return item.Id === self.gameWorldManager.player.id });

        if (currentPlayer !== undefined && currentPlayer.length > 0) {
            //Update body
            self.gameWorldManager.player.gameRect.centerx = currentPlayer[0].Shape.Position.X;
            self.gameWorldManager.player.gameRect.centery = currentPlayer[0].Shape.Position.Y;

            //console.log('Player x changed to:' + currentPlayer[0].Shape.Position.X);
            //console.log('Player y changed to:' + currentPlayer[0].Shape.Position.Y);

            //Recalculate applied commands
            self.commandQueueProcessed.forEach(function (item) {
                item.process(self);
            });

            var result = self.commandQueueProcessed.map(function (item) {
                return item.toServerCommand();
            });

            //Clear array
            self.commandQueueProcessed = [];

            return result;
        }

        return result;
    }
}

function CommandMove(bodyId, duration, direction) {
    var self = this;
    this.duration = duration;
    this.bodyId = bodyId;
    this.direction = direction;

    this.process = function (mechanicEngine) {

        var bodies= mechanicEngine.gameWorldManager.world.allGameObjects.filter(function (item) {
            return item.id === self.bodyId;
        });

        if (bodies !== undefined && bodies.length > 0) {
            var body = bodies[0];
            body.gameRect.center = {
                X: body.gameRect.centerx + body.speed * self.direction.x / 1000,
                Y: body.gameRect.centery + body.speed * self.direction.y / 1000
            };
        }
    }

    this.toServerCommand = function () {
        return {
            Name: "Move", Data: [
                ["X", self.direction.x ],
                ["Y", self.direction.y ],
                ["Duration", self.duration ]]
        }
    };
}