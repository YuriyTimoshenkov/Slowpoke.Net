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

            this.processBody(body);

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

        console.log('direction diff x: ' + (body.Direction.X - this.state.direction.x)
            + ' y: ' + (body.Direction.Y - this.state.direction.y));

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