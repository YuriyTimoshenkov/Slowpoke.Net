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
    piecesMovingDuration = 2000;
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

        var speed = 3;
        var rotationSpeed = 3;
        var skewSpeed = 20;

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
            var randomNumber = Math.floor((Math.random() * 3) + 1);
            if (randomNumber === 1) skewXSign = 1;
            else if (randomNumber === 2) skewXSign = 0;
            else skewXSign = -1;
            var randomNumber = Math.floor((Math.random() * 3) + 1);
            if (randomNumber === 1) skewYSign = 1;
            else if (randomNumber === 2) skewYSign = 0;
            else skewYSign = -1;

            // create piece
            var piece = new BoxPiece(speed, direction, rotationSpeed, skewSpeed, skewXSign, skewYSign);
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
    rotationSpeed: number;
    skewSpeed: number;
    skewXSign: number;
    skewYSign: number;
    constructor(speed: number, direction: Vector, rotationSpeed: number, skewSpeed: number, skewXSign: number, skewYSign: number) {
        this.image = new createjs.Shape();
        this.speed = speed;
        this.direction = direction;
        this.rotationSpeed = rotationSpeed;
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
            //this.image.rotation += this.rotationSpeed;
            this.image.skewX += this.skewXSign * this.skewSpeed / 2;
            this.image.skewY += this.skewYSign * this.skewSpeed;
            this.image.x += this.speed * speedDecreaseFactor * this.direction.x;
            this.image.y += this.speed * speedDecreaseFactor * this.direction.y;
        }
    }

}
