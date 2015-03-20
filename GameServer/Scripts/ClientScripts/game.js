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
        this.serverProxy.getActiveBodies(this.player.Id, function (obj) {
            self.serverFramesQueue.push(obj);
        }, function (error) { console.log("Oppa" + error) });
    },

    assignInputEventHadlers: function () {
        var self = this;
        window.onkeydown = function (e) {
            // console.log("Processing keydown event")
            if (e.keyCode in self.keyPressed) {
                self.keyPressed[e.keyCode] = true;
            }
        }

        this.canvas.onmousemove = function (e) { self.handleMouseMove(e) }
    },

   

    handleMouseMove: function (e) {
        var center = this.player.canvasRect.center;
        var mouse = new Point(e.clientX, e.clientY);
        

        console.log(999)
        console.log(mouse)
        console.log(center)


        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Point(center.x - mouse.x, center.y - mouse.y);
        console.log(mouseVectorNotNormalized)

        // Calculate mouse vector length
        var mouseVectorLength = Math.sqrt(Math.pow(mouseVectorNotNormalized.x, 2) + Math.pow(mouseVectorNotNormalized.y, 2));
        console.log(mouseVectorLength)

        // Normalize mouse vector
        var mouseVectorNormalized = new Point(mouseVectorNotNormalized.x / mouseVectorLength, mouseVectorNotNormalized.y / mouseVectorLength);
        console.log(mouseVectorNormalized)

        // Get mouse point with distance 1 from center
        var mousePoint = new Point(center.x - mouseVectorNormalized.x, center.y - mouseVectorNormalized.y);

        // Get direction point with distance 1 from center
        var directionPoint = new Point(center.x + this.player.direction.X, center.y + this.player.direction.Y);
        console.log(directionPoint)

        // Get vector delta
        var dx = Math.round(directionPoint.x - mousePoint.x);
        var dy = Math.round(directionPoint.y - mousePoint.y);

        // Request server
        this.serverProxy.changeBodyDirection(this.player.id, dx, dy);
        console.log(dx)
        console.log(dy)
        console.log(999)


    }
};

