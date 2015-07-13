class ViewEngine {
    bodyImages: any[];
    stage: createjs.Stage;
    viewBodyFactory: ViewBodyFactory;
    baseRotationVector: Vector;
    targetBody: any;
    targetBodyImage: any;
    menu: any;
    mechanicEngine: MechanicEngineTS;

    constructor(canvas, canvasSize, menu, gameContext,) {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        this.stage = new createjs.Stage(canvas);
        this.viewBodyFactory = new ViewBodyFactory();
        this.bodyImages = [];
        this.baseRotationVector = new Vector(0, -1);
    }

    init(mechanicEngine) {
        var self = this;
        this.mechanicEngine = mechanicEngine;
        mechanicEngine.onBodyAdd.push(function (body) {
            var image = self.viewBodyFactory.createGameObjectbyServerBody(body);
            self.bodyImages.push(new BodyImage(body.id, image));

            if (body.direction !== undefined) {
                self.updateImageDirection(body.direction, image);
            }

            self.stage.addChild(image);
        });
        mechanicEngine.onBodyChanged.push(function (body, changesType) {
            switch (changesType) {
                case 0:
                    {
                        var bodyImage = self.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;

                        self.updateImageDirection(body.direction, bodyImage);

                        break;
                    }
                default:
                    break;
            }

        });
        mechanicEngine.onBodyRemove.push(function (body) {
            var childImageToRemove;
            self.bodyImages = self.bodyImages.filter(function (v) {
                if (v.id === body.id) {
                    childImageToRemove = v.image;

                    return false;
                }
                else
                    return true;
            });

            if (childImageToRemove !== undefined) {
                self.stage.removeChild(childImageToRemove);
            }
        });
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

    updateImageDirection(newDirection: Vector, image: any) {
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

class BodyImage {
    id: any;
    image: any;
    constructor(id, image) {
        this.id = id;
        this.image = image;
    }
}