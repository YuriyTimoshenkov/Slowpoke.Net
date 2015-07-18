

class ViewEngine {
    bodyImages: any[];
    stage: createjs.Stage;
    viewBodyFactory: ViewBodyFactory;
    baseRotationVector: Vector;
    targetBody: any;
    targetBodyImage: any;
    menu: any;
    mechanicEngine: MechanicEngineTS;
    //render: (bodies) => void;

    constructor(canvas, canvasSize, menu, gameContext, viewBodyFactory: ViewBodyFactory) {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        this.stage = new createjs.Stage(canvas);
        this.viewBodyFactory = viewBodyFactory;
        this.bodyImages = [];
        this.baseRotationVector = new Vector(0, -1);

        //this.render = (bodies) => {
        //    this.renderInternal(bodies, this);
        //};
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

    render(bodies) {
        this.updateCanvasPosition(bodies);
        this.updateMenu();
        this.draw();

    }

    //renderInternal(bodies) {
    //    self.updateCanvasPosition(bodies, self);
    //    self.updateMenu();
    //    self.draw(self);
    //}

    updateCanvasPosition(bodies) {
        var self = this;
        // Update objects
        self.mechanicEngine.bodies.forEach(function (body) {
            if (body.id !== self.targetBody.id) {
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
        })

        self.mechanicEngine.passiveBodies.forEach(function (body) {
            if (body.id !== self.targetBody.id) {
                var bodyImage = self.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0].image;

                if (bodyImage !== undefined) {
                    var dx = self.targetBody.gameRect.centerx - body.gameRect.centerx;
                    var dy = self.targetBody.gameRect.centery - body.gameRect.centery;

                    bodyImage.x = self.targetBodyImage.x - dx - body.gameRect.width / 2;
                    bodyImage.y = self.targetBodyImage.y - dy - body.gameRect.width / 2;
                }
            }
        })
    }

    draw() {
        var self = this;
        var sortFunction = function (a: createjs.Container, b: createjs.Container) {
            //if (a.zIndex === undefined || b.zIndex === undefined) {
            //    console.log("In sort function");
            //}
            
            if (a.zIndex < b.zIndex) return -1;
            if (a.zIndex > b.zIndex) return 1;
            return -1;
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
    image: any;
    constructor(id, image) {
        this.id = id;
        this.image = image;
    }
}