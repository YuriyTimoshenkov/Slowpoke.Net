/**
 * Created by dimapct on 12.02.2015.
 */

//$.getScript("config.js");
//$.getScript("world.js");
function Game(worldWidth, worldHeight, player, cellSize, fps, gameProxy) {
    this.width = worldWidth; // cells in a row
    this.height = worldHeight; // cells in a column
    this.player = player;
    this.cellSize = cellSize;
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.setGameScreenSize();
    this.world = new World(worldWidth, worldHeight, cellSize);
    this.fps = fps;
    this.serverFramesQueue = [];
    this.world.createGameObject({"Id": player.Id, "type": "player"});
    //console.log(4445);
    //console.log(this.world[player.Id]);
    //console.log(4445);
    this.frameManager = new FrameManager(this.world.allGameObjects[player.Id], this.world);
    this.gameProxy = gameProxy;
}

Game.prototype = {
    loop: function () {
        this.update();
        this.draw();
    },

    update: function () {
        this.prepareNextFrame();
        this.sendInputData();
        //this.gameProxy.server.moveBody(this.player.Id);
        console.log(this.serverFramesQueue.length)
    },

    draw: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.frameManager.draw(this.context)
    },

    setGameScreenSize: function () {
        var width = $(window).width();
        var height = $(window).height();
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
        if (nextFrame) this.frameManager.processFrame(nextFrame);
        else console.log("No frames in the Queue. Processing prediction.")
    }
};

