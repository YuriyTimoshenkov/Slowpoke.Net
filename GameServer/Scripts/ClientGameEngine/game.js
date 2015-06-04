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
        
        self.mechanicEngine = new mechanicEngineFactory().createMechanicEngine(self.player, serverMap);
        self.viewManager.init(self.mechanicEngine);

        viewManager.setTarget(self.mechanicEngine.player)

        controlsManager.addMouseMoveHandler(self.handleMouseMove)

        // Start game loop
        self.clientLoop = setInterval(function () { self.loop() }, self.gameContext.renderLoopTimeout)

        self.gameContext.state = 'playing'

        // Start listening server
        var clientEventData = self.controlsManager.handleControlsCommon();
        clientEventData.commands = [];

        self.syncState(clientEventData);
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

        var clientEventData = self.controlsManager.handleControlsMove();

        if (clientEventData.move !== undefined) {
            self.mechanicEngine.addCommand(new CommandMove(
                self.mechanicEngine.player.Id,
                clientEventData.move.duration,
                clientEventData.move.direction
                ));
        }

        if (clientEventData.changeDirection !== undefined) {
            self.mechanicEngine.addCommand(new CommandChangeDirection(
                self.mechanicEngine.player.Id,
                clientEventData.changeDirection
                ));
        }

        self.mechanicEngine.update();

        this.viewManager.render(this.mechanicEngine.bodies, this.mechanicEngine.mapEngine.cells);
    }

    this.calcFPS = function () {
        var newTime = new Date();
        var deltaTime = newTime - self.lastUpdateTime;
        self.lastUpdateTime = newTime;
        return Math.round(1000 / deltaTime);
    }

    this.syncState = function (clientEvents) {
        var currentTime = new Date()
        var timeDiff = currentTime - self.lastServerSync

        ///Update ping
        self.gameContext.ping = Math.round(1000 / timeDiff)
        
        //Call later if needed
        if (timeDiff <= self.gameContext.serverLoopTimeout) {
            setTimeout(function () {
                self.syncState(clientEvents)
            }, self.gameContext.serverLoopTimeout - timeDiff)
        }
        else {
            self.lastServerSync = new Date()

            this.serverProxy.syncState(clientEvents, function (state) {
//                try {
                    var clientEventData = self.controlsManager.handleControlsCommon();

                    //Process state with new mechanic
                    clientEventData.commands = self.mechanicEngine.syncServerFrames(state);

                    self.syncState(clientEventData);
                //}
                //catch(ex)
                //{
                //    console.log("Error: " + ex)
                //}
            }, function (error) {
                console.log("Error: " + error)

                self.syncState(clientEvents);
            });
    }
}
}

