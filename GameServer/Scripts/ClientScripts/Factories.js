function serverProxyFactory() {
    this.createServerProxy = function (url) {
        return new serverProxySignalR(url)
    }
}

function gameBuilder() {
    var serverProxy = new serverProxyFactory().createServerProxy('/')
    var viewM = new viewManagerFactory().createViewManager()
    //var gameWorldM = new gameWorldManagerFactory().createGameWorldManager()
    var controlsM = new controlsManagerFactory().createControlsManager()

    this.buildGame = function () {
        return new Game(updateFPS, serverProxy, controlsM, viewM)
    }
}

function controlsManagerFactory() {
    this.createControlsManager = function () {
        var canvas = document.getElementById("canvas");
        return new controlsManager(canvas)
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
    this.createGameWorldManager = function (serverMap) {
        var world = new World(serverMap)
        return new gameWorldManager(world)
    }
}