class Weapon extends Body {
    bulletDeviationRadians: number[];

    constructor(serverBody: ServerBody) {
        super(serverBody);

        this.bulletDeviationRadians = [0.01, 0.025, 0.045, 0, -0.01, -0.025, -0.045];
    }

    Shoot(direction: Vector, startPoint: Point, mechanicEngine: MechanicEngineTS) {
        var newBullet: Bullet;

        var bulletList: Bullet[] = [];
        var weaponConfiguration: IWeaponSimpleBulletConfiguration;

        switch (this.name) {
            case 'Shotgun':
                {
                    var self = this;

                    var bulletId = new Date().getTime()

                    weaponConfiguration = mechanicEngine.configuration.ShortGun;

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
                                Radius: weaponConfiguration.BulletSize,
                                Position:
                                {
                                    X: startPoint.x + direction.x * 140,
                                    Y: startPoint.y + direction.y * 140
                                },
                                MaxDimension: weaponConfiguration.Shape.MaxDimension
                            },
                            Direction: {
                                X: dirX,
                                Y: dirY
                            },
                            Speed: weaponConfiguration.BulletSpeed,
                            ShootingDistance: weaponConfiguration.ShootingDistance
                        });

                        newBullet.createdByCommandId = self.id;

                        bulletList.push(newBullet);

                        bulletId++;
                    });

                    break;
                };
            case "Dynamite":
                {
                    var dynamicConfiguration: IDynamitConfiguration;

                    dynamicConfiguration = mechanicEngine.configuration.Dynamit;

                    newBullet = new DynamitBody({
                        CreatedByCommandId: this.id,
                        LastProcessedCommandId: 1,
                        BodyType: 'Dynamite',
                        Id: new Date().getTime(),
                        Name: 'Dynamite',
                        Shape: {
                            Radius: dynamicConfiguration.BulletSize,
                            Position:
                            {
                                X: startPoint.x + dynamicConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2,
                                Y: startPoint.y + dynamicConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2
                            },
                            MaxDimension: dynamicConfiguration.Shape.MaxDimension
                        },
                        Direction: {
                            X: direction.x,
                            Y: direction.y
                        },
                        Speed: dynamicConfiguration.BulletSpeed
                    }, dynamicConfiguration.ShootingDistance);

                    newBullet.createdByCommandId = this.id;

                    bulletList.push(newBullet);

                    break;
                };
            case 'Gun': {

                weaponConfiguration = mechanicEngine.configuration.Gun;

                newBullet = new Bullet({
                    CreatedByCommandId: this.id,
                    LastProcessedCommandId: 1,
                    BodyType: 'Bullet',
                    Id: new Date().getTime(),
                    Name: 'Bullet',
                    BulletTypeName: "Bullet" + this.name,
                    Shape: {
                        Radius: weaponConfiguration.BulletSize,
                        Position:
                        {
                            X: startPoint.x + direction.x * 140,
                            Y: startPoint.y + direction.y * 140
                        },
                        MaxDimension: weaponConfiguration.Shape.MaxDimension
                    },
                    Direction: {
                        X: direction.x,
                        Y: direction.y
                    },
                    Speed: weaponConfiguration.BulletSpeed,
                    ShootingDistance: weaponConfiguration.ShootingDistance
                });

                newBullet.createdByCommandId = this.id;

                bulletList.push(newBullet);

                break;
            }
            default:
                {
                    weaponConfiguration = mechanicEngine.configuration.Revolver;

                    newBullet = new Bullet({
                        CreatedByCommandId: this.id,
                        LastProcessedCommandId: 1,
                        BodyType: 'Bullet',
                        Id: new Date().getTime(),
                        Name: 'Bullet',
                        BulletTypeName: "Bullet" + this.name,
                        Shape: {
                            Radius: weaponConfiguration.BulletSize,
                            Position:
                            {
                                X: startPoint.x + weaponConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2,
                                Y: startPoint.y + weaponConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2
                            },
                            MaxDimension: weaponConfiguration.Shape.MaxDimension
                        },
                        Direction: {
                            X: direction.x,
                            Y: direction.y
                        },
                        Speed: weaponConfiguration.BulletSpeed,
                        ShootingDistance: weaponConfiguration.ShootingDistance
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