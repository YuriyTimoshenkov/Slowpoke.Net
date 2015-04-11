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
    
    
    this.run = function () {
        console.log("Game STARTED")
        serverProxy.run(function () {
            serverProxy.loadPlayer(self.handleLoadPlayer, self.errorHandler)
        }, self.errorHandler, self.disconnectedHandler, self.gameOverHandler)
        
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

    this.handleLoadPlayer = function (player) {
        self.player = player

        //Load map
        serverProxy.getMap(self.handleLoadMap, self.errorHandler)   
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
}

Game.prototype = {
    loop: function () {
        this.gameWorldManager.updateWorld();
        this.controlsManager.handleControls();
        this.viewManager.render(this.gameWorldManager.getCurrentFrame());
    },

    getFrameFromServer: function () {
        var self = this
        this.serverProxy.getFrame(function (obj) {
            self.serverFramesQueue.push(obj);
        }, function (error) { console.log("Oppa" + error) });
    }
};

