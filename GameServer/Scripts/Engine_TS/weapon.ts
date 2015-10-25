class WeaponBase extends Body {
    Name: string;

    Shoot(Direction: Vector,
        startPoint: Point,
        mechanicEngine: MechanicEngineTS,
        commandId: number) { }
}

class WeaponSimpleBullet extends WeaponBase {
    bulletDeviationRadians: number[];
    lastShoot: number;

    constructor() {
        super();

        this.bulletDeviationRadians = [0.01, 0.025, 0.045, 0, -0.01, -0.025, -0.045];
        this.lastShoot = new Date().getTime();
    }

    Shoot(Direction: Vector,
        startPoint: Point,
        mechanicEngine: MechanicEngineTS,
        commandId: number) {

        var currentTime = new Date().getTime();
        var configuration: IWeaponSimpleBulletConfiguration;

        switch (this.Name) {
            case 'Revolver': {
                configuration = mechanicEngine.configuration.Revolver;
                break;
            }
            case 'Gun': {
                configuration = mechanicEngine.configuration.Gun;
                break;
            }
            case 'Shotgun': {
                configuration = mechanicEngine.configuration.ShotGun;
                break;
            }
            case 'Dynamite': {
                configuration = mechanicEngine.configuration.Dynamit;
                break;
            }
        }

        if (currentTime - this.lastShoot > configuration.ShootingFrequency) {
            var bullets: Bullet[] = this.CreateBullet(Direction, startPoint, mechanicEngine, configuration);

            bullets.forEach(function (bullet) {
                bullet.createdByCommandId = commandId;

                mechanicEngine.bodies.push(bullet);

                mechanicEngine.onBodyAdd.trigger(bullet);
            });

            this.lastShoot = currentTime;
        }
    }

    CreateBullet(Direction: Vector,
        startPoint: Point,
        mechanicEngine: MechanicEngineTS,
        configuration: IWeaponSimpleBulletConfiguration): Bullet[]{

        var bulletList: Bullet[] = [];
        var newBullet: Bullet;

        switch (this.Name) {
            case 'Shotgun':
                {
                    var self = this;
                    
                    var bulletId = new Date().getTime()

                    this.bulletDeviationRadians.forEach(function (item) {
                        var dirX = Direction.X * Math.cos(item) - Direction.Y * Math.sin(item);
                        var dirY = Direction.X * Math.sin(item) + Direction.Y * Math.cos(item);

                        newBullet = <Bullet>SerializationHelper.deserialize({
                            CreatedByCommandId: self.Id,
                            LastProcessedCommandId: 1,
                            BodyType: 'Bullet',
                            Id: bulletId,
                            BulletTypeName: "Bullet" + self.Name,
                            Name: 'Bullet',
                            Shape: {
                                Radius: configuration.BulletSize,
                                Position:
                                {
                                    X: startPoint.X + Direction.X * (configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension),
                                    Y: startPoint.Y + Direction.Y * (configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension)
                                },
                                MaxDimension: configuration.Shape.MaxDimension,
                                ToClientShape: function (): Shape { return null; }
                            },
                            Direction: {
                                X: dirX,
                                Y: dirY
                            },
                            Speed: configuration.BulletSpeed,
                            ShootingDistance: configuration.ShootingDistance
                        }, window);

                        newBullet.createdByCommandId = self.Id;

                        bulletList.push(newBullet);

                        bulletId++;
                    });

                    break;
                };
            case "Dynamite":
                {
                    var dynamitConfiguration: IDynamitConfiguration;

                    dynamitConfiguration = <IDynamitConfiguration>configuration;

                    newBullet = <DynamitBody>SerializationHelper.deserialize(
                    {
                        CreatedByCommandId: this.Id,
                        LastProcessedCommandId: 1,
                        BodyType: 'Dynamite',
                        Id: new Date().getTime(),
                        Name: 'Dynamite',
                        Shape: {
                            Radius: dynamitConfiguration.BulletSize,
                            Position:
                            {
                                X: startPoint.X + Direction.X * (dynamitConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2),
                                Y: startPoint.Y + Direction.Y * (dynamitConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2)
                            },
                            MaxDimension: dynamitConfiguration.Shape.MaxDimension
                        },
                        Direction: {
                            X: Direction.X,
                            Y: Direction.Y
                        },
                        Speed: dynamitConfiguration.BulletSpeed
                    }, window);

                    newBullet.createdByCommandId = this.Id;

                    bulletList.push(newBullet);

                    break;
                };
            case 'Gun': {
                newBullet = <Bullet>SerializationHelper.deserialize(
                {
                    CreatedByCommandId: this.Id,
                    LastProcessedCommandId: 1,
                    BodyType: 'Bullet',
                    Id: new Date().getTime(),
                    Name: 'Bullet',
                    BulletTypeName: "Bullet" + this.Name,
                    Shape: {
                        Radius: configuration.BulletSize,
                        Position:
                        {
                            X: startPoint.X + Direction.X * (configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension),
                            Y: startPoint.Y + Direction.Y * (configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension)
                        },
                        MaxDimension: configuration.Shape.MaxDimension
                    },
                    Direction: {
                        X: Direction.X,
                        Y: Direction.Y
                    },
                    Speed: configuration.BulletSpeed,
                    ShootingDistance: configuration.ShootingDistance
                }, window);

                newBullet.createdByCommandId = this.Id;

                bulletList.push(newBullet);

                break;
            }
            default:
                {
                    newBullet = <Bullet>SerializationHelper.deserialize({
                        CreatedByCommandId: this.Id,
                        LastProcessedCommandId: 1,
                        BodyType: 'Bullet',
                        Id: new Date().getTime(),
                        Name: 'Bullet',
                        BulletTypeName: "Bullet" + this.Name,
                        Shape: {
                            Radius: configuration.BulletSize,
                            Position:
                            {
                                X: startPoint.X + Direction.X * (configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension),
                                Y: startPoint.Y + Direction.Y * (configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension)
                            },
                            MaxDimension: configuration.Shape.MaxDimension
                        },
                        Direction: {
                            X: Direction.X,
                            Y: Direction.Y
                        },
                        Speed: configuration.BulletSpeed,
                        ShootingDistance: configuration.ShootingDistance
                    }, window);

                    newBullet.createdByCommandId = this.Id;

                    bulletList.push(newBullet);

                    break;
                };
        }

        return bulletList;
    }
}

class WeaponMultipleShotgunBullet extends WeaponSimpleBullet {
}