class ServerBodySynchornizer {
    mechanicEngine: MechanicEngineTS;
    syncServerFrames: (frame)=> ServerCommand[];

    constructor(mechanicEngine: MechanicEngineTS) {
        this.mechanicEngine = mechanicEngine;
        this.syncServerFrames = (frame): ServerCommand[]=> {
            return this.syncServerFramesHandler(frame, this);
        };
    }

    getServerBodyProcessingType(serverBody: ServerBody): BodyProcessingTypes {
        if (serverBody.BodyType === 'Bullet') return BodyProcessingTypes.ClientSide;
        if (serverBody.Id === this.mechanicEngine.player.id) return BodyProcessingTypes.ClientSidePrediction;

        return BodyProcessingTypes.ServerSide;
    }

    createNewBody(serverBody: ServerBody, syncSessionId: number): Body {
        var newBody: Body;

        switch (serverBody.BodyType) {
            case "LifeContainer": {
                newBody = new PassiveBody(serverBody);
                this.mechanicEngine.passiveBodies.push(newBody);

                break;
            }
        }

        newBody.syncSessionId = syncSessionId;

        this.mechanicEngine.onBodyAdd.forEach(function (item) {
            item(newBody);
        });


        return newBody;
    }

    syncServerSideBody(serverBody: ServerBody, syncSessionId: number) {
        var filtered = this.mechanicEngine.bodies.filter(function (body) { return serverBody.Id === body.id });

        if (filtered.length > 0) {
            var body: ActiveBody = filtered[0];

            try
            {
                body.serverSync(serverBody);
            }
            catch (ex) {
                console.log("syncServerSideBody: " + ex)
            }
            body.syncSessionId = syncSessionId;

            this.mechanicEngine.onBodyChanged.forEach(function (item) {
                item(body, BodyChangesType.direction);
            });
        }
        else {
            this.createNewBody(serverBody, syncSessionId);
        }
    }

    syncClientSideBody(serverBody: ServerBody, syncSessionId: number) {

        var filtered = this.mechanicEngine.bodies.filter(function (body) { return serverBody.Id === body.id });

        if (filtered.length === 0) {
            this.createNewBody(serverBody, syncSessionId);
        }
        else {
            filtered.forEach(function (body) {
                body.syncSessionId = syncSessionId;
            });
        }
    }

    syncPredictiveBodies(serverBody: ServerActiveBody): ServerCommand[] {
        //Find first synced with server command
        var firstSyncedCommand: CommandBase = this.mechanicEngine.commandQueueProcessed.filter(function (command) {
            return command.id === serverBody.LastProcessedCommandId;
        })[0];

        //Remove all commands till synced one
        this.mechanicEngine.commandQueueProcessed = this.mechanicEngine.commandQueueProcessed.slice(
            this.mechanicEngine.commandQueueProcessed.indexOf(firstSyncedCommand) + 1,
            this.mechanicEngine.commandQueueProcessed.length
            );

        //Update body if needed
        if (firstSyncedCommand !== undefined && !firstSyncedCommand.compareState(serverBody)) {

            this.mechanicEngine.player.gameRect.centerx = serverBody.Shape.Position.X;
            this.mechanicEngine.player.gameRect.centery = serverBody.Shape.Position.Y;
            this.mechanicEngine.player.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y).calculateUnitVector();

            //Recalculate applied commands
            this.mechanicEngine.commandQueueProcessed.forEach(function (command) {
                command.process(this.mechanicEngine);
            });

            console.log('[Sync server] Recalculation applied.');
            console.log('Player X diff mod: ' + (Math.abs(firstSyncedCommand.state.x - serverBody.Shape.Position.X)));
            console.log('Player Y diff mod: ' + (Math.abs(firstSyncedCommand.state.y - serverBody.Shape.Position.Y)));
        }

        //Prepeare command for server
        var resultNotYetSyncedItems = this.mechanicEngine.commandQueueProcessed.filter(function (command) {
            return command.syncedWithServer === false;
        });

        //Mark as sent
        resultNotYetSyncedItems.forEach(function (item) {
            item.syncedWithServer = true;
        });

        //Convert to DTO
        var result = resultNotYetSyncedItems.map(function (command: CommandBase): ServerCommand {
            return command.toServerCommand();
        });

        return result;
    }

    syncServerFramesHandler(frame, self: ServerBodySynchornizer): ServerCommand[] {
    var syncSessionId = new Date().getTime();
    var serverCommands: ServerCommand[] = [];

    frame.Bodies.forEach(function (serverBody) {
        switch (self.getServerBodyProcessingType(serverBody)) {
            case BodyProcessingTypes.ServerSide:
                {

                    self.syncServerSideBody(serverBody, syncSessionId);

                    break;
                };
            case BodyProcessingTypes.ClientSide:
                {
                    self.syncClientSideBody(serverBody, syncSessionId);

                    break;
                }
            case BodyProcessingTypes.ClientSidePrediction:
                {
                    serverCommands = serverCommands.concat(self.syncPredictiveBodies(serverBody));
                    self.mechanicEngine.player.syncSessionId = syncSessionId;

                    self.mechanicEngine.player.serverSync(serverBody);

                    break;
                }
        }
    });

    self.mechanicEngine.bodies = self.mechanicEngine.bodies.filter(function (body) {
        if (body.syncSessionId === syncSessionId || body.syncSessionId === undefined) {
            return true;
        }
        else {
            self.mechanicEngine.onBodyRemove.forEach(function (bodyRemoveHandler) {
                bodyRemoveHandler(body);
            });

            return false;
        }
    });


    if (frame.Map) {
        self.mechanicEngine.mapEngine.update(frame.Map);
    }

    return serverCommands;
}
} 