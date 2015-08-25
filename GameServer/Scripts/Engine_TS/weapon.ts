class Weapon extends Body {
    bulletDeviationRadians: number[];

    constructor(serverBody: ServerBody) {
        super(serverBody);

        this.bulletDeviationRadians = [0.01, 0.025, 0.045, 0, -0.01, -0.025, -0.045];
    }

    Shoot(direction: Vector, startPoint: Point, mechanicEngine: MechanicEngineTS) {
        var newBullet: Bullet;

        var bulletList: Bullet[] = [];

        switch (this.name) {
            case 'Shotgun':
                {
                    var self = this;

                    var bulletId = new Date().getTime()

                    this.bulletDeviationRadians.forEach(function (item) {
                        var dirX = direction.x * Math.cos(item) - direction.y * Math.sin(item);
                        var dirY = direction.x * Math.sin(item) + direction.y * Math.cos(item);

                        newBullet = new Bullet({
                            CreatedByCommandId: self.id,
                            LastProcessedCommandId: 1,
                            BodyType: 'Bullet',
                            Id: bulletId,
                            BulletTypeName: "Bullet" + self.name,
                            Name: 'Bullet',
                            Shape: {
                                Radius: 2,
                                Position:
                                {
                                    X: startPoint.x + direction.x * 140,
                                    Y: startPoint.y + direction.y * 140
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

                    break;
                };
            case "Dynamite":
                {
                    newBullet = new DynamitBody({
                        CreatedByCommandId: this.id,
                        LastProcessedCommandId: 1,
                        BodyType: 'Dynamite',
                        Id: new Date().getTime(),
                        Name: 'Dynamite',
                        Shape: {
                            Radius: 2,
                            Position:
                            {
                                X: startPoint.x + direction.x * 140,
                                Y: startPoint.y + direction.y * 140
                            },
                            MaxDimension: 2
                        },
                        Direction: {
                            X: direction.x,
                            Y: direction.y
                        },
                        Speed: 400
                    });

                    newBullet.createdByCommandId = this.id;

                    bulletList.push(newBullet);

                    break;
                };
            default:
                {
                    newBullet = new Bullet({
                        CreatedByCommandId: this.id,
                        LastProcessedCommandId: 1,
                        BodyType: 'Bullet',
                        Id: new Date().getTime(),
                        Name: 'Bullet',
                        BulletTypeName: "Bullet" + this.name,
                        Shape: {
                            Radius: 2,
                            Position:
                            {
                                X: startPoint.x + direction.x * 140,
                                Y: startPoint.y + direction.y * 140
                            },
                            MaxDimension: 2
                        },
                        Direction: {
                            X: direction.x,
                            Y: direction.y
                        },
                        Speed: 1400
                    });

                    newBullet.createdByCommandId = this.id;

                    bulletList.push(newBullet);

                    break;
                };
        }

        bulletList.forEach(function (bullet) {
            mechanicEngine.onBodyAdd.trigger(bullet);

            mechanicEngine.bodies.push(bullet);
        });
    }
}