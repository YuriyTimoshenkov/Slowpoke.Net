/// <reference path="../typings/easeljs/easeljs.d.ts" />

class ViewEngine {
    bodyImages: BodyImage[];
    mapImageContainer: createjs.Container;
    stage: createjs.Stage;
    viewBodyFactory: ViewBodyFactory;
    baseRotationVector: Vector;
    targetBody: PlayerBody;
    targetBodyImage: createjs.Container;
    menu: Menu;
    mechanicEngine: MechanicEngineTS;
    gameContext: any;
    weaponPoint: Point;
    lifePoint: Point;
    scorePoint: Point;
    fpsPoint: Point;
    pingPoint: Point;

    constructor(canvas, canvasSize, menu: Menu, gameContext, viewBodyFactory: ViewBodyFactory) {
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        this.stage = new createjs.Stage(canvas);
        this.menu = menu;
        this.gameContext = gameContext;
        this.viewBodyFactory = viewBodyFactory;
        this.bodyImages = [];
        this.baseRotationVector = new Vector(0, -1);
        this.initMenu(canvas);
    }

    init(mechanicEngine: MechanicEngineTS) {
        var self = this;
        this.mechanicEngine = mechanicEngine;
        this.mapImageContainer = this.viewBodyFactory.createMapContainer();
        this.stage.removeAllChildren(); 
        this.stage.addChild(this.mapImageContainer);
        this.bodyImages = [];
        this.targetBody = undefined;

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
                self.stage.sortChildren(function (a: createjs.Container, b: createjs.Container) {
                                               if (a.zIndex < b.zIndex) return -1;
                                               if (a.zIndex > b.zIndex) return 1;
                                              return 0;
                                 });
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
                if(body instanceof Tile) {
                        childImageToRemove.forEach(function (item) {
                        self.mapImageContainer.removeChild(item);
                    });
                }
                else {
                    childImageToRemove.forEach(function (item) {
                        self.stage.removeChild(item);
                    });

 
            }
            }

        });
    }

    initMenu(canvas) {
        var textGap = 30;
        this.weaponPoint = new Point(5, canvas.height - 50);
        this.lifePoint = new Point(this.weaponPoint.x, this.weaponPoint.y - textGap);
        this.scorePoint = new Point(this.weaponPoint.x, this.lifePoint.y - textGap)
        this.fpsPoint = new Point(canvas.width - 80, this.weaponPoint.y - 10);
        this.pingPoint = new Point(canvas.width - 80, this.weaponPoint.y - 20);
        
    }

    render() {
        this.updateMenu();
        this.draw();
    }

    updateCanvasPosition(bodies) {
        var self = this;
        self.mechanicEngine.bodies.forEach(function (body) {
            if (body.id !== self.targetBody.id) {
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
        self.stage.update();
    }

    updateMenu () {
        if (!this.menu.weapon || this.menu.weapon !== this.targetBody.currentWeapon) {
            this.menu.updateWeapon(this.targetBody.currentWeapon, this.weaponPoint);
        }

        if (this.menu.life !== this.targetBody.life) {
            this.menu.updateLife(this.targetBody.life, this.lifePoint);
        }

        if (this.menu.fps !== this.gameContext.fps) {
            this.menu.updateFPS(this.gameContext.fps, this.fpsPoint)
        }

        if (this.menu.ping !== this.gameContext.ping) {
            this.menu.updatePing(this.gameContext.ping, this.pingPoint)
        }

        if (this.menu.score !== this.targetBody.score) {
            this.menu.updateScore(this.targetBody.score, this.scorePoint)
        }
    }

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
        this.updateMenu();
        this.stage.addChild(this.menu.weaponText, this.menu.lifeText, this.menu.fpsText, this.menu.scoreText, this.menu.pingText);
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