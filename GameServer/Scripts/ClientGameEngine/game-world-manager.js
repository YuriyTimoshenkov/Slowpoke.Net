function gameWorldManager(world) {
    this.world = world
    var self = this;


    this.init = function (В, queue) {
        this.serverFramesQueue = queue;

        this.player = this.world.createGameObject(player)
        self.onObjectStateChanged(this.player, 'add');
    }

    this.updateWorld = function () {
        var frame = this.serverFramesQueue.shift()
        var self = this;

        if (!frame)
            return
    }
}