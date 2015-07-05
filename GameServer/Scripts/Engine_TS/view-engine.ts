class ViewEngine {
    bodyImages: any[];
    stage: createjs.Stage;
    viewBodyFactory: ViewBodyFactory;
    baseRotationVector: Vector;
    targetBody: any;
    targetBodyImage: any;
    menu: any;

    constructor(canvas, canvasSize, menu, gameContext) {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        this.stage = new createjs.Stage(canvas);
        this.viewBodyFactory = new ViewBodyFactory();
        this.bodyImages = [];
        this.baseRotationVector = new Vector(0, -1);
    }

    render(objects, cells=[]) {
        this.updateCanvasPosition(objects, cells);
        this.updateMenu();
        this.draw();
    }

    updateCanvasPosition(objects, cells) { }
    draw() {
        this.stage.update();
    }

    updateMenu() { }

    updateImageDirection(newDirection, image) {
        var rotationDeltaRad = Math.acos(this.baseRotationVector.product(newDirection) /
            this.baseRotationVector.length() * newDirection.length());

        var rotationDeltaDegree = rotationDeltaRad * (180 / Math.PI);

        // To check rotation direction
        var centerX = image.x;
        var mouseX = centerX + newDirection.x;

        // Clockwise
        if (mouseX >= centerX) {
            image.rotation = rotationDeltaDegree;
        }// Counter-clockwise
        else {
            image.rotation = 360 - rotationDeltaDegree;
        }
    }

    calculatePlayerDirectionVector(mousePoint) {
        var playerCenter = new Point(this.targetBodyImage.x, this.targetBodyImage.y);

        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Vector(Math.round(mousePoint.x - playerCenter.x), Math.round(mousePoint.y - playerCenter.y));
        return mouseVectorNotNormalized;
    }

    setTarget(body) {
        this.targetBody = body;
        this.targetBodyImage = this.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;
    }

}   
