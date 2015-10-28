class ServerCommand {
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
    state: { X: number; Y: number; Direction: Vector};

   constructor(bodyId, id:number) {
        this.bodyId = bodyId;
        this.syncedWithServer = false;
        this.id = id;
    }
   process(mechanicEngine: MechanicEngineTS) {
        var self = this;

        var bodies = mechanicEngine.bodies.filter(function (item) {
            return item.Id === self.bodyId;
        });

        if (bodies && bodies.length > 0) {
            var body = bodies[0];

            this.processBody(body, mechanicEngine);

            this.saveState(body);
        }
   }

   saveState(body) {
       this.state = {
           X: body.Shape.Position.X,
           Y: body.Shape.Position.Y,
           Direction: body.Direction
       };
   }

    processBody(body: Body, mechanicEngine: MechanicEngineTS) {}
    toServerCommand(): ServerCommand { return null; }
    compareState(body) {
        return this.state === undefined || (body.Shape.Position.X === this.state.X
            && body.Shape.Position.Y === this.state.Y
            && (body.Direction.X - this.state.Direction.X) < CommandBase.directionPossibleDiff
            && (body.Direction.Y - this.state.Direction.Y) < CommandBase.directionPossibleDiff);
    }
} 

class CommandMove extends CommandBase{
    duration: number;
    Direction: Vector;
    unitDirection: Vector;

    constructor(bodyId:number, id:number, duration:number, Direction:Vector) {
        super(bodyId, id);

        this.duration = duration;
        this.Direction = new Vector(Direction.X, Direction.Y);
        this.unitDirection = this.Direction.calculateUnitVector();
    }

    processBody(body: ActiveBody, mechanicEngine: MechanicEngineTS)  {
        body.Shape.Position = new Point(
            body.Shape.Position.X + body.Speed * this.duration * this.unitDirection.X / 1000,
            body.Shape.Position.Y + body.Speed * this.duration * this.unitDirection.Y / 1000
            );

        mechanicEngine.onBodyChanged.trigger({ body: body, changesType: BodyChangesType.Position });
    }

    toServerCommand(): ServerCommand {
        return new ServerCommand(this.id, "Move",
            [
                ["X", this.Direction.X.toString()],
                ["Y", this.Direction.Y.toString()],
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
        body.Direction = this.unitNewDirection;
        mechanicEngine.onBodyChanged.trigger({ body: body, changesType: BodyChangesType.Direction });
    }

    toServerCommand(): ServerCommand {
        return new ServerCommand(this.id, "ChangeDirection",
            [
                ["X", this.unitNewDirection.X.toString()],
                ["Y", this.unitNewDirection.Y.toString()]]
            );
    }
}

class CommandShoot extends CommandBase {

    constructor(bodyId: number, id: number) {
        super(bodyId, id);
    }

    processBody(body: CharacterBody, mechanicEngine: MechanicEngineTS) {
        body.CurrentWeapon.Shoot(
            body.Direction,
            new Point(body.Shape.Position.X, body.Shape.Position.Y),
            mechanicEngine,
            this.id);         
    }

    toServerCommand(): ServerCommand {
        return new ServerCommand(this.id, "Shoot", null);
    }
}