/// <reference path="Event.ts" />

class MechanicEngineTS {
    bodies: Body[];
    commandQueue: CommandBase[];
    commandQueueProcessed: CommandBase[];
    configuration: IEngineConfiguration;

    onBodyAdd: slowpoke.Event<Body>;
    get BodyAdded(): slowpoke.IEvent<Body> { return this.onBodyAdd; }

    onBodyRemove: slowpoke.Event<Body>;
    get BodyRemoved(): slowpoke.IEvent<Body> { return this.onBodyRemove; }

    onBodyChanged: slowpoke.Event<{ body: Body; changesType: BodyChangesType }>;
    get BodyChanged(): slowpoke.IEvent<{ body: Body; changesType: BodyChangesType }> { return this.onBodyChanged; }

    player: PlayerBody;
    mapEngine: MapEngine;
    physicsEngine: PhysicsEngine;

    constructor(serverMap: ServerMap, physicsEngine: PhysicsEngine, configuration: IEngineConfiguration) {
        this.bodies = [];
        this.commandQueue = [];
        this.commandQueueProcessed = [];
        this.onBodyAdd = new slowpoke.Event<Body>();
        this.onBodyChanged = new slowpoke.Event< { body: Body; changesType: BodyChangesType }>();
        this.onBodyRemove = new slowpoke.Event<Body>();
        this.mapEngine = new MapEngine(serverMap, this);
        this.physicsEngine = physicsEngine;
        this.configuration = configuration;
    }

    addPlayerBody(body: ServerCharacterBody) {
        this.player = new PlayerBody(body, this.configuration);
        this.bodies.push(this.player);
    }

    addCommand(command: CommandBase) {
        this.commandQueue.push(command);
    }

    removeActiveBody(bodyId: number) {
        var self = this;
        this.bodies = this.bodies.filter(function (body: ActiveBody) {
            if (body.id != bodyId) {
                return true;
            }
            else {
                self.onBodyRemove.trigger(body);
                return false;
            }
        });
    }

    update() {
        var self = this;



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
            body.update(self)
        });
    }
} 