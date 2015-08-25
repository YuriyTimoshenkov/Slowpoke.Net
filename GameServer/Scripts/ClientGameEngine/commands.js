var CommandBase = Class.extend({
    init: function (bodyId) {
        this.bodyId = bodyId;
        this.syncedWithServer = false
        this.directionPossibleDiff = 0.0001;
    },
    process: function (mechanicEngine) {
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
    },
    processBody: function(body) {},
    toServerCommand: function () { },
    compareState: function (body) {
        return body.Shape.Position.X === this.state.x
        && body.Shape.Position.Y === this.state.y
        && (body.Direction.X - this.state.direction.x) < this.directionPossibleDiff
        && (body.Direction.Y - this.state.direction.y) < this.directionPossibleDiff
    }
});

CommandMove = CommandBase.extend({
    init: function (bodyId, duration, direction) {
        this.duration = duration;
        this.direction = new Vector(direction.x, direction.y);
        this.unitDirection = this.direction.calculateUnitVector();

        this._super(bodyId);
    },
    processBody: function (body) {
        body.gameRect.center = {
            X: body.gameRect.centerx + body.speed * this.duration * this.unitDirection.x / 1000,
            Y: body.gameRect.centery + body.speed * this.duration * this.unitDirection.y / 1000
        };
    },
    toServerCommand: function () {
        return {
            Name: "Move",
            Id: this.id,
            Data: [
                ["X", this.direction.x],
                ["Y", this.direction.y],
                ["Duration", this.duration]]
        }
    }
});

var CommandChangeDirection = CommandBase.extend({
    init: function (bodyId, newDirection) {
        this.unitNewDirection = newDirection.calculateUnitVector();

        this._super(bodyId);
    },
    processBody: function (body) {
        body.updateDirection(this.unitNewDirection);
    },
    toServerCommand: function () {
        return {
            Name: "ChangeDirection",
            Id: this.id,
            Data: [
                ["X", this.unitNewDirection.x],
                ["Y", this.unitNewDirection.y]]
        }
    }
});

var CommandShoot = CommandBase.extend({
    init: function (bodyId) {
        this._super(bodyId);

        this.bulletDeviationRadians = [0.01, 0.025, 0.045, 0, -0.01, -0.025, -0.045];
    },
    processBody: function (body, mechanicEngine) {

        if (body.currentWeapon === 'Shotgun') {
            var self = this;

            this.bulletDeviationRadians.forEach(function (item) {
                var dirX = body.direction.x * Math.cos(item) - body.direction.y * Math.sin(item);
                var dirY = body.direction.x * Math.sin(item) + body.direction.y * Math.cos(item);

                console.log("Command.js oOoOoOoOoOoO ");
                var newObject = mechanicEngine.gameObjectFactory.createGameObject(
               gameTypes.gameObjects.BULLET, {
                   BodyType: 'Bullet',
                   Id: 0,
                   Name: 'Bullet',
                   Shape: {
                       Radius: 2,
                       Position:
                           {
                               X: body.gameRect.centerx,
                               Y: body.gameRect.centery
                           }
                   },
                   Direction: {
                       X: dirX,
                       Y: dirY
                   },
                   Speed: 1400
               });

                newObject.CreatedByCommandId = self.id;
                mechanicEngine.bodies.push(newObject);
                mechanicEngine.onObjectStateChanged(newObject, 'add');
            });
        }
        else {
            var newObject = mechanicEngine.gameObjectFactory.createGameObject(
                gameTypes.gameObjects.BULLET, {
                    BodyType: 'Bullet',
                    Id: 0,
                    Name: 'Bullet',
                    Shape: {
                        Radius: 2,
                        Position:
                            {
                                X: body.gameRect.centerx,
                                Y: body.gameRect.centery
                            }
                    },
                    Direction: {
                        X: body.direction.x,
                        Y: body.direction.y
                    },
                    Speed: 1400
                });

            newObject.CreatedByCommandId = this.id;
            mechanicEngine.bodies.push(newObject);
            mechanicEngine.onObjectStateChanged(newObject, 'add');
        }
    },
    toServerCommand: function () {
        return {
            Name: "Shoot",
            Id: this.id
        }
    }
});