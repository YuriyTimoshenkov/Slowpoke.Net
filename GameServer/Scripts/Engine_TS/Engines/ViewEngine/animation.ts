class Animation {
    id: any;
    duration: number;
    creationTime: number;
    animationInitiator: any;
    isAlive: boolean;
    animationDuration: number;
    animationContainer: createjs.Container;
    parentContainer: createjs.Container;

    constructor(animationInitiator: Body, parentContainer: createjs.Container) {
        this.id = animationInitiator.id;
        this.animationInitiator = animationInitiator;
        this.animationContainer = new createjs.Container();
        this.animationContainer.x = animationInitiator.gameRect.x;
        this.animationContainer.y = animationInitiator.gameRect.y;
        this.parentContainer = parentContainer;
        this.creationTime = new Date().getTime();
    }
    update() {
        var now = new Date().getTime();
        if (now - this.creationTime >= this.animationDuration) this.stop();
    }
    start() { this.isAlive = true }
    stop() {
        this.isAlive = false;
        this.parentContainer.removeChild(this.animationContainer);
    }
}


class BoxDestroyAnimation extends Animation {
    piecesMovingDuration = 750;
    piecesCountRange = [10, 20];
    pieces: BoxPiece[] = [];

    constructor(animationInitiator: Body, parentContainer: createjs.Container) {
        super(animationInitiator, parentContainer);
        this.animationDuration = 10000;
        this.createAnimation(animationInitiator.gameRect);
    }
    start() {
        super.start();
    }
    stop() {
        super.stop();
    }
    update() {
        super.update();
        var now = new Date().getTime();
        var currentDuration = now - this.creationTime;
        var speedDecreaseFactor = currentDuration < this.piecesMovingDuration ? (this.piecesMovingDuration - currentDuration) / this.piecesMovingDuration : -1;
        var alphaDecreaseFactor = currentDuration / this.animationDuration;
        this.pieces.forEach((piece) => { piece.update(speedDecreaseFactor) });
        this.animationContainer.alpha = 1 - alphaDecreaseFactor;
    }
    createAnimation(boxRect: Rect) {
        var piecesCount = Math.floor((Math.random() * (this.piecesCountRange[1] - this.piecesCountRange[0])) + this.piecesCountRange[0] + 1);
        var pieceWidth = boxRect.width * 0.05;
        var pieceMaxHeight = boxRect.height * 0.7;

        var speed = 6;
        var skewSpeed = [10, 20];

        for (var i = 0; i < piecesCount; i++) {
            // randomize direction
            var signX;
            var signY;
            if (Math.floor((Math.random() * 2) + 1) === 1) signX = 1;
            else signX = -1;
            if (Math.floor((Math.random() * 2) + 1) === 1) signY = 1;
            else signY = -1;
            var dirX = Math.random() * signX;
            var dirY = Math.random() * signY;
            var direction = new Vector(dirX, dirY);

            // randomize position
            var x = Math.floor((Math.random() * boxRect.width) + 1);
            var y = Math.floor((Math.random() * boxRect.height) + 1);

            // randomize skew signs
            var skewXSign;
            var skewYSign;
            var randomNumberX = Math.floor((Math.random() * 100) + 1);
            if (randomNumberX <= 45) skewXSign = 1;
            else if (randomNumberX > 45 && randomNumberX < 90) skewXSign = -1;
            else skewXSign = 0;
            var randomNumberY = Math.floor((Math.random() * 100) + 1);
            if (randomNumberY <= 45) skewYSign = 1;
            else if (randomNumberY > 45 && randomNumberY < 90) skewYSign = -1;
            else skewYSign = 0;

            // create piece
            var skewSpeedRandomized = Math.floor((Math.random() * (skewSpeed[1] - skewSpeed[0])) + skewSpeed[0] + 1);
            var piece = new BoxPiece(speed, direction, skewSpeedRandomized, skewXSign, skewYSign);
            piece.createPiece(pieceWidth, pieceMaxHeight, "orange");
            piece.image.x = x;
            piece.image.y = y;

            // add piece where it is needed
            this.animationContainer.addChild(piece.image);
            this.pieces.push(piece);
        }
    }
}


class BoxPiece {
    image: createjs.Shape;
    speed: number;
    direction: Vector;
    skewSpeed: number;
    skewXSign: number;
    skewYSign: number;
    constructor(speed: number, direction: Vector, skewSpeed: number, skewXSign: number, skewYSign: number) {
        this.image = new createjs.Shape();
        this.speed = speed;
        this.direction = direction;
        this.skewSpeed = skewSpeed;
        this.skewXSign = skewXSign;
        this.skewYSign = skewYSign;
    }
    createPiece(width: number, maxHeight: number, color: string) {
        var height1 = Math.floor((Math.random() * maxHeight) + 1);
        var height2 = height1 * 1.1;

        var brokenEndingsCount = Math.floor((Math.random() * 2) + 1);

        if (brokenEndingsCount === 1) {
            this.image.graphics.beginFill(color).beginStroke("black").lineTo(width, 0).lineTo(width, height1).lineTo(width / 2, height1 * 0.9).lineTo(0, height2).lineTo(0, 0).closePath();
        }
        else {
            this.image.graphics.beginFill(color).beginStroke("black").lineTo(width / 2, height1 * 0.1).lineTo(width, 0).lineTo(width, height1).lineTo(width / 2, height1 * 0.9).lineTo(0, height2).lineTo(0, 0).closePath();
        }

        this.image.regX = width / 2;
        this.image.regY = height1 / 2;
    }
    update(speedDecreaseFactor: number) {
        if (speedDecreaseFactor !== -1) {
            this.image.skewX += this.skewXSign * this.skewSpeed / 2;
            this.image.skewY += this.skewYSign * this.skewSpeed;
            this.image.x += this.speed * speedDecreaseFactor * this.direction.x;
            this.image.y += this.speed * speedDecreaseFactor * this.direction.y;
        }
    }
}

class DynamitFlyAnimation extends Animation {
    rotationSpeed = 20;
    bodyImageObject: BodyImage;
    constructor(animationInitiator: Body, parentContainer: createjs.Container, bodyImageObject: BodyImage) {
        super(animationInitiator, parentContainer);
        this.bodyImageObject = bodyImageObject;
    }

    update() {
        super.update();
        this.bodyImageObject.image.rotation += this.rotationSpeed;
    }
}

class DynamitExplosionAnimation extends Animation {
    smokesCountRange = [10, 20];
    firstStageDuration = 100;
    firstStageSpeed = [1, 8];
    firstStageRotationSpeed = [10, 30];
    secondStageDuration = 4000;
    secondStageSpeedDecreaseFactor = 40;
    secondStageRotationDecreaseFactor = 20;
    lifeDurationRange = [50, 99];
    particles: DynamitAfterExplosionSmokeParticle[];
    flash: DynamitExplosionFlashAnimation;
    flashLifeDuration = 40;
    imageWidth = 256;
    imageHeight = this.imageWidth;
    initialSmokeRadius = 40;
    luckyGuysPercentage = 0.1;
    scaleFactorX = this.initialSmokeRadius / this.imageWidth;
    scaleFactorY = this.initialSmokeRadius / this.imageHeight;
    movedToSecondStage = false;
    smokeImage: createjs.DisplayObject;

    constructor(animationInitiator: Body, parentContainer: createjs.Container) {
        super(animationInitiator, parentContainer);
        this.particles = [];
        this.animationDuration = this.firstStageDuration + this.secondStageDuration;
        this.createAnimation();
    }

    createAnimation() {
        // Create flash
        this.flash = new DynamitExplosionFlashAnimation(this.animationContainer, this.flashLifeDuration, 50);

        this.smokeImage = new createjs.Bitmap("/Scripts/Resources/Images/smoke.png");
        this.smokeImage.scaleX = this.scaleFactorX;
        this.smokeImage.scaleY = this.scaleFactorY;
        this.smokeImage.regX = this.imageWidth / 2;
        this.smokeImage.regY = this.imageHeight / 2;

        var smokeCount = getRandomInt(this.smokesCountRange);
        var baseVectors = [new Vector(0,-1), new Vector(1,0), new Vector(0,1), new Vector(-1,0)];
        var quarterSignX = [1, -1, -1, 1];
        var quarterSignY = [1, 1, -1, -1];
        var step = 1 / (smokeCount / 4);

        // For each quarter
        for (var q = 0; q < 4; q++) {  
            var x = baseVectors[q].x;
            var y = baseVectors[q].y;
            // create smoke particles
            for (var i = 0; i < smokeCount / 4; i++) {
                var image = this.smokeImage.clone();
                var direction = new Vector(x, y);
                var speed = getRandomInt(this.firstStageSpeed);
                //if (Math.random() < this.luckyGuysPercentage) {
                //    speed *= 3;
                //    image.filters = [new createjs.ColorFilter(0, 0, 0, 1, 235, 70, 0, 0)];
                //    image.cache(0, 0, this.imageWidth, this.imageHeight);
                //}
                var lifeDuration = getRandomInt(this.lifeDurationRange) / 100 * (this.firstStageDuration + this.secondStageDuration);
                var rotationSpeed = getRandomInt(this.firstStageRotationSpeed);
                var r = getRandomInt([0, 2]);
                if (r === 1) rotationSpeed *= -1; 
                var particle = new DynamitAfterExplosionSmokeParticle(image, direction, speed, lifeDuration, rotationSpeed);
                this.particles.push(particle);
                x += step * quarterSignX[q];
                y += step * quarterSignY[q];
                this.animationContainer.addChild(particle.image);
            }
        }
    }

    update() {
        var self = this;
        super.update();
        var now = new Date().getTime();
        var timePassed = now - this.creationTime;
        if (!this.movedToSecondStage && timePassed > this.firstStageDuration) {
            this.movedToSecondStage = true;
            this.particles.forEach((particle) => {
                particle.speed /= self.secondStageSpeedDecreaseFactor;
                particle.rotationSpeed /= self.secondStageRotationDecreaseFactor;
            });
        }
        this.particles.forEach((particle) => {
            particle.update();
        });
        this.flash.update();
    }
}       

class DynamitAfterExplosionSmokeParticle {
    image: createjs.DisplayObject;
    direction: Vector;
    speed: number;
    lifeDuration: number;
    lastUpdateTime: number;
    rotationSpeed: number;

    constructor(image: createjs.DisplayObject, direction: Vector, speed: number, lifeDuration: number, rotationSpeed: number) {
        this.image = image;
        this.direction = direction;
        this.speed = speed;
        this.lifeDuration = lifeDuration;
        this.rotationSpeed = rotationSpeed;
        this.lastUpdateTime = new Date().getTime();
    }

    update() {
        var now = new Date().getTime();
        this.image.x += this.speed * this.direction.x;
        this.image.y += this.speed * this.direction.y;
        this.image.rotation += this.rotationSpeed;
        this.image.alpha -= (now - this.lastUpdateTime) / this.lifeDuration;
        this.lastUpdateTime = now;
    }

}

class AnimationElementShape {
    image: createjs.Shape;
    parentContainer: createjs.Container;
    isAlive: boolean;
    lifeDuration: number;
    creationTime: number;

    constructor(parentContainer: createjs.Container, lifeDuration: number) {
        this.parentContainer = parentContainer;
        this.lifeDuration = lifeDuration;
        this.isAlive = true;
    }

    destroySelfImage() {
        this.parentContainer.removeChild(this.image);
    }

    update() {
        if (now() - this.creationTime >= this.lifeDuration) {
            this.isAlive = false;
            this.destroySelfImage();
        }
        if (!this.isAlive) return
    }

}

class DynamitExplosionFlashAnimation extends AnimationElementShape {
    phase1Duration: number; // flash increases
    phase2Duration: number; // flash decreases
    switchedToPhase2: boolean;
    scaleFactorChangeSpeed = 0.1;

    constructor(parentContainer: createjs.Container, lifeDuration: number, radius: number) {
        super(parentContainer, lifeDuration);
        this.phase1Duration = lifeDuration / 2;
        this.phase2Duration = lifeDuration / 2;
        this.switchedToPhase2 = false;
        this.createSelf(radius);
    }

    createSelf(radius: number) {
        this.image = new createjs.Shape();
        this.image.graphics.beginRadialGradientFill(["white", "darkorange"], [0.5, 1], 0, 0, 0, 0, 0, radius).drawPolyStar(0, 0, radius, 7, 0.8, 0);
        this.parentContainer.addChild(this.image);
        this.creationTime = now();
    }


    update() {
        super.update();

        if (this.switchedToPhase2) {
            this.image.scaleX -= this.image.scaleX * this.scaleFactorChangeSpeed;
            this.image.scaleY -= this.image.scaleX * this.scaleFactorChangeSpeed;
        }
        else {
            this.image.scaleX += this.image.scaleX * this.scaleFactorChangeSpeed;
            this.image.scaleY += this.image.scaleX * this.scaleFactorChangeSpeed;
        }

    }

}