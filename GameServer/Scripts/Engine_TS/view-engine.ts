/// <reference path="../typings/easeljs/easeljs.d.ts" />

class ViewEngine {
    bodyImages: BodyImage[];
    mapImageContainer: createjs.Container;
    stage: createjs.Stage;
    canvas: any;
    menu: Menu;
    viewBodyFactory: ViewBodyFactory;
    baseRotationVector: Vector;
    targetBody: PlayerBody;
    targetBodyImage: createjs.Container;
    infoboxFactory: InfoboxFactory;
    mechanicEngine: MechanicEngineTS;
    gameContext: any;
    animations: Animation[];

    constructor(canvas, canvasSize, infoboxFactory: InfoboxFactory, gameContext, viewBodyFactory: ViewBodyFactory) {
        this.canvas = canvas;
        this.canvas.width = canvasSize.width;
        this.canvas.height = canvasSize.height;
        this.stage = new createjs.Stage(canvas);
        this.infoboxFactory = infoboxFactory;
        this.animations = [];
        this.gameContext = gameContext;
        this.menu = new Menu(this.gameContext, this.stage, this.canvas);
        this.viewBodyFactory = viewBodyFactory;
        this.bodyImages = [];
        this.baseRotationVector = new Vector(0, -1);
    }

    init(mechanicEngine: MechanicEngineTS) {
        var self = this;
        this.mechanicEngine = mechanicEngine;
        this.menu.init();
        this.mapImageContainer = this.viewBodyFactory.createMapContainer();
        this.stage.addChild(this.mapImageContainer);
        
        mechanicEngine.BodyAdded.add(function (body) {
            //console.log("VE, adding: " + body.bodyType);
            var image = self.viewBodyFactory.createGameObjectbyServerBody(body);
            var bodyImageObject = new BodyImage(body.id, image)
            self.bodyImages.push(bodyImageObject);

            // create infoboxes start
            // if NPC
            if (body.bodyType === "NPCAI") {
                var infoboxFloating = self.infoboxFactory.createInfobox(infoboxes.NPC_FLOATING, body, self.stage, new Point(bodyImageObject.image.x, bodyImageObject.image.y));
                bodyImageObject.infoboxes.push(infoboxFloating);
            }

            // if PlayerOther
            else if (body.bodyType === "PlayerBody" && body instanceof PlayerOtherBody) {
                var infoboxFloating = self.infoboxFactory.createInfobox(infoboxes.PLAYER_FLOATING, body, self.stage, new Point(bodyImageObject.image.x, bodyImageObject.image.y));
                bodyImageObject.infoboxes.push(infoboxFloating);
            }
            // if Player
            else if (body.bodyType === "PlayerBody" && body instanceof PlayerBody) {
                var infoboxFloating = self.infoboxFactory.createInfobox(infoboxes.PLAYER_FLOATING, body, self.stage, new Point(bodyImageObject.image.x, bodyImageObject.image.y));
                var infoboxFixed = self.infoboxFactory.createInfobox(infoboxes.PLAYER_FIXED, body, self.stage, new Point(5, this.canvas.height - 50));
                bodyImageObject.infoboxes.push(infoboxFloating);
                bodyImageObject.infoboxes.push(infoboxFixed);
            }
            // create infoboxes end


            if (body instanceof Tile) {
                image.x = body.gameRect.centerx;
                image.y = body.gameRect.centery;
                self.mapImageContainer.addChild(image);
            }

            else {
                if (self.targetBody != undefined) {
                    self.updateBodyPosition(body, bodyImageObject);
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

        mechanicEngine.onBodyChanged.add(function (e) {

            var bodyImageObject = self.bodyImages.filter(function (v) { return v.id === e.body.id ? true : false })[0];

            switch (e.changesType) {
                case BodyChangesType.direction:
                    {
                        if (e.body instanceof ActiveBody) {
                            self.updateImageDirection(e.body.direction, bodyImageObject.image);
                        }

                        break;
                    }
                case BodyChangesType.position:
                    {
                        if (self.targetBody.id == e.body.id) {
                            self.updateCanvasPosition(self.mechanicEngine.bodies);
                        }
                        else {

                            self.updateBodyPosition(e.body, bodyImageObject);
                        }
                        break;
                    }
                case BodyChangesType.hp:
                    var animation = new BodyHitAnimation(bodyImageObject, self);
                    animation.start();
                    self.animations.push(animation);
                    bodyImageObject.infoboxes.forEach(function (infobox) { infobox.updateLifeText() });
                    break;

                case BodyChangesType.currentWeapon:
                    bodyImageObject.infoboxes.forEach(function (infobox) { infobox.updateCurrentWeaponText() });
                    break;

                case BodyChangesType.score:
                    bodyImageObject.infoboxes.forEach(function (infobox) { infobox.updateScoreText() });
                    break;

                default:
                    break;
            }

        });

        mechanicEngine.onBodyRemove.add(function (body) {
            var childrenImageObjectsToRemove: any[] = [];

            self.bodyImages = self.bodyImages.filter(function (v) {
                if (v.id === body.id) {
                    childrenImageObjectsToRemove.push(v);

                    return false;
                }
                else
                    return true;
            });

            if (childrenImageObjectsToRemove !== undefined) {
                if (body instanceof Tile) {
                    childrenImageObjectsToRemove.forEach(function (item) {
                        self.mapImageContainer.removeChild(item.image);
                    });
                }
                else {
                    childrenImageObjectsToRemove.forEach(function (item) {
                        self.stage.removeChild(item.image);
                        item.infoboxes.forEach(function (infobox) { infobox.removeSelf(self.stage) });
                    });
                }
            }

        });
    }

    render() {
        this.menu.performanceInfobox.updateAll();
        this.updateAnimations();
        this.draw();
    }

    updateAnimations() {
        var self = this;
        this.animations.forEach(function (animation) { animation.update(self); });
    }

    updateCanvasPosition(bodies) {
        var self = this;
        self.mechanicEngine.bodies.forEach(function (body) {
            if (body.id !== self.targetBody.id) {
                var bodyImageObject = self.bodyImages.filter(function (v) { return v.id === body.id ? true : false })[0];
                self.updateBodyPosition(body, bodyImageObject);
            }
        })
        self.updateMapImagePosition();
    }

    updateBodyPosition(body: Body, bodyImageObject: BodyImage) {
        var self = this;

        if (bodyImageObject.image !== undefined) {
            var dx = self.targetBody.gameRect.centerx - body.gameRect.centerx;
            var dy = self.targetBody.gameRect.centery - body.gameRect.centery;

            bodyImageObject.image.x = self.targetBodyImage.x - dx;
            bodyImageObject.image.y = self.targetBodyImage.y - dy;
        }
        bodyImageObject.infoboxes.forEach(function (infobox) { infobox.updatePosition(new Point(bodyImageObject.image.x, bodyImageObject.image.y)); });
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
    infoboxes: Infobox[];
    constructor(id, image) {
        this.id = id;
        this.image = image;
        this.infoboxes = [];
    }
}