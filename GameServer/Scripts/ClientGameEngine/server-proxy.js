
function serverProxySignalR(url) {
    var gameProxy = $.connection.slowpokeHub;

    gameProxy.client.SomeMethod = function () { }

    this.run = function (disconnectedHandler, playerStateChangedHandler) {
        return new Promise(function(resolve, reject) {
            gameProxy.client.playerStateChanged = playerStateChangedHandler

            $.connection.hub.disconnected(disconnectedHandler);


            $.connection.hub.start().done(resolve)
            .fail(reject)
        })
    }

    this.loadGame = function () {
        return new Promise(function (resolve, reject) {
            gameProxy.server.loadGame().done(resolve).fail(reject);
        })
    }
    this.syncState = function (inputData, doneHandler, failHandler) {
        gameProxy.server.syncState(inputData).done(doneHandler).fail(failHandler);
    };
    this.changeWeapon = function () {
        gameProxy.server.changeWeapon()
    }
    this.moveBody = function (x, y, duration) {
        if (duration > 0) {
            gameProxy.server.moveBody(x, y, duration)
        }
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
    this.use = function () {
        gameProxy.server.use()
    }
}