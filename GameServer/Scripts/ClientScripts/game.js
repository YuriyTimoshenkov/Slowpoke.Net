/**
 * Created by dimapct on 12.02.2015.
 */

function Game(worldWidth, worldHeight, player, cellSize, fps, gameProxy) {
    this.width = worldWidth; // cells in a row
    this.height = worldHeight; // cells in a column
    //this.player = player;
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

    // Create empty player object to use in FrameManager
    this.world.createGameObject({ "Id": player.Id, "ActiveBodyType": "PlayerBody", "Direction": { X: 0, Y: 0 }, "Position": { X: 0, Y: 0 } });
    this.player = this.world.allGameObjects[0];
    this.frameManager = new FrameManager(this.player, this.world);

    this.keyPressedHandler = new KeyPressedHandler();
    this.keyPressed = this.keyPressedHandler.keyPressed;

    this.assignInputEventHadlers()
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
        this.gameProxy.server.getActiveBodies(self.player.id).done(function (obj) {
            self.serverFramesQueue.push(obj);
        }).fail(function (error) { console.log("Oppa" + error) });
    },

    sendInputData: function () {},

    prepareNextFrame: function () {
        var nextFrame = this.serverFramesQueue.shift();
        if (nextFrame) this.frameManager.processFrame(nextFrame)
        else console.log("No frames in the Queue. Processing prediction.")

    },

    processInput: function () {
        if (this.keyPressed[32]) { // Space
            this.gameProxy.server.shoot(this.player.id, 1)
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

    moveUp: function () {
        this.gameProxy.server.moveBody(this.player.id, 0, -1);
    },

    moveDown: function () {
        this.gameProxy.server.moveBody(this.player.id, 0, 1);
    },

    moveLeft: function () {
        this.gameProxy.server.moveBody(this.player.id, -1, 0);
    },

    moveRight: function () {
        this.gameProxy.server.moveBody(this.player.id, 1, 0);
    },

    handleMouseMove: function (e) {
        var center = this.player.canvasRect.center;
        var mouse = new Point(e.clientX, e.clientY);
        
        // Get mouse vector
        var mouseVector = new Point(center.x - mouse.x, center.y - mouse.y);
        // Calculate mouse vector length
        var mouseVectorLength = Math.sqrt(Math.pow(mouseVector.x, 2) + Math.pow(mouseVector.y, 2));

        // Normilize mouse vector
        var mouseVectorLengthNorm = new Point(mouseVector.x / mouseVectorLength, mouseVector.y / mouseVectorLength);

        // Get direction vector
        var directionVector = new Point(this.player.canvasRect.centerx + this.player.direction.X,
                                        this.player.canvasRect.centery + this.player.direction.Y);

        // Get vector delta
        console.log(999)
        console.log(mouse)
        console.log(center)

        var dx = Math.round(directionVector.x - mouseVectorLengthNorm.x);
        var dy = Math.round(directionVector.y - mouseVectorLengthNorm.y);

        this.gameProxy.server.changeBodyDirection(this.player.id, dx, dy).fail(function (error) { console.log("yyye" + error)});
        console.log(dx)
        console.log(dy)
        console.log(999)


    }
};

