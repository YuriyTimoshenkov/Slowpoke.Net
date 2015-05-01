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

    this.moveUp = function (t) {
        serverProxy.moveBody(0, -1, t);
    }

    this.moveDown = function (t) {
        serverProxy.moveBody(0, 1, t);
    }

    this.moveLeft = function (t) {
        serverProxy.moveBody(-1, 0, t);
    }

    this.moveRight = function (t) {
        serverProxy.moveBody(1, 0, t);
    }

    this.moveUpRight = function (t) {
        serverProxy.moveBody(0.707, -0.707, t);
    }

    this.moveUpLeft = function (t) {
        serverProxy.moveBody(-0.707, -0.707, t);
    }

    this.moveDownRight = function (t) {
        serverProxy.moveBody(0.707, 0.707, t);
    }

    this.moveDownLeft = function (t) {
        serverProxy.moveBody(-0.707, 0.707, t);
    }
    
    this.shoot = function () {
        serverProxy.shoot()
    }

    this.changeWeapon = function () {
        serverProxy.changeWeapon()
    }

    this.handleMouseMove = function (e) {
        return self.viewManager.calculatePlayerDirectionVector(new Point(e.clientX, e.clientY))
    }

    this.useHandler = function () {
        serverProxy.use()
    }

    this.changeDirHandler = function (newDirection) {
        self.serverProxy.changeBodyDirection(newDirection.x, newDirection.y)
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
        controlsManager.addChangeDirectionHandler(self.changeDirHandler)

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

    this.loop = function () {
        var fps = self.calcFPS();
        this.gameWorldManager.updateWorld();
        this.controlsManager.handleControls();
        this.viewManager.render(this.gameWorldManager.getCurrentFrame(), fps);
    }

    this.calcFPS = function () {
        var newTime = new Date();
        var deltaTime = newTime - this.lastUpdateTime;
        this.lastUpdateTime = newTime;
        return Math.round(1000 / deltaTime);
    }

    this.handleControls = function () {
        // Handle keyboard
        this.controlsManager.handleControls();
        // Handle mouse move
        var newDirection = self.controlsManager.lastMouseMove;
        if (newDirection != null) {
            self.serverProxy.changeBodyDirection(newDirection.x, newDirection.y)
            self.controlsManager.nullifyLastMouseMove();
        }
    }

    this.getFrameFromServer = function () {
        var self = this
        this.serverProxy.getFrame(function (obj) {
            self.serverFramesQueue.push(obj);
        }, function (error) { console.log("Oppa" + error) });
    }
}

