class Weapon extends Body {
    bulletDeviationRadians: number[];
    lastShoot: number;
    configuration: IWeaponSimpleBulletConfiguration;

    constructor(serverBody: ServerBody, configuration: IEngineConfiguration) {
        super(serverBody);

        this.bulletDeviationRadians = [0.01, 0.025, 0.045, 0, -0.01, -0.025, -0.045];
        this.lastShoot = new Date().getTime();
        
        switch (this.name) {
            case 'Revolver': {
                this.configuration = configuration.Revolver;
                break;
            }
            case 'Gun': {
                this.configuration = configuration.Gun;
                break;
            }
            case 'Shotgun': {
                this.configuration = configuration.ShortGun;
                break;
            } 
            case 'Dynamite': {
                this.configuration = configuration.Dynamit;
                break;
            }
        }
    }

    Shoot(direction: Vector, startPoint: Point, mechanicEngine: MechanicEngineTS, commandId: number) {
        var currentTime = new Date().getTime();

        if (currentTime - this.lastShoot > this.configuration.ShootingFrequency) {
            var bullets: Bullet[] = this.CreateBullet(direction, startPoint, mechanicEngine);

            bullets.forEach(function (bullet) {
                bullet.createdByCommandId = commandId;

                mechanicEngine.bodies.push(bullet);

                mechanicEngine.onBodyAdd.trigger(bullet);
            });

            this.lastShoot = currentTime;
        }

       
    }

    CreateBullet(direction: Vector, startPoint: Point, mechanicEngine: MechanicEngineTS): Bullet[] {
        var bulletList: Bullet[] = [];
        var newBullet: Bullet;

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
                                Radius: self.configuration.BulletSize,
                                Position:
                                {
                                    X: startPoint.x + direction.x * (self.configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension),
                                    Y: startPoint.y + direction.y * (self.configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension)
                                },
                                MaxDimension: self.configuration.Shape.MaxDimension
                            },
                            Direction: {
                                X: dirX,
                                Y: dirY
                            },
                            Speed: self.configuration.BulletSpeed,
                            ShootingDistance: self.configuration.ShootingDistance
                        });

                        newBullet.createdByCommandId = self.id;

                        bulletList.push(newBullet);

                        bulletId++;
                    });

                    break;
                };
            case "Dynamite":
                {
                    var dynamitConfiguration: IDynamitConfiguration;

                    dynamitConfiguration = <IDynamitConfiguration>this.configuration;

                    newBullet = new DynamitBody({
                        CreatedByCommandId: this.id,
                        LastProcessedCommandId: 1,
                        BodyType: 'Dynamite',
                        Id: new Date().getTime(),
                        Name: 'Dynamite',
                        Shape: {
                            Radius: dynamitConfiguration.BulletSize,
                            Position:
                            {
                                X: startPoint.x + direction.x * (dynamitConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2),
                                Y: startPoint.y + direction.y * (dynamitConfiguration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension / 2)
                            },
                            MaxDimension: dynamitConfiguration.Shape.MaxDimension
                        },
                        Direction: {
                            X: direction.x,
                            Y: direction.y
                        },
                        Speed: dynamitConfiguration.BulletSpeed
                    }, dynamitConfiguration.DetonationTime);

                    newBullet.createdByCommandId = this.id;

                    bulletList.push(newBullet);

                    break;
                };
            case 'Gun': {
                newBullet = new Bullet({
                    CreatedByCommandId: this.id,
                    LastProcessedCommandId: 1,
                    BodyType: 'Bullet',
                    Id: new Date().getTime(),
                    Name: 'Bullet',
                    BulletTypeName: "Bullet" + this.name,
                    Shape: {
                        Radius: this.configuration.BulletSize,
                        Position:
                        {
                            X: startPoint.x + direction.x * (this.configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension),
                            Y: startPoint.y + direction.y * (this.configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension)
                        },
                        MaxDimension: this.configuration.Shape.MaxDimension
                    },
                    Direction: {
                        X: direction.x,
                        Y: direction.y
                    },
                    Speed: this.configuration.BulletSpeed,
                    ShootingDistance: this.configuration.ShootingDistance
                });

                newBullet.createdByCommandId = this.id;

                bulletList.push(newBullet);

                break;
            }
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
                            Radius: this.configuration.BulletSize,
                            Position:
                            {
                                X: startPoint.x + direction.x * (this.configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension),
                                Y: startPoint.y + direction.y * (this.configuration.Shape.MaxDimension + mechanicEngine.configuration.Player.Shape.MaxDimension)
                            },
                            MaxDimension: this.configuration.Shape.MaxDimension
                        },
                        Direction: {
                            X: direction.x,
                            Y: direction.y
                        },
                        Speed: this.configuration.BulletSpeed,
                        ShootingDistance: this.configuration.ShootingDistance
                    });

                    newBullet.createdByCommandId = this.id;

                    bulletList.push(newBullet);

                    break;
                };
        }

        return bulletList;
    }
}