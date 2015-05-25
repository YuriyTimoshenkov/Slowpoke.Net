function CommandMove(bodyId, duration, direction) {
    var self = this;
    this.duration = duration;
    this.bodyId = bodyId;
    this.direction = new Vector(direction.x, direction.y);
    this.unitDirection = self.direction.calculateUnitVector();
    this.syncedWithServer = false

    this.process = function (mechanicEngine) {

        var bodies = mechanicEngine.bodies.filter(function (item) {
            return item.id === self.bodyId;
        });

        if (bodies !== undefined && bodies.length > 0) {
            var body = bodies[0];

            body.gameRect.center = {
                X: body.gameRect.centerx + body.speed * self.duration * self.unitDirection.x / 1000,
                Y: body.gameRect.centery + body.speed * self.duration * self.unitDirection.y / 1000
            };

            //save state
            self.state = {
                x: body.gameRect.centerx,
                y: body.gameRect.centery,
            };

            console.log('Key duration:' + self.duration);
        }
    }

    this.toServerCommand = function () {
        return {
            Name: "Move",
            Id: self.id,
            Data: [
                ["X", self.direction.x],
                ["Y", self.direction.y],
                ["Duration", self.duration]]
        }
    };

    this.compareState = function (body) {
        return body.Shape.Position.X === self.state.x
        && body.Shape.Position.Y === self.state.y
    }
}