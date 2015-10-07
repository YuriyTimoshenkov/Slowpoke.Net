/// <reference path="../typings/easeljs/easeljs.d.ts" />

class ViewEngine {
    bodyImages: BodyImage[];
    levelContainers: createjs.Container[];  
    stage: createjs.Stage;
    canvas: any;
    menu: Menu;
    bodyImageFactory: BodyImageFactory;
    baseRotationVector: Vector;
    targetBody: PlayerBody;
    targetBodyImage: createjs.Container;
    infoboxFactory: InfoboxFactory;
    mechanicEngine: MechanicEngineTS;
    gameContext: any;
    animations: Animation[];

    constructor(canvas, canvasSize, infoboxFactory: InfoboxFactory, gameContext, bodyImageFactory: BodyImageFactory) {
        this.canvas = canvas;
        this.canvas.width = canvasSize.width;
        this.canvas.height = canvasSize.height;
        this.stage = new createjs.Stage(canvas);
        this.infoboxFactory = infoboxFactory;
        this.bodyImages = [];
        this.animations = [];
        this.gameContext = gameContext;
        this.menu = new Menu(this.gameContext, this.stage, this.canvas);
        this.bodyImageFactory = bodyImageFactory;
        this.baseRotationVector = new Vector(0, -1);
    }

    init(mechanicEngine: MechanicEngineTS) {
        var self = this;
        this.mechanicEngine = mechanicEngine;
        this.menu.init();
        
        // Tile: ground
        // PassiveBody: various things, life containers, weapons
        // ActiveBody: humans, animals, bullets
        // In the sky
        this.levelContainers = [];
        this.levelContainers.push(new createjs.Container());
        this.levelContainers.push(new createjs.Container());
        this.levelContainers.push(new createjs.Container());
        this.levelContainers.push(new createjs.Container());

        // DO NOT CHANGE THE ORDER OF CONTAINERS - this is for sorting
        this.stage.addChildAt(this.levelContainers[0], this.levelContainers[1], this.levelContainers[2], this.levelContainers[3], 0);
        
        mechanicEngine.BodyAdded.add(function (body: Body) {

            var bodyImageObject = self.bodyImageFactory.createBodyImagebyServerBody(body);

            self.bodyImages.push(bodyImageObject);

            self.addBodyHandler(body, bodyImageObject.image);

            self.createInfoboxes(body, bodyImageObject);

            // create animation
            if (body instanceof DynamitBody) self.addAnimationAndStart(new DynamitFlyAnimation(body, self.levelContainers[2], bodyImageObject));
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
                    bodyImageObject.animate("bodyHit");
                    break;

                case BodyChangesType.currentWeapon:
                    var character = <CharacterBody>e.body;
                    var bodyImage = <CharacterBodyImage>bodyImageObject;
                    var newWeapon = character.currentWeapon;
                    var newWeaponType = self.bodyImageFactory.serverTypeMap[newWeapon.name];
                    var newWeaponImage = self.bodyImageFactory.viewBodyFactory.createViewBody(newWeaponType, newWeapon);
                    bodyImage.setNewWeaponImage(newWeaponImage);
                    break;

                case BodyChangesType.score:
                    break;

                default:
                    break;
            }

            bodyImageObject.infoboxes.forEach(function (infobox)
            {
                infobox.update(e.changesType, e.body)
            });

        });

        mechanicEngine.onBodyRemove.add(function (body) {
            var childrenImageObjectsToRemove: BodyImage[] = [];

            self.bodyImages = self.bodyImages.filter(function (v) {
                if (v.id === body.id) {
                    childrenImageObjectsToRemove.push(v);
                    return false;
                }
                else
                    return true;
            });

            // Create Animations
            if (body instanceof BoxPassiveBody) self.addAnimationAndStart(new BoxDestroyAnimation(body, self.levelContainers[1]));
            else if (body instanceof DynamitBody) self.addAnimationAndStart(new DynamitExplosionAnimation(body, self.levelContainers[2]));

            childrenImageObjectsToRemove.forEach(function (item) { 
                if (body instanceof DynamitBody) {
                    item.animate("detonate");
                }

                if (body instanceof Tile) {
                    self.levelContainers[0].removeChild(item.image);
                }
                else if (body instanceof PassiveBody) {
                    self.levelContainers[1].removeChild(item.image);

                }
                else if (body instanceof ActiveBody) {
                    self.levelContainers[2].removeChild(item.image);
                    item.infoboxes.forEach(function (infobox) { infobox.removeSelf(self.levelContainers[2]) });
                }
            });

        });
    }

    createInfoboxes(body: Body, bodyImageObject: BodyImage) {
        var self = this;
        var infoboxes = self.infoboxFactory.createInfoboxes(body, new Point(bodyImageObject.image.x, bodyImageObject.image.y));

        infoboxes.forEach((infobox) => {
            infobox.addSelfToContainer(infobox instanceof PlayerInfoboxFixed ? self.stage : self.levelContainers[2]);
        });

        bodyImageObject.infoboxes = bodyImageObject.infoboxes.concat(infoboxes);
    }

    addBodyHandler(body: Body, image: createjs.DisplayObject) {
        image.x = body.gameRect.centerx;
        image.y = body.gameRect.centery;

        if (body instanceof Tile) {
            this.levelContainers[0].addChild(image);
        }
        else if (body instanceof PassiveBody || body instanceof Weapon) {
            this.levelContainers[1].addChild(image);
        }   
        else if (body instanceof ActiveBody) {
            this.updateImageDirection(body.direction, image);
            this.levelContainers[2].addChild(image);
        }
        else console.log("ViewEngine: onboardObjectForRendering: Incorrect body type")
    }

    addAnimationToContainerHandler(animation: Animation) {
        if (animation instanceof BoxDestroyAnimation || animation instanceof DynamitExplosionAnimation) {
            animation.parentContainer.addChild(animation.animationContainer);
        }
    }

    addAnimationAndStart(animation: Animation) {
        this.animations.push(animation);
        this.addAnimationToContainerHandler(animation);
        animation.start();
    }

    render() {
        this.menu.update();
        this.updateAnimations();
        this.draw();
    }

    updateAnimations() {
        var self = this;
        this.animations.forEach(function (animation) { animation.update(); });
        // Remove dead animations
        this.animations = this.animations.filter(function (animation) { return animation.isAlive });
        // Probably we don't need to add animations to this.bodyImages list
        //this.bodyImages = this.bodyImages.filter(function (animation) { return animation.is});
    }

    updateContainersPosition = () => {
        var self = this;
        var halfCanvasWidth = this.canvas.width / 2;
        var halfCanvasHeight = this.canvas.height / 2;

        this.levelContainers.forEach(function (container) {
            container.regX = self.targetBody.gameRect.centerx - halfCanvasWidth;
            container.regY = self.targetBody.gameRect.centery - halfCanvasHeight
        });
    }

    positionChangeHandler(body: Body, bodyImageObject: BodyImage) {
        bodyImageObject.image.x = body.gameRect.centerx;
        bodyImageObject.image.y = body.gameRect.centery;

        //bodyImageObject.infoboxes.forEach(function (infobox) {
        //    infobox.update(BodyChangesType.position, body);
        //    //(new Point(bodyImageObject.image.x, bodyImageObject.image.y));
        //});

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

    stop() {
        this.stage.removeAllChildren();
        this.stage.clear();


        this.levelContainers.forEach(function (container) {
            container.removeAllChildren();
        });
    }
}