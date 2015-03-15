/**
 * Created by dimapct on 12.02.2015.
 */

function Game(worldWidth, worldHeight, player, cellSize, fps, gameProxy) {
    this.width = worldWidth; // cells in a row
    this.height = worldHeight; // cells in a column
    this.player = player;
    this.cellSize = cellSize;
    this.gameProxy = gameProxy;
    this.fps = fps;
    this.serverFramesQueue = [];

    // Configure canvas
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.setGameScreenSize();

    // Create world
    this.world = new World(worldWidth, worldHeight, cellSize);

    // Create empty player object
    var playerObject = { "Id": player.Id, "ActiveBodyType": "PlayerBody" };
    this.world.createGameObject(playerObject);
    this.frameManager = new FrameManager(this.world.allGameObjects[0], this.world);

    this.keyPressedHandler = new KeyPressedHandler();
    this.keyPressed = this.keyPressedHandler.keyPressed;

    this.assignEventHadlers()

}

Game.prototype = {
    loop: function () {
        this.update();
        this.draw();
        console.log("--------------------------------------");
    },

    update: function () {
        this.processInput();
        this.prepareNextFrame();
        console.log("Frames in queue: " + this.serverFramesQueue.length)
    },

    draw: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frameManager.draw(this.context)
    },

    setGameScreenSize: function () {
        var width = $(document).width();
        var height = $(document).height();
        console.log(777)
        console.log(width + " " + height)
        console.log(777)
        this.canvas.width = width;
        this.canvas.height = height;
    },

    getFrameFromServer: function () {
        var self = this;
        this.gameProxy.server.getActiveBodies(self.player.Id).done(function(obj) {
            self.serverFramesQueue.push(obj)})
    },

    sendInputData: function () {},

    prepareNextFrame: function () {
        var nextFrame = this.serverFramesQueue.shift();
        if (nextFrame) this.frameManager.processFrame(nextFrame)
        else console.log("No frames in the Queue. Processing prediction.")

    },

    processInput: function () {
        if (this.keyPressed[32]) { // Space
            this.gameProxy.server.shoot(this.player.Id, 1)
        }

        if (this.keyPressed[87]) { // W
            this.moveUp()
        }

        else if (this.keyPressed[68]) { // D
            this.moveRight()
        }

        else if (this.keyPressed[83]) { // S
            this.moveDown()
        }

        else if (this.keyPressed[65]) { // A
            this.moveLeft()
        }

        this.keyPressedHandler.clearAll();
    },

    assignEventHadlers: function (e) {
        var self = this;
        window.onkeydown = function (e) {
            // console.log("Processing keydown event")
            if (e.keyCode in self.keyPressed) {
                self.keyPressed[e.keyCode] = true;
            }
        }
    },

    moveUp: function () {
        this.gameProxy.server.moveBody(this.player.Id, 0, -1);
    },

    moveDown: function () {
        this.gameProxy.server.moveBody(this.player.Id, 0, 1);
    },

    moveLeft: function () {
        this.gameProxy.server.moveBody(this.player.Id, -1, 0);
    },

    moveRight: function () {
        this.gameProxy.server.moveBody(this.player.Id, 1, 0);
    },
};

