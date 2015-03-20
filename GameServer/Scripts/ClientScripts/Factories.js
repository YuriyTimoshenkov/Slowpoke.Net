function serverProxyFactory() {
    this.createServerProxy = function (url) {
        return new serverProxySignalR(url)
    }
}

function gameBuilder() {
    var serverProxy = new serverProxyFactory().createServerProxy('/')
    var viewM = new viewManagerFactory().createViewManager()
    var gameWorldM = new gameWorldManagerFactory().createGameWorldManager()
    var controlsM = new controlsManager()

    this.buildGame = function () {
        return new Game(updateFPS, serverProxy, controlsM, viewM, gameWorldM)
    }
}

function viewManagerFactory() {
    this.createViewManager = function () {
        var canvas = document.getElementById("canvas");
        var canvasSize = { width: $(document).width(), height: $(document).height() }

        return new viewManager(canvas, canvasSize);
    }
}

function gameWorldManagerFactory() {
    this.createGameWorldManager = function () {
        var world = new World(worldWidth, worldHeight, cellSize)
        return new gameWorldManager(world)
    }
}