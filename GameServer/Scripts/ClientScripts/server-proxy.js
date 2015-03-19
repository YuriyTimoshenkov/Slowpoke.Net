function serverProxyPrototype(url) {
    var url = url;

    this.run = function (doneHandler, failHandler) {
    }

    this.loadPlayer = function (doneHandler, failHandler) {
    }

    this.getActiveBodies = function (playerId, doneHandler, failHandler) {
    };

    this.shoot = function (playerId) {
    }

    this.moveBody = function (playerId, x, y) {
    }

    this.changeBodyDirection = function (playerId, dx, dy) {
    }
}

function serverProxySignalR(url) {
    var url = url;
    var gameProxy = $.connection.slowpokeHub;

    gameProxy.client.SomeMethod = function () { }

    this.run = function (doneHandler, failHandler) {
        $.connection.hub.start().done(doneHandler)
        .fail(failHandler)
    }

    this.loadPlayer = function (doneHandler, failHandler) {
        gameProxy.server.loadPlayer().done(doneHandler).fail(failHandler);
    }
    this.getActiveBodies = function (playerId, doneHandler, failHandler) {
        gameProxy.server.getActiveBodies(playerId).done(doneHandler).fail(failHandler);
    };
    this.shoot = function (playerId) {
        gameProxy.server.shoot(playerId, 1)
    }
    this.moveBody = function (playerId, x, y) {
        gameProxy.server.moveBody(playerId, x, y)
    }
    this.changeBodyDirection = function (playerId, dx, dy) {
        gameProxy.server.changeBodyDirection(playerId, dx, dy)
    }
}