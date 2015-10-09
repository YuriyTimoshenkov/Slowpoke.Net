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
                break;
            }
            case "NPCAI": {
                newBody = new CharacterBody(<ServerCharacterBody> serverBody, this.mechanicEngine.configuration);
                break;
            }
            case "Bullet": {
                newBody = new Bullet(<ServerBulletBody> serverBody);
                break;
            }
            case "PlayerBody": {
                newBody = new PlayerOtherBody(<ServerCharacterBody> serverBody, this.mechanicEngine.configuration);
                break;
            }
            case "BoxBody": {
                newBody = new BoxPassiveBody(serverBody);
                break;
            }
            case "Gun": 
            case "Shotgun":
            case "Dynamite":
            case "Revolver": {
                newBody = new Weapon(serverBody, this.mechanicEngine.configuration);
                break;
            }
        }

        if (newBody) {
            this.mechanicEngine.bodies.push(newBody);

            newBody.syncSessionId = syncSessionId;

            this.mechanicEngine.onBodyAdd.trigger(newBody);
        }


        return newBody;
    }

    syncServerSideBody(serverBody: ServerBody, syncSessionId: number) {
        var filtered = this.mechanicEngine.bodies.filter(function (body) { return serverBody.Id === body.id });

        if (filtered.length > 0) {
            var body: Body = filtered[0];

            try
            {
                body.serverSync(serverBody, this.mechanicEngine);
            }
            catch (ex) {
                console.log("syncServerSideBody: " + ex)
            }
            body.syncSessionId = syncSessionId;

            this.mechanicEngine.onBodyChanged.trigger({ body: body, changesType: BodyChangesType.position });

            this.mechanicEngine.onBodyChanged.trigger({ body: body, changesType: BodyChangesType.direction });
        }
        else {
            this.createNewBody(serverBody, syncSessionId);
        }
    }

    syncClientSideBody(serverBody: ServerBody, syncSessionId: number) {

        var filtered = this.mechanicEngine.bodies.filter(function (body) {
            return serverBody.Id === body.id
                || serverBody.CreatedByCommandId === body.createdByCommandId
        });

        if (filtered.length === 0) {
            this.createNewBody(serverBody, syncSessionId);
        }
        else {
            filtered.forEach(function (body) {
                body.syncSessionId = syncSessionId;
            });
        }
    }

    syncPredictiveBodies(serverBody: ServerActiveBody, mechanicEngine: MechanicEngineTS): ServerCommand[] {
        //Find first synced with server command
        var firstSyncedCommand: CommandBase = mechanicEngine.commandQueueProcessed.filter(function (command) {
            return command.id === serverBody.LastProcessedCommandId && command.bodyId == mechanicEngine.player.id;
        })[0];

        //Remove all commands till synced one
        this.mechanicEngine.commandQueueProcessed = mechanicEngine.commandQueueProcessed.slice(
            mechanicEngine.commandQueueProcessed.indexOf(firstSyncedCommand) + 1,
            mechanicEngine.commandQueueProcessed.length
            );

        //Update body if needed
        if (firstSyncedCommand !== undefined && !firstSyncedCommand.compareState(serverBody)) {

            mechanicEngine.player.gameRect.centerx = serverBody.Shape.Position.X;
            mechanicEngine.player.gameRect.centery = serverBody.Shape.Position.Y;
            mechanicEngine.player.direction = new Vector(serverBody.Direction.X, serverBody.Direction.Y).calculateUnitVector();

            //Recalculate applied commands
            mechanicEngine.commandQueueProcessed.forEach(function (command) {
                command.process(mechanicEngine);
            });

            console.log('[Sync server] Recalculation applied.');
            console.log('Player X diff mod: ' + (Math.abs(firstSyncedCommand.state.x - serverBody.Shape.Position.X)));
            console.log('Player Y diff mod: ' + (Math.abs(firstSyncedCommand.state.y - serverBody.Shape.Position.Y)));
        }

        //Prepeare command for server
        var resultNotYetSyncedItems = mechanicEngine.commandQueueProcessed.filter(function (command) {
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
                        //TODO: implement true polymorphic body processing
                        serverCommands = serverCommands.concat(self.syncPredictiveBodies(serverBody, self.mechanicEngine));
                        self.mechanicEngine.player.syncSessionId = syncSessionId;

                        self.mechanicEngine.player.serverSync(serverBody, self.mechanicEngine);

                        break;
                    }
            }
        });

        self.mechanicEngine.bodies = self.mechanicEngine.bodies.filter(function (body) {
            if (body.syncSessionId === syncSessionId || body.syncSessionId === undefined) {
                return true;
            }
            else {
                self.mechanicEngine.onBodyRemove.trigger(body);

                return false;
            }
        });


        if (frame.Map) {
            self.mechanicEngine.mapEngine.update(frame.Map);
        }

        return serverCommands;
    }
} 