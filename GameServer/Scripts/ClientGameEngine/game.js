/**
 * Created by dimapct on 12.02.2015.
 */

function Game(gameContext, serverProxy, controlsManager, viewManager) {
    var self = this

    this.serverProxy = serverProxy
    this.gameContext = gameContext
    this.serverFramesQueue = []
    this.controlsManager = controlsManager
    this.viewManager = viewManager
    this.lastUpdateTime = 0;
    this.clock = new Date();
    this.lastServerSync = new Date()
    
    this.run = function () {
        return new Promise(function(resolve, reject) {
            
            console.log("Game STARTED")

            serverProxy.run(self.disconnectedHandler, self.gameOverHandler).then(function () {
                    serverProxy.loadPlayer().then(function(player){
                        self.handleLoadPlayer(player).then(resolve()
                        , reject)
                }, reject)
            },reject)
        })
    }

    this.handleMouseMove = function (e) {
        return self.viewManager.calculatePlayerDirectionVector(new Point(e.clientX, e.clientY))
    }
    
    this.handleLoadPlayer = function (player) {
        return new Promise(function(resolve, reject) {
            self.player = player

            //Load map
            serverProxy.getMap()
                .then(function (map) {
                self.handleLoadMap(map)
                resolve()
                }, reject)
        })
    }

    this.handleLoadMap = function (serverMap) {
        self.gameWorldManager = new gameWorldManagerFactory().createGameWorldManager(serverMap)

        self.gameWorldManager.init(self.player, self.serverFramesQueue)
        viewManager.setTarget(self.gameWorldManager.player)

        controlsManager.addMouseMoveHandler(self.handleMouseMove)

        // Start game loop
        self.clientLoop = setInterval(function () { self.loop() }, self.gameContext.renderLoopTimeout)

        self.gameContext.state = 'playing'

        // Start listening server
        self.getFrameFromServer()
    }

    this.errorHandler = function (error) {
        console.log(error)
    }

    this.reconnectionDialogHandler = function () {
        console.log(error)
    }

    this.gameOverDialogHandler = function () {
        console.log(error)
    }

    this.disconnectedHandler = function () {
        if (self.gameContext.state === 'playing') {
            self.stopGame()
            self.gameContext.state = 'stopped'
            self.reconnectionDialogHandler()
        }
    }

    this.stopGame = function () {
        clearInterval(self.serverLoop)
        clearInterval(self.clientLoop)
        self.serverProxy.stop()
        console.log("Game STOPPED")
    }

    this.gameOverHandler = function (state) {
        self.gameContext.state = 'stopped'
        self.stopGame()
        self.gameOverDialogHandler()
    }

    this.loop = function () {
        self.gameContext.fps = self.calcFPS();
        this.gameWorldManager.updateWorld();
        this.viewManager.render(this.gameWorldManager.getCurrentFrame());
    }

    this.calcFPS = function () {
        var newTime = new Date();
        var deltaTime = newTime - self.lastUpdateTime;
        self.lastUpdateTime = newTime;
        return Math.round(1000 / deltaTime);
    }

    this.processInputEvents = function () {
        self.serverProxy.processInputEvents(self.controlsManager.handleControls());
    }

    this.getFrameFromServer = function () {
        var currentTime = new Date()
        var timeDiff = currentTime - self.lastServerSync

        ///Update ping
        self.gameContext.ping = Math.round(1000 / timeDiff)
        
        if (timeDiff <= self.gameContext.serverLoopTimeout) {
            setTimeout(function () {
                self.getFrameFromServer()
            }, self.gameContext.serverLoopTimeout - timeDiff)
        }
        else {
            self.lastServerSync = new Date()

            this.processInputEvents();
            this.serverProxy.getFrame(function (obj) {
                self.serverFramesQueue.push(obj)
                self.getFrameFromServer()
            }, function (error) { console.log("Oppa" + error) });
    }
}
}

