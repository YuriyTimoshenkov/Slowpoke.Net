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
        this.performanceInfobox = new PerformanceInfoboxFixed(this.gameContext, this.stage, new Point(this.canvas.width - 80, this.canvas.height - 50));
    }

    update() {
        this.performanceInfobox.updateAll();
    }
}