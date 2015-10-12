﻿class ServerCommand {
    id: number;
    name: string;
    data: string[][];

    constructor(id: number, name: string, data: string[][]) {
        this.id = id;
        this.name = name;
        this.data = data;
    }
}

class CommandBase{
    id: number;
    bodyId: number;
    syncedWithServer: boolean;
    static directionPossibleDiff: number = 0.0001;
    state: { x: number; y: number; direction: Vector};

   constructor(bodyId, id:number) {
        this.bodyId = bodyId;
        this.syncedWithServer = false;
        this.id = id;
    }
   process(mechanicEngine: MechanicEngineTS) {
        var self = this;

        var bodies = mechanicEngine.bodies.filter(function (item) {
            return item.id === self.bodyId;
        });

        if (bodies && bodies.length > 0) {
            var body = bodies[0];

            this.processBody(body, mechanicEngine);

            //save state
            this.state = {
                x: body.shape.position.x,
                y: body.shape.position.y,
                direction: body.direction
            };
        }
   }

    processBody(body: Body, mechanicEngine: MechanicEngineTS) {}
    toServerCommand(): ServerCommand { return null; }
    compareState(body) {
        return this.state === undefined || (body.Shape.Position.X === this.state.x
            && body.Shape.Position.Y === this.state.y
            && (body.Direction.X - this.state.direction.x) < CommandBase.directionPossibleDiff
            && (body.Direction.Y - this.state.direction.y) < CommandBase.directionPossibleDiff);
    }
} 

class CommandMove extends CommandBase{
    duration: number;
    direction: Vector;
    unitDirection: Vector;

    constructor(bodyId:number, id:number, duration:number, direction:Vector) {
        super(bodyId, id);
        this.duration = duration;
        this.direction = new Vector(direction.x, direction.y);
        this.unitDirection = this.direction.calculateUnitVector();
    }

    processBody(body: ActiveBody, mechanicEngine: MechanicEngineTS)  {
        body.shape.position = new Point(
            body.shape.position.x + body.speed * this.duration * this.unitDirection.x / 1000,
            body.shape.position.y + body.speed * this.duration * this.unitDirection.y / 1000
            );

        mechanicEngine.onBodyChanged.trigger({ body: body, changesType: BodyChangesType.position });
    }

    toServerCommand(): ServerCommand {
        return new ServerCommand(this.id, "Move",
            [
                ["X", this.direction.x.toString()],
                ["Y", this.direction.y.toString()],
                ["Duration", this.duration.toString()]]
            )
    }
}

class CommandChangeDirection extends CommandBase {
    unitNewDirection: Vector;

    constructor(bodyId: number, id: number, newDirection: Vector) {
        super(bodyId, id);
        this.unitNewDirection = newDirection.calculateUnitVector();
    }
    processBody(body: ActiveBody, mechanicEngine: MechanicEngineTS) {
        body.direction = this.unitNewDirection;

        mechanicEngine.onBodyChanged.trigger({ body: body, changesType: BodyChangesType.direction });
    }

    toServerCommand(): ServerCommand {
        return new ServerCommand(this.id, "ChangeDirection",
            [
                ["X", this.unitNewDirection.x.toString()],
                ["Y", this.unitNewDirection.y.toString()]]
            );
    }
}

class CommandShoot extends CommandBase {

    constructor(bodyId: number, id: number) {
        super(bodyId, id);
    }

    processBody(body: CharacterBody, mechanicEngine: MechanicEngineTS) {
        body.currentWeapon.Shoot(
            body.direction,
            new Point(body.shape.position.x, body.shape.position.y),
            mechanicEngine,
            this.id);         
    }

    toServerCommand(): ServerCommand {
        return new ServerCommand(this.id, "Shoot", null);
    }
}