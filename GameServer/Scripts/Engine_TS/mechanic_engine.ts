class MechanicEngine {
    bodies: ActiveBody[];
    commandQueue: CommandBase[];
    commandQueueProcessed: CommandBase[];
    onActiveBodyAdd: {(body: ActiveBody): void}[];
    player: PlayerBody;

    constructor(player:any) {
        this.player = new PlayerBody(player);

        this.onActiveBodyAdd.forEach(function (item) {
            item(this.player);
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
                commandToProcess.id = new Date().getTime();

                commandToProcess.process(self);

                this.commandQueueProcessed.push(commandToProcess);
            }
        }

        //Update predictive bodies
        this.bodies.forEach(function (body) {
            body.update()
        });
    }
} 