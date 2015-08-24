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
                x: body.gameRect.center.x,
                y: body.gameRect.center.y,
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
        body.gameRect.center = new Point(
            body.gameRect.centerx + body.speed * this.duration * this.unitDirection.x / 1000,
            body.gameRect.centery + body.speed * this.duration * this.unitDirection.y / 1000
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
    bulletDeviationRadians: number[];

    constructor(bodyId: number, id: number) {
        super(bodyId, id);
        this.bulletDeviationRadians = [0.01, 0.025, 0.045, 0, -0.01, -0.025, -0.045];
    }
    processBody(body: CharacterBody, mechanicEngine: MechanicEngineTS) {

        var characterBody: CharacterBody = body;
        var newBullet: Bullet;

        if (body.currentWeapon.name == 'Shotgun') {
            var self = this;

            var bulletList: Bullet[] = [];

            var bulletId = new Date().getTime()

            this.bulletDeviationRadians.forEach(function (item) {
                var dirX = body.direction.x * Math.cos(item) - body.direction.y * Math.sin(item);
                var dirY = body.direction.x * Math.sin(item) + body.direction.y * Math.cos(item);
                newBullet = new Bullet({
                    CreatedByCommandId: self.id,
                    LastProcessedCommandId: 1,
                    BodyType: 'Bullet',
                    Id: bulletId,
                    BulletTypeName: "Bullet" + body.currentWeapon.name,
                    Name: 'Bullet',
                    Shape: {
                        Radius: 2,
                        Position:
                        {
                            X: body.gameRect.centerx + body.direction.x * 120,
                            Y: body.gameRect.centery + body.direction.y * 120
                        },
                        MaxDimension: 2
                    },
                    Direction: {
                        X: dirX,
                        Y: dirY
                    },
                    Speed: 1000
                });

                newBullet.createdByCommandId = self.id;

                bulletList.push(newBullet);

                bulletId++;
            });

            bulletList.forEach(function (bullet) {
                mechanicEngine.onBodyAdd.trigger(bullet);

                mechanicEngine.bodies.push(bullet);
            });
        }
        else {
            newBullet = new Bullet({
                CreatedByCommandId: this.id,
                LastProcessedCommandId: 1,
                    BodyType: 'Bullet',
                    Id: new Date().getTime(),
                    Name: 'Bullet',
                    BulletTypeName: "Bullet" + body.currentWeapon.name,
                    Shape: {
                        Radius: 2,
                        Position:
                        {
                            X: body.gameRect.centerx + body.direction.x * 140,
                            Y: body.gameRect.centery + body.direction.y * 140
                        },
                        MaxDimension: 2
                    },
                    Direction: {
                        X: body.direction.x,
                        Y: body.direction.y
                    },
                    Speed: 1400
            });

            newBullet.createdByCommandId = this.id;
            mechanicEngine.bodies.push(newBullet);
            mechanicEngine.onBodyAdd.trigger(newBullet);
        }
    }

    toServerCommand(): ServerCommand {
        return new ServerCommand(this.id, "Shoot", null);
    }
}