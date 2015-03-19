/**
 * Created by dimapct on 12.02.2015.
 */

function Game(worldWidth, worldHeight, cellSize, fps, serverProxy, cManager) {
    self = this
    this.width = worldWidth // cells in a row
    this.height = worldHeight;// cells in a column
    //this.player = player;
    this.cellSize = cellSize
    this.serverProxy = serverProxy
    this.fps = fps;
    this.serverFramesQueue = []
    this.controlsManager = cManager;

    // Configure canvas
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.setGameScreenSize()

    // Create world
    this.world = new World(worldWidth, worldHeight, cellSize)

    this.run = function () {
        self.serverProxy.run(function () {
            self.serverProxy.loadPlayer(self.loadPlayer, self.errorHandler)
        }, self.errorHandler)
    }

    this.moveUp = function () {
        self.serverProxy.moveBody(self.player.id, 0, -1);
    }

    this.moveDown = function () {
        self.serverProxy.moveBody(self.player.id, 0, 1);
    }

    this.moveLeft = function () {
        self.serverProxy.moveBody(self.player.id, -1, 0);
    }

    this.moveRight = function () {
        self.serverProxy.moveBody(self.player.id, 1, 0);
    }

    this.loadPlayer = function (player) {
        self.player = player

        // Create empty player object to use in FrameManager
        self.world.createGameObject({ "Id": player.Id, "ActiveBodyType": "PlayerBody", "Direction": { X: 0, Y: 0 }, "Position": { X: 0, Y: 0 } })
        self.player = self.world.allGameObjects[0]
        self.frameManager = new FrameManager(self.player, self.world)

        //self.keyPressedHandler = new KeyPressedHandler()
        //self.keyPressed = self.keyPressedHandler.keyPressed

        //self.assignInputEventHadlers()
        self.controlsManager.addMoveUpHandler(self.moveUp);
        self.controlsManager.addMoveDownHandler(self.moveDown);
        self.controlsManager.addMoveRightHandler(self.moveRight);
        self.controlsManager.addMoveLeftHandler(self.moveLeft);
        self.controlsManager.addShootHandler(function () {
            self.serverProxy.shoot(self.player.id, 1)
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
        this.update();
        this.draw();
        console.log("--------------------------------------");
    },

    update: function () {
        //this.processInput();
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
        this.serverProxy.getActiveBodies(self.player.id, function (obj) {
            self.serverFramesQueue.push(obj);
        }, function (error) { console.log("Oppa" + error) });
    },

    sendInputData: function () {},

    prepareNextFrame: function () {
        var nextFrame = this.serverFramesQueue.shift();
        if (nextFrame) this.frameManager.processFrame(nextFrame)
        else console.log("No frames in the Queue. Processing prediction.")

    },

    //processInput: function () {
    //    if (this.keyPressed[32]) { // Space
    //        this.serverProxy.shoot(this.player.id, 1)
    //    }

    //    if (this.keyPressed[87]) { // W
    //        this.moveUp()
    //    }

    //    else if (this.keyPressed[68]) { // D
    //        this.moveRight()
    //    }

    //    else if (this.keyPressed[83]) { // S
    //        this.moveDown()
    //    }

    //    else if (this.keyPressed[65]) { // A
    //        this.moveLeft()
    //    }

    //    this.keyPressedHandler.clearAll();
    //},

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

