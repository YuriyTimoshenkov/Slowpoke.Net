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
    
    
    this.run = function () {
        serverProxy.run(function () {
            serverProxy.loadPlayer(self.handleLoadPlayer, self.errorHandler)
        }, self.errorHandler)
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

        self.gameWorldManager.init(self.player.Id, self.serverFramesQueue)
        viewManager.setTarget(self.gameWorldManager.player)

        controlsManager.addMoveUpHandler(self.moveUp)
        controlsManager.addMoveDownHandler(self.moveDown)
        controlsManager.addMoveRightHandler(self.moveRight)
        controlsManager.addMoveLeftHandler(self.moveLeft)
        controlsManager.addShootHandler(self.shoot)
        controlsManager.addMouseMoveHandler(self.handleMouseMove)
        controlsManager.addChangeWeaponHandler(self.changeWeapon)

        // Start listening server
        setInterval(function () { self.getFrameFromServer() }, serverRequestFPS)

        // Start game loop
        setInterval(function () { self.loop() }, updateFPS)
    }

    this.errorHandler = function (error) {
        console.log(error)
    }
}

Game.prototype = {
    loop: function () {
        this.gameWorldManager.updateWorld()
        this.viewManager.render(this.gameWorldManager.getCurrentFrame())
        console.log("--------------------------------------");
    },

    getFrameFromServer: function () {
        var self = this
        this.serverProxy.getActiveBodies(function (obj) {
            self.serverFramesQueue.push(obj);
        }, function (error) { console.log("Oppa" + error) });
    }
};

