/// <reference path="../typings/easeljs/easeljs.d.ts" />

class ViewEngine {
    bodyImages: BodyImage[];
    mapImageContainer: createjs.Container;
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
        this.mapImageContainer = new createjs.Container();
        this.stage.addChild(this.mapImageContainer);

        mechanicEngine.onBodyAdd.push(function (body) {
            var image = self.viewBodyFactory.createGameObjectbyServerBody(body);
            self.bodyImages.push(new BodyImage(body.id, image));

            if (body instanceof Tile) {
                image.x = body.gameRect.centerx;
                image.y = body.gameRect.centery;
                self.mapImageContainer.addChild(image);
            }

            else {
                if (self.targetBody != undefined) {
                    self.updateBodyPosition(body);
                }

                if (body instanceof ActiveBody) {
                    self.updateImageDirection(body.direction, image);
                }

                self.stage.addChild(image);
            }
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
                if(body instanceof Tile) {
                    self.mapImageContainer.removeChild(childImageToRemove);
                }
                else {
                    self.stage.removeChild(childImageToRemove);
                }
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
        self.mechanicEngine.bodies.forEach(function (body) {
            if (body.id !== self.targetBody.id) {
                self.updateBodyPosition(body);
            }
        })

        self.mechanicEngine.passiveBodies.forEach(function (body) {
            if (!(body instanceof Tile)) {
                self.updateBodyPosition(body);    
            }
        })

        self.updateMapImagePosition();
    }

    updateBodyPosition(body: Body) {
        var self = this;

        var bodyImage = self.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;

        if (bodyImage !== undefined) {
            var dx = self.targetBody.gameRect.centerx - body.gameRect.centerx;
            var dy = self.targetBody.gameRect.centery - body.gameRect.centery;

            bodyImage.x = self.targetBodyImage.x - dx;
            bodyImage.y = self.targetBodyImage.y - dy;

            // Update objectMenu for NPCAI only
            //if (obj.serverBody.BodyType === "NPCAI") {
            //    obj.objectMenu.x = self.target.image.x - dx;
            //    obj.objectMenu.y = self.target.image.y - dy;
            //}
        }
    }

    updateMapImagePosition() {
        var self = this;
        this.mapImageContainer.regX = this.targetBody.gameRect.centerx - this.targetBodyImage.x;
        this.mapImageContainer.regY = this.targetBody.gameRect.centery - this.targetBodyImage.y;
    }

    draw() {
        var self = this;
        var sortFunction = function (a: createjs.Container, b: createjs.Container) {
            //if (a.zIndex === undefined || b.zIndex === undefined) {
            //    console.log("In sort function");
            //}
            
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
        // Small Kostil - we need to recalculate map image coordinates at the very beginning
        this.updateMapImagePosition();
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