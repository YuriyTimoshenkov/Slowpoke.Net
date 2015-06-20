class MechanicEngineTS {
    bodies: ActiveBody[];
    commandQueue: CommandBase[];
    commandQueueProcessed: CommandBase[];
    onActiveBodyAdd: { (body: ActiveBody): void }[];
    onActiveBodyChanged: { (body: ActiveBody, changesType: BodyChangesType): void }[];
    player: PlayerBody;

    constructor() {
        this.bodies = [];
        this.onActiveBodyAdd = [];
        this.commandQueue = [];
        this.commandQueueProcessed = [];
        this.onActiveBodyChanged = [];
    }

    addPlayerBody(body: ServerBody) {
        this.player = new PlayerBody(body);
        var self = this;
        this.bodies.push(this.player);

        this.onActiveBodyAdd.forEach(function (item) {
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
} 