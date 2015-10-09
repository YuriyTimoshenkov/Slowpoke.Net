class Menu {
    performanceInfobox: PerformanceInfoboxFixed;
    gameContext;
    stage: createjs.Stage;
    canvas: any;

    constructor(gameContext, stage, canvas) {
        this.gameContext = gameContext;
        this.stage = stage;
        this.canvas = canvas;
    }

    init() {
        this.performanceInfobox = new PerformanceInfoboxFixed(this.gameContext, new Point(this.canvas.width - 80, this.canvas.height - 50));
        this.performanceInfobox.addSelfToContainer(this.stage);
    }

    update() {
        this.performanceInfobox.update();
    }
}