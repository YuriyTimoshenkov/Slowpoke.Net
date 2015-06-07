class ServerCommand {
    id: number;
    name: string;
    data: [];

    constructor(id: number, name: string, data: []) {
        this.id = id;
        this.name = name;
        this.data = data;
    }
}

class CommandBase {
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
    process(mechanicEngine:any) {
        var self = this;

        var bodies = mechanicEngine.bodies.filter(function (item) {
            return item.Id === self.bodyId;
        });

        if (bodies !== undefined && bodies.length > 0) {
            var body = bodies[0];

            this.processBody(body, mechanicEngine);

            //save state
            this.state = {
                x: body.gameRect.centerx,
                y: body.gameRect.centery,
                direction: body.direction
            };
        }
   }

    processBody(body: ActiveBody, mechanicEngine: any) {}
    toServerCommand() { }
    compareState(body) {
        return body.Shape.Position.X === this.state.x
        && body.Shape.Position.Y === this.state.y
            && (body.Direction.X - this.state.direction.x) < CommandBase.directionPossibleDiff
            && (body.Direction.Y - this.state.direction.y) < CommandBase.directionPossibleDiff
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
    processBody(body) {
        body.gameRect.center = {
            X: body.gameRect.centerx + body.speed * this.duration * this.unitDirection.x / 1000,
            Y: body.gameRect.centery + body.speed * this.duration * this.unitDirection.y / 1000
        };
    }

    toServerCommand() {
        return new ServerCommand(this.id, "Move",
            [
                ["X", this.direction.x],
                ["Y", this.direction.y],
                ["Duration", this.duration]]
            )
    }
}