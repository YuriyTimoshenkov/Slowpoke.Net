/**
 * Created by dimapct on 12.02.2015.
 */

function Game(fps, serverProxy, controlsManager, viewManager) {
    var self = this

    this.serverProxy = serverProxy
    this.fps = fps;
    this.serverFramesQueue = []
    this.controlsManager = controlsManager
    this.viewManager = viewManager
    this.gameState = 'initial'
    this.lastUpdateTime = 0;
    this.clock = new Date();
    
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

    this.moveUp = function () {
        serverProxy.moveBody(0, -1);
    }

    this.moveDown = function () {
        serverProxy.moveBody(0, 1);
    }

    this.moveLeft = function () {
        serverProxy.moveBody(-1, 0);
    }

    this.moveRight = function () {
        serverProxy.moveBody(1, 0);
    }

    this.moveUpRight = function () {
        serverProxy.moveBody(0.707, -0.707);
    }

    this.moveUpLeft = function () {
        serverProxy.moveBody(-0.707, -0.707);
    }

    this.moveDownRight = function () {
        serverProxy.moveBody(0.707, 0.707);
    }

    this.moveDownLeft = function () {
        serverProxy.moveBody(-0.707, 0.707);
    }
    
    this.shoot = function () {
        serverProxy.shoot()
    }

    this.changeWeapon = function () {
        serverProxy.changeWeapon()
    }

    this.handleMouseMove = function (e) {
        var newPlayerDirectionVector = self.viewManager.calculatePlayerDirectionVector(new Point(e.clientX, e.clientY))
        self.serverProxy.changeBodyDirection(newPlayerDirectionVector.x, newPlayerDirectionVector.y)
    }

    this.useHandler = function () {
        serverProxy.use()
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

        controlsManager.addMoveUpHandler(self.moveUp)
        controlsManager.addMoveDownHandler(self.moveDown)
        controlsManager.addMoveRightHandler(self.moveRight)
        controlsManager.addMoveLeftHandler(self.moveLeft)
        controlsManager.addMoveUpLeftHandler(self.moveUpLeft)
        controlsManager.addMoveUpRightHandler(self.moveUpRight)
        controlsManager.addMoveDownLeftHandler(self.moveDownLeft)
        controlsManager.addMoveDownRightHandler(self.moveDownRight)
        controlsManager.addShootHandler(self.shoot)
        controlsManager.addMouseMoveHandler(self.handleMouseMove)
        controlsManager.addChangeWeaponHandler(self.changeWeapon)
        controlsManager.addUseHandler(self.useHandler)

        // Start listening server
        self.serverLoop = setInterval(function () { self.getFrameFromServer() }, serverRequestFPS)

        // Start game loop
        self.clientLoop = setInterval(function () { self.loop() }, updateFPS)

        self.gameState = 'playing'
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
        if (self.gameState === 'playing') {
            self.stopGame()
            self.gameState = 'stopped'
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
        self.gameState = 'stopped'
        self.stopGame()
        self.gameOverDialogHandler()
    }


    //d4a84fad-6329-4760-8248-a7431f100c5d
    //c055a991-5301-47d6-8192-1b0d2908418f

    this.loop = function () {
        var newTime = new Date();
        var deltaTime = newTime - this.lastUpdateTime;
        this.lastUpdateTime = newTime;
        var fps = Math.round(1000 / deltaTime);
        this.gameWorldManager.updateWorld();
        this.controlsManager.handleControls();
        this.viewManager.render(this.gameWorldManager.getCurrentFrame(), fps);
    }

    this.getFrameFromServer = function () {
        var self = this
        this.serverProxy.getFrame(function (obj) {
            self.serverFramesQueue.push(obj);
        }, function (error) { console.log("Oppa" + error) });
    }
}

