function serverProxyFactory() {
    this.createServerProxy = function (url) {
        return new serverProxySignalR(url)
    }
}

function gameBuilder(canvasTagId) {
    var gameContext = new GameContext('initial', 1000/30, 1000/100)
    var serverProxy = new serverProxyFactory().createServerProxy('/')
    var viewM = new viewManagerFactory().createViewManager(canvasTagId, gameContext)
    var controlsM = new controlsManagerFactory().createControlsManager()

    this.buildGame = function () {
        return new Game(gameContext, serverProxy, controlsM, viewM)
    }
}

function controlsManagerFactory() {
    this.createControlsManager = function () {
        var canvas = document.getElementById("canvas");
        return new controlsManager(canvas)
    }
}

function viewManagerFactory() {
    this.createViewManager = function (canvasTagId, gameContext) {
        var canvas = document.getElementById(canvasTagId);
        var canvasSize = { width: $(document).width(), height: $(document).height() }
        var infoboxFactory = new InfoboxFactory(canvas);
        var viewBodyFactory = new ViewBodyFactory();
        var bodyImageFactory = new BodyImageFactory(viewBodyFactory);
        return new ViewEngine(canvas, canvasSize, infoboxFactory, gameContext, bodyImageFactory);
    }
}

function gameWorldManagerFactory() {
    this.createGameWorldManager = function (serverMap) {
        var world = new World(serverMap)
        return new gameWorldManager(world)
    }
}

function mechanicEngineFactory() {
    this.createMechanicEngine = function (player, serverMap) {
        return new MechanicEngine(player, serverMap)
    }
}