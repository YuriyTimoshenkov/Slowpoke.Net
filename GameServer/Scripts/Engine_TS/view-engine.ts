/// <reference path="../typings/easeljs/easeljs.d.ts" />

class ViewEngine {
    bodyImages: BodyImage[];
    stage: createjs.Stage;
    viewBodyFactory: ViewBodyFactory;
    baseRotationVector: Vector;
    targetBody: Body;
    targetBodyImage: any;
    menu: any;
    mechanicEngine: MechanicEngineTS;

    constructor(canvas, canvasSize, menu, gameContext, viewBodyFactory: ViewBodyFactory) {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        this.stage = new createjs.Stage(canvas);
        this.viewBodyFactory = viewBodyFactory;
        this.bodyImages = [];
        this.baseRotationVector = new Vector(0, -1);
    }

    init(mechanicEngine: MechanicEngineTS) {
        var self = this;
        this.mechanicEngine = mechanicEngine;

        mechanicEngine.onBodyAdd.push(function (body) {
            var image = self.viewBodyFactory.createGameObjectbyServerBody(body);
            self.bodyImages.push(new BodyImage(body.id, image));

            if (self.targetBody != undefined) {
                self.updateBodyPosition(body);
            }

            if (body instanceof ActiveBody) {
                self.updateImageDirection(body.direction, image);
            }

            self.stage.addChild(image);
        });

        mechanicEngine.onBodyChanged.push(function (body, changesType) {

            var bodyImage = self.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;

            switch (changesType) {
                case BodyChangesType.direction:
                    {
                        if (body instanceof ActiveBody) {
                            self.updateImageDirection(body.direction, bodyImage);
                        }

                        break;
                    }
                case BodyChangesType.position:
                    {
                        if (self.targetBody.id == body.id) {
                            self.updateCanvasPosition(self.mechanicEngine.bodies);
                        }
                        else {

                            self.updateBodyPosition(body);
                        }

                        break;
                    }
                default:
                    break;
            }

        });

        mechanicEngine.onBodyRemove.push(function (body) {
            var childImageToRemove: any[] = [];

            self.bodyImages = self.bodyImages.filter(function (v) {
                if (v.id === body.id) {
                    childImageToRemove.push(v.image);

                    return false;
                }
                else
                    return true;
            });

            if (childImageToRemove !== undefined) {

                childImageToRemove.forEach(function (item) { 
                    self.stage.removeChild(item);
                });
            }
        });
    }

    render(bodies) {
        this.updateMenu();
        this.draw();
    }

    updateCanvasPosition(bodies) {
        var self = this;

        // Update objects
        this.mechanicEngine.bodies.forEach(function (body) {
            if (body.id !== self.targetBody.id) {
                self.updateBodyPosition(body);
            }
        })

        this.mechanicEngine.passiveBodies.forEach(function (body) {
            if (body.id !== self.targetBody.id) {
                self.updateBodyPosition(body);
            }
        })
    }

    updateBodyPosition(body: Body) {
        var self = this;

        var bodyImage = this.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;

        if (bodyImage !== undefined) {
            var dx = this.targetBody.gameRect.centerx - body.gameRect.centerx;
            var dy = this.targetBody.gameRect.centery - body.gameRect.centery;

            bodyImage.x = this.targetBodyImage.x - dx;
            bodyImage.y = this.targetBodyImage.y - dy;

            // Update objectMenu for NPCAI only
            //if (obj.serverBody.BodyType === "NPCAI") {
            //    obj.objectMenu.x = self.target.image.x - dx;
            //    obj.objectMenu.y = self.target.image.y - dy;
            //}
        }
    }


    draw() {
        var self = this;

        var sortFunction = function (a: createjs.Container, b: createjs.Container) {
            
            if (a.zIndex < b.zIndex) return -1;
            if (a.zIndex > b.zIndex) return 1;
            return 0;
        }
        self.stage.sortChildren(sortFunction);

        self.stage.update();
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
    image: createjs.Container;
    constructor(id, image) {
        this.id = id;
        this.image = image;
    }
}