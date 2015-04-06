function serverProxyPrototype(url) {
    this.run = function (doneHandler, failHandler) {
    }

    this.loadPlayer = function (doneHandler, failHandler) {
    }

    this.getActiveBodies = function (doneHandler, failHandler) {
    };

    this.shoot = function (weaponNumber) {
    }

    this.moveBody = function (x, y) {
    }

    this.changeBodyDirection = function (dx, dy) {
    }

    this.stop = function () {}
}

function serverProxySignalR(url) {
    var gameProxy = $.connection.slowpokeHub;

    gameProxy.client.SomeMethod = function () { }

    this.run = function (doneHandler, failHandler, disconnectedHandler, playerStateChangedHandler) {
        gameProxy.client.playerStateChanged = playerStateChangedHandler

        $.connection.hub.disconnected(disconnectedHandler);


        $.connection.hub.start().done(doneHandler)
        .fail(failHandler)
    }

    this.loadPlayer = function (doneHandler, failHandler) {
        gameProxy.server.loadPlayer().done(doneHandler).fail(failHandler);
    }
    this.getActiveBodies = function (doneHandler, failHandler) {
        gameProxy.server.getActiveBodies().done(doneHandler).fail(failHandler);
    };
    this.getMap = function (doneHandler, failHandler) {
        gameProxy.server.getMap().done(doneHandler).fail(failHandler);
    };
    this.changeWeapon = function () {
        gameProxy.server.changeWeapon()
    }
    this.moveBody = function (x, y) {
        gameProxy.server.moveBody(x, y)
    }
    this.changeBodyDirection = function (dx, dy) {
        gameProxy.server.changeBodyDirection(dx, dy)
    }
    this.shoot = function (weaponNumber) {
        gameProxy.server.shoot()
    }
    this.stop = function () {
        $.connection.hub.stop()
    }
}