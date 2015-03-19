function serverProxyFactory() {
    this.createServerProxy = function (url) {
        return new serverProxySignalR(url)
    }
}

function gameBuilder() {
    var proxyFactory = new serverProxyFactory().createServerProxy('/')
    var sProxy = new serverProxyFactory().createServerProxy('/')
    var cManager = new controlsManager();

    this.buildGame = function () {
        return new Game(worldWidth, worldHeight, 50, updateFPS, sProxy, cManager)
    }
}