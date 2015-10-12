function ViewBodyFactory() {
    var self = this;

    this.createViewBody = function (gameType, data) {
        return self.builders[gameType](data);
    }

    this.builders = [];
    this.builders[gameTypes.gameObjects.PLAYER] = function (serverBody) {
        var imageSize = 280;

        // Create walk animation
        var walkImage = new CowboyContainer().image;
        
        walkImage.regX = imageSize / 2;
        walkImage.regY = imageSize / 2;
        walkImage.scaleX = 0.4;
        walkImage.scaleY = 0.4;
        //walkImage.setBounds(0, 0, imageSize, imageSize);
        walkImage.cache(0, 0, imageSize, imageSize);

        // Create bodyHit animation
        var bodyHitImage = new CowboyContainer().image;
        bodyHitImage.filters = [new createjs.ColorFilter(1, 1, 1, 1, 85, 0, 0, 0)];
        bodyHitImage.regX = imageSize / 2;
        bodyHitImage.regY = imageSize / 2;
        bodyHitImage.scaleX = 0.4;
        bodyHitImage.scaleY = 0.4;
        bodyHitImage.cache(0, 0, imageSize, imageSize);

        // To avoid createjs limitation that transformation is ignored when converting DisplayObjects to SpriteSheets
        var walkContainer = new createjs.Container();
        var bodyHitContainer = new createjs.Container();
        walkContainer.addChild(walkImage);
        bodyHitContainer.addChild(bodyHitImage);

        // Build SpriteSheet and Sprite
        var builder = new createjs.SpriteSheetBuilder();
        builder.addFrame(walkContainer);
        builder.addFrame(bodyHitContainer);

        builder.addAnimation("walk", [0]);
        builder.addAnimation("bodyHit", [1], "walk")
        var spriteSheet = builder.build();

        return new createjs.Sprite(spriteSheet, "walk");
    }

    this.builders[gameTypes.gameObjects.PLAYEROTHER] = function (serverBody) {
        return self.createGameObject(gameTypes.gameObjects.PLAYER, serverBody)
    }

    this.builders[gameTypes.gameObjects.NPCAI] = function (serverBody) {
        var imageSize = 200;
        var scaleFactor = 0.43;

        // Create walk animation
        var walkImage = new PolicemanContainer().image;
        walkImage.regX = imageSize / 2;
        walkImage.regY = imageSize / 2;
        walkImage.scaleX = scaleFactor;
        walkImage.scaleY = scaleFactor;
        walkImage.cache(0, 0, imageSize, imageSize);

        // Create bodyHit animation
        var bodyHitImage = new PolicemanContainer().image;
        bodyHitImage.filters = [new createjs.ColorFilter(1, 1, 1, 1, 85, 0, 0, 0)];
        bodyHitImage.regX = imageSize / 2;
        bodyHitImage.regY = imageSize / 2;
        bodyHitImage.scaleX = scaleFactor;
        bodyHitImage.scaleY = scaleFactor;
        bodyHitImage.cache(0, 0, imageSize, imageSize);

        // To avoid createjs limitation that transformation is ignored when converting DisplayObjects to SpriteSheets
        var walkContainer = new createjs.Container();
        var bodyHitContainer = new createjs.Container();
        walkContainer.addChild(walkImage);
        bodyHitContainer.addChild(bodyHitImage);

        // Build SpriteSheet and Sprite
        var builder = new createjs.SpriteSheetBuilder();
        builder.addFrame(walkContainer);
        builder.addFrame(bodyHitContainer);

        builder.addAnimation("walk", [0]);
        builder.addAnimation("bodyHit", [1], "walk")
        var spriteSheet = builder.build();

        return new createjs.Sprite(spriteSheet, "walk");
    }

    this.builders[gameTypes.gameObjects.SHOTGUN] = function (serverBody) {
        var activeBodyRadius = 50;
        var w = 6;
        var h = activeBodyRadius + 35;
        var x = -w / 2;
        var y = -h;
        var shotgunImage = new createjs.Shape();
        shotgunImage.graphics.beginFill("black").drawRect(x, y, w, h);
        return shotgunImage;
    }
    this.builders[gameTypes.gameObjects.GUN] = function (serverBody) {
        var activeBodyRadius = 50;
        var w = 4;
        var h = activeBodyRadius + 50;
        var x = -w / 2;
        var y = -h;
        var gunImage = new createjs.Shape();
        gunImage.graphics.beginFill("maroon").drawRect(x, y, w, h);
        return gunImage;
    }
    this.builders[gameTypes.gameObjects.REVOLVER] = function (serverBody) {
        var activeBodyRadius = 50;
        var w = 4;
        var h = activeBodyRadius + 20;
        var x = -w / 2;
        var y = -h;
        var revolverImage = new createjs.Shape();
        revolverImage.graphics.beginFill("yellow").drawRect(x, y, w, h);
        return revolverImage;
    }
    this.builders[gameTypes.gameObjects.BULLETSHOTGUN] = function (serverBody) {
        var bulletImage = new createjs.Shape();
        bulletImage.graphics.lf(["#F08200", "#FAFAC8"], [0, 0.3], 0, 0, 0, 80).dr(0, 2, 2, 40).ss(1).f("#F08200").dc(2, 2, 2);
        bulletImage.scaleX = 0.5;
        bulletImage.scaleY = 0.5;
        bulletImage.zIndex = 6;

        return bulletImage;
    }
    this.builders[gameTypes.gameObjects.BULLETGUN] = function (serverBody) {
        var bulletImage = new createjs.Shape();
        bulletImage.graphics.lf(["#FF2828", "#FAFAC8"], [0, 0.3], 0, 0, 0, 80).dr(0, 2, 5, 60).ss(1).f("#FF2828").dc(2, 2, 2);
        bulletImage.scaleX = 0.5;
        bulletImage.scaleY = 0.5;
        bulletImage.zIndex = 6;

        return bulletImage;
    }

    this.builders[gameTypes.gameObjects.DYNAMITE] = function (serverBody) {
        var dynamitWidth = 6;
        var dynamitHeight = dynamitWidth * 4;
        var fuseLength = dynamitHeight * 0.5;
        var fuseWidth = dynamitWidth * 0.1 < 1 ? 1 : dynamitWidth * 0.1;
        var flameRadius = dynamitWidth * 1;

        var dynamit = new createjs.Shape();

        dynamit.graphics.setStrokeStyle(fuseWidth).beginStroke("darkgreen").moveTo(0, 0).lineTo(0, fuseLength).endStroke();
        dynamit.graphics.beginFill("tomato").drawRect(-dynamitWidth / 2, fuseLength, dynamitWidth, dynamitHeight);
        dynamit.graphics.beginFill("#FF0").drawPolyStar(0, 0, flameRadius, 8, 0.7, 20);
        dynamit.regX = dynamitWidth / 2;
        dynamit.regY = dynamitHeight / 2 + fuseLength;
        return dynamit;
    }

    this.builders[gameTypes.gameObjects.BULLETREVOLVER] = function (serverBody) {
        var bulletImage = new createjs.Shape();
        bulletImage.graphics.lf(["#000000", "#FAFAC8"], [0, 0.3], 0, 0, 0, 80).dr(0, 2, 4, 50).ss(1).f("#000000").dc(2, 2, 2);
        bulletImage.scaleX = 0.5;
        bulletImage.scaleY = 0.5;
        bulletImage.zIndex = 6;

        return bulletImage;
    }

    this.builders[gameTypes.gameObjects.LIFECONTAINER] = function (serverBody) {
        // Assign image
        var image = new BottleContainer().image;

        // Configure image
        var imageOriginalWidth = 800;
        var imageOriginalHeight = 800;
        var scaleFactor = 0.05;
        var w = 218 * scaleFactor;
        var h = 740 * scaleFactor;
        var x = -w / 2;
        var y = -h / 2;
        image.setBounds(x, y, w, h);
        image.scaleX = scaleFactor;
        image.scaleY = scaleFactor;		
        image.regX = imageOriginalWidth / 2;
        image.regY = imageOriginalHeight / 2;
        image.cache(200, 20, 440, 760);

        return image;
    }

    this.builders[gameTypes.gameObjects.MEADOW] = function (serverBody) {
        var image = new createjs.Shape();
        image.graphics.beginFill("#C0F598").drawRect(-serverBody.size / 2, -serverBody.size / 2, serverBody.size, serverBody.size);
        image.zIndex = 0;
        return image;
    }
    this.builders[gameTypes.gameObjects.WATER] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#89EBF0").drawRect(-serverBody.size / 2, -serverBody.size / 2,serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.ROCK] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#6E6E6E").drawRect(-serverBody.size / 2, -serverBody.size / 2,serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.ROAD] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#EDC791").drawRect(-serverBody.size / 2, -serverBody.size / 2, serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.FORD] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#EDC791").drawRect(-serverBody.size / 2, -serverBody.size / 2, serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.TREE] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#5EAB00").drawRect(-serverBody.size / 2, -serverBody.size / 2, serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.BOX] = function (serverBody) {

        var boxImage = new createjs.Shape();
        boxImage.graphics.beginFill("orange").beginStroke("black").drawRect(0, 0, serverBody.shape.width, serverBody.shape.height);
        boxImage.regX = serverBody.shape.width / 2;
        boxImage.regX = serverBody.shape.height / 2;
        var xStep = serverBody.shape.width / 10;

        for (var x = xStep; x < serverBody.shape.width; x += xStep) {
            boxImage.graphics.beginStroke("black").moveTo(x, 0).lineTo(x, serverBody.shape.height);
        }

        return boxImage;
    }


    //this.updateDirection = function (newDirection, image) {
    //    var baseRotationVector = new Vector(0, -1);

    //    var rotationDeltaRad = Math.acos(baseRotationVector.product(newDirection) /
    //        baseRotationVector.length() * newDirection.length());

    //    var rotationDeltaDegree = rotationDeltaRad * (180 / Math.PI);

    //    // To check rotation direction
    //    var centerX = image.x;
    //    var mouseX = centerX + newDirection.x;

    //    // Clockwise
    //    if (mouseX >= centerX) {
    //        image.rotation = rotationDeltaDegree;
    //    }// Counter-clockwise
    //    else {
    //        image.rotation = 360 - rotationDeltaDegree;
    //    }
    //}
}