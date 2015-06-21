﻿class MechanicEngineTS {
    bodies: ActiveBody[];
    passiveBodies: Body[];
    commandQueue: CommandBase[];
    commandQueueProcessed: CommandBase[];
    onBodyAdd: { (body: Body): void }[];
    onBodyChanged: { (body: Body, changesType: BodyChangesType): void }[];
    player: PlayerBody;
    mapEngine: MapEngine;

    constructor(serverMap: ServerMap) {
        this.bodies = [];
        this.passiveBodies = [];
        this.onBodyAdd = [];
        this.commandQueue = [];
        this.commandQueueProcessed = [];
        this.onBodyChanged = [];
        this.mapEngine = new MapEngine(serverMap, this);
    }

    addPlayerBody(body: ServerBody) {
        this.player = new PlayerBody(body);
        var self = this;
        this.bodies.push(this.player);

        this.onBodyAdd.forEach(function (item) {
            item(self.player);
        });
    }

    addCommand(command: CommandBase) {
        this.commandQueue.push(command);
    }

    update() {
        //Process commands
        while (this.commandQueue.length > 0) {
            var commandToProcess = this.commandQueue.shift();

            if (commandToProcess !== undefined) {
                commandToProcess.process(this);

                this.commandQueueProcessed.push(commandToProcess);
            }
        }

        //Update predictive bodies
        this.bodies.forEach(function (body) {
            body.update()
        });
    }

    syncServerFrames(frame: ServerFrame) {

        if (frame.Map != null) {
            this.mapEngine.update(frame.Map);
        }
    }
} 