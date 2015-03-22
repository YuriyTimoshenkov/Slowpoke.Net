/**
 * Created by dimapct on 12.02.2015.
 */

function Game(fps, serverProxy, controlsManager, viewManager, gameWorldManager) {
    var self = this

    this.serverProxy = serverProxy
    this.fps = fps;
    this.serverFramesQueue = []
    this.controlsManager = controlsManager
    this.viewManager = viewManager
    this.gameWorldManager = gameWorldManager
    
    
    this.run = function () {
        serverProxy.run(function () {
            serverProxy.loadPlayer(self.loadPlayer, self.errorHandler)
        }, self.errorHandler)
    }

    this.moveUp = function () {
        serverProxy.moveBody(self.player.Id, 0, -1);
    }

    this.moveDown = function () {
        serverProxy.moveBody(self.player.Id, 0, 1);
    }

    this.moveLeft = function () {
        serverProxy.moveBody(self.player.Id, -1, 0);
    }

    this.moveRight = function () {
        serverProxy.moveBody(self.player.Id, 1, 0);
    }

    this.loadPlayer = function (player) {
        self.player = player

        gameWorldManager.init(player.Id, self.serverFramesQueue)
        viewManager.setTarget(gameWorldManager.player);

        controlsManager.addMoveUpHandler(self.moveUp);
        controlsManager.addMoveDownHandler(self.moveDown);
        controlsManager.addMoveRightHandler(self.moveRight);
        controlsManager.addMoveLeftHandler(self.moveLeft);
        controlsManager.addShootHandler(function () {
            serverProxy.shoot(self.player.Id, 1)
        });
        controlsManager.addMouseMoveHandler(self.handleMouseMove)

        // Start listening server
        setInterval(function () { self.getFrameFromServer() }, serverRequestFPS)

        // Start game loop
        setInterval(function () { self.loop() }, updateFPS)

    }

    this.errorHandler = function (error) {
        console.log(error)
    }

    this.handleMouseMove = function (e) {
        var newPlayerDirectionVector = self.viewManager.calculatePlayerDirectionVector(new Point(e.clientX, e.clientY))
        self.serverProxy.changeBodyDirection(self.player.Id, newPlayerDirectionVector.x, newPlayerDirectionVector.y);
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
        this.serverProxy.getActiveBodies(this.player.Id, function (obj) {
            self.serverFramesQueue.push(obj);
        }, function (error) { console.log("Oppa" + error) });
    },

    //assignInputEventHadlers: function () {
    //    var self = this;
    //    window.onkeydown = function (e) {
    //        // console.log("Processing keydown event")
    //        if (e.keyCode in self.keyPressed) {
    //            self.keyPressed[e.keyCode] = true;
    //        }
    //    }

    //    this.canvas.onmousemove = function (e) { self.handleMouseMove(e) }
    //},


};

