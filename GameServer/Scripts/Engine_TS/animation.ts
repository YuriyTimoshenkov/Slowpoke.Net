class Animation {
    id: any;
    duration: number;
    creationTime: number;
    parent: any;
    animationInitiator: any;

    constructor(animationInitiator, parent) {
        this.id = animationInitiator.id;
        this.animationInitiator = animationInitiator;
        this.parent = parent;
        this.creationTime = new Date().getTime();
    }

    update(parent: ViewEngine) {

    }

    start() { }

    stop() { }
}

class BodyHitAnimation extends Animation {
    constructor(id, parent) {
        super(id, parent);
        this.duration = 300;
    }

    update(parent: ViewEngine) {
        var now = new Date().getTime();
        if (now - this.creationTime > this.duration) {
            this.stop();
        }
    }

    start() {
        this.animationInitiator.image.filters = [new createjs.ColorFilter(1, 1, 1, 1, 85, 0, 0, 0)];
        this.animationInitiator.image.updateCache();
    }
    stop() {
        var self = this;
        self.parent.animations = self.parent.animations.filter(function (item) { return item.id !== self.id ? true : false });
        self.animationInitiator.image.filters = [];
        self.animationInitiator.image.updateCache();
    }

}