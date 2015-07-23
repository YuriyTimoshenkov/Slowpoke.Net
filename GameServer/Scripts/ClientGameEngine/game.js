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
        
        self.mechanicEngine = new MechanicEngineTS(serverMap);
        self.viewManager.init(self.mechanicEngine);

        self.mechanicEngine.addPlayerBody(self.player);

        self.viewManager.setTarget(self.mechanicEngine.player)

        controlsManager.addMouseMoveHandler(self.handleMouseMove)

        self.serverBodySynchornizer = new ServerBodySynchornizer(self.mechanicEngine);

        // Start game loop
        self.clientLoop = setInterval(function () { self.loop() }, self.gameContext.renderLoopTimeout)

        self.gameContext.state = 'playing'

        // Start listening server
        self.clientEventData = self.controlsManager.handleControlsCommon();
        self.clientEventData.commands = [];

        self.SyncState = 'free';

        setInterval(function () {
            self.SyncWithServer(self.clientEventData);
        }, self.gameContext.serverLoopTimeout);
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

        //TODO: refactor command creation 
        if (clientEventData.move !== undefined) {
            self.mechanicEngine.addCommand(new CommandMove(
                self.mechanicEngine.player.id,
                new Date().getTime(),
                clientEventData.move.duration,
                clientEventData.move.direction
                ));
        }

        if (clientEventData.changeDirection !== undefined && clientEventData.changeDirection !== null) {
            self.mechanicEngine.addCommand(new CommandChangeDirection(
                self.mechanicEngine.player.id,
                new Date().getTime(),
                clientEventData.changeDirection
                ));
        }

        if (clientEventData.shoot === true) {
            self.mechanicEngine.addCommand(new CommandShoot(
                self.mechanicEngine.player.id,
                new Date().getTime()
                ));
        }

        self.mechanicEngine.update();

        this.viewManager.render();
    }

    this.calcFPS = function () {
        var newTime = new Date();
        var deltaTime = newTime - self.lastUpdateTime;
        self.lastUpdateTime = newTime;
        return Math.round(1000 / deltaTime);
    }

    this.SyncWithServer = function (clientEvents) {

        if (self.SyncState !== undefined && self.SyncState !== 'running') {
            self.SyncState = 'running';

            var currentTime = new Date()
            var timeDiff = currentTime - self.lastServerSync

            ///Update ping
            self.gameContext.ping = Math.round(1000 / timeDiff)
            self.lastServerSync = new Date();

            self.serverProxy.syncState(clientEvents, function (state) {
                //try {
                    self.clientEventData = self.controlsManager.handleControlsCommon();

                    //Process state with new mechanic
                    self.clientEventData.commands = self.serverBodySynchornizer.syncServerFrames(state);//self.mechanicEngine.syncServerFrames(state);

                    self.SyncState = 'free';
                //}
                //catch(ex)
                //{
                //    console.log("Error: " + ex)
                //}
            }, function (error) {
                console.log("Error: " + error)

                self.SyncState = 'free';
            });
        }
    }
}

