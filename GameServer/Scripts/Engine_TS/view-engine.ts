/// <reference path="../typings/easeljs/easeljs.d.ts" />

class ViewEngine {
    bodyImages: BodyImage[];
    level0Container: createjs.Container;  // Tile: ground
    level1Container: createjs.Container;  // PassiveBody: various things, life containers, weapons
    level2Container: createjs.Container;  // ActiveBody: humans, animals, bullets
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
        this.level0Container = new createjs.Container();
        this.level1Container = new createjs.Container();
        this.level2Container = new createjs.Container();
        // DO NOT CHANGE THE ORDER OF CONTAINERS - this is for sorting
        this.stage.addChildAt(this.level0Container, this.level1Container, this.level2Container, 0);
        
        mechanicEngine.BodyAdded.add(function (body) {
            var image = self.viewBodyFactory.createGameObjectbyServerBody(body);
            var bodyImageObject = new BodyImage(body.id, image)
            self.bodyImages.push(bodyImageObject);

            self.createInfoboxes(body, bodyImageObject);

            self.addBodyHandler(body, bodyImageObject.image);
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
                        self.positionChangeHandler(e.body, bodyImageObject);
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


            childrenImageObjectsToRemove.forEach(function (item) { 
                if (body instanceof Tile) {
                    self.level0Container.removeChild(item.image);
                }
                else if (body instanceof PassiveBody) {
                    self.level1Container.removeChild(item.image);

                }
                else if (body instanceof ActiveBody) {
                    self.level2Container.removeChild(item.image);
                    item.infoboxes.forEach(function (infobox) { infobox.removeSelf(self.level2Container) });
                }
            });

        });
    }

    createInfoboxes(body, bodyImageObject) {
        var self = this;
        var infoboxes = self.infoboxFactory.createInfoboxes(body, new Point(bodyImageObject.image.x, bodyImageObject.image.y));
        infoboxes.forEach((infobox) => {
            var container;
            if (infobox instanceof PlayerInfoboxFixed) container = self.stage
            else container = self.level2Container;
            infobox.addSelfToContainer(container);
        });
        bodyImageObject.infoboxes = bodyImageObject.infoboxes.concat(infoboxes);
    }

    addBodyHandler = (body: Body, image: createjs.DisplayObject) => {
        image.x = body.gameRect.centerx;
        image.y = body.gameRect.centery;
        if (body instanceof Tile) {
            this.level0Container.addChild(image);
        }
        else if (body instanceof PassiveBody) {
            this.level1Container.addChild(image);
        }   
        else if (body instanceof ActiveBody) {
            this.updateImageDirection(body.direction, image);
            this.level2Container.addChild(image);
        }
        else console.log("ViewEngine: onboardObjectForRendering: Incorrect body type")
    }

    render() {
        this.menu.update();
        this.updateAnimations();
        this.draw();
    }

    updateAnimations() {
        var self = this;
        this.animations.forEach(function (animation) { animation.update(self); });
    }

    updateContainersPosition = () => {
        var halfCanvasWidth = this.canvas.width / 2;
        var halfCanvasHeight = this.canvas.height / 2;
        this.level0Container.regX = this.targetBody.gameRect.centerx - halfCanvasWidth;
        this.level0Container.regY = this.targetBody.gameRect.centery - halfCanvasHeight

        this.level1Container.regX = this.targetBody.gameRect.centerx - halfCanvasWidth;
        this.level1Container.regY = this.targetBody.gameRect.centery - halfCanvasHeight;

        this.level2Container.regX = this.targetBody.gameRect.centerx - halfCanvasWidth;
        this.level2Container.regY = this.targetBody.gameRect.centery - halfCanvasHeight;
    }

    positionChangeHandler = (body, bodyImageObject) => {
        bodyImageObject.image.x = body.gameRect.centerx;
        bodyImageObject.image.y = body.gameRect.centery;
        bodyImageObject.infoboxes.forEach(function (infobox) { infobox.updatePosition(new Point(bodyImageObject.image.x, bodyImageObject.image.y)); });
        if (this.targetBody.id === body.id) {
            this.updateContainersPosition();
        }
    }

    draw() {
        this.stage.update();
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
        //var playerCenter = new Point(this.targetBodyImage.x, this.targetBodyImage.y);
        var playerCenter = new Point(this.canvas.width / 2, this.canvas.height / 2);

        // Get mouse vector not normalized
        var mouseVectorNotNormalized = new Vector(Math.round(mousePoint.x - playerCenter.x), Math.round(mousePoint.y - playerCenter.y));
        return mouseVectorNotNormalized;
    }

    setTarget(body) {
        this.targetBody = body;
    }

    setTargetBodyImage() {
        var self = this;
        this.targetBodyImage = this.bodyImages.filter(function (v) { return v.id === self.targetBody.id ? true : false })[0].image;
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