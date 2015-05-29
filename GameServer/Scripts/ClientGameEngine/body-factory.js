function GameObjectFactory() {
    var self = this;

    this.createGameObject = function (gameType, data) {
        return self.builders[gameType](data);
    }

    this.createGameObjectbyServerBody = function (body) {
        return self.createGameObject(self.serverTypeMap[body.BodyType], body);
    }

    this.builders = [];
    this.builders[gameTypes.gameObjects.PLAYER] = function (serverBody) {        
        var player = new PlayerBody(serverBody);

        var canvasXY = new Point($(document).width() / 2,
                                 $(document).height() / 2);
        player.image.x = canvasXY.x;
        player.image.y = canvasXY.y;
        player.objectMenu.x = canvasXY.x;
        player.objectMenu.y = canvasXY.y;

        // Assign image
        var obj = new CowboyContainer();
        player.image.addChild(obj.image);

        // Create name text
        var textSize = 15;
        var nameText = new createjs.Text(player.name, textSize + "px Arial", "#AAA9AB");
        nameText.x = -player.gameRect.width * 1.5;
        nameText.y = -player.gameRect.height * 1.5;
        player.objectMenu.addChild(nameText);

        // Configure image
        var imageSize = 280;
        player.image.regX = imageSize / 2;
        player.image.regY = imageSize / 2;
        player.image.scaleX = 0.4;
        player.image.scaleY = 0.4;
        player.image.cache(0, 0, imageSize, imageSize);

        return player;
    }
    this.builders[gameTypes.gameObjects.PLAYEROTHER] = function (serverBody) {
        var player = new CharacterBody(serverBody);

        // Assign image
        var obj = new CowboyContainer();
        player.image.addChild(obj.image);

        // Create name text
        var textSize = 15;
        var nameText = new createjs.Text(player.name, textSize + "px Arial", "#AAA9AB");
        nameText.x = -player.gameRect.width * 1.5;
        nameText.y = -player.gameRect.height * 1.5;
        player.objectMenu.addChild(nameText);

        // Configure image
        var imageSize = 280;
        player.image.regX = imageSize / 2;
        player.image.regY = imageSize / 2;
        player.image.scaleX = 0.4;
        player.image.scaleY = 0.4;
        player.image.cache(0, 0, imageSize, imageSize);

        return player;
    }
    this.builders[gameTypes.gameObjects.NPCAI] = function (serverBody) {
        var npc = new CharacterBody(serverBody);

        // Assign image
        var obj = new PolicemanContainer();
        npc.image.addChild(obj.image);

        // Create life text
        npc.addLifeText();

        // Configure image
        var imageSize = 280;
        npc.image.regX = imageSize / 2;
        npc.image.regY = imageSize / 2;
        npc.image.scaleX = 0.4;
        npc.image.scaleY = 0.4;
        npc.image.cache(0, 0, imageSize, imageSize);

        return npc;
    }
    this.builders[gameTypes.gameObjects.BULLET] = function (serverBody) {
        var bullet = new BaseBody(serverBody);

        // Assign image
        var bulletImage = new createjs.Shape();
        bulletImage.graphics.lf(["#F08200", "#FAFAC8"], [0, 0.3], 0, 0, 0, 80).dr(0, 2, 4, 50).ss(1).f("#F08200").dc(2, 2, 2);
        bulletImage.scaleX = 0.5;
        bulletImage.scaleY = 0.5;
            // KOSTIL 
            // trigger direction update
        bullet.updateDirection(bullet.direction);
        bullet.image.addChild(bulletImage);

        return bullet;
    }
    this.builders[gameTypes.gameObjects.LIFECONTAINER] = function (serverBody) {
        var lifeContainer = new BaseBody(serverBody);

        // Assign image
        var obj = new BottleContainer();
        obj.image.scaleX = 0.05;
        obj.image.scaleY = 0.05;

        lifeContainer.image.addChild(obj.image);

        // Configure image
        var imageWidth = 215.45;
        var imageHeight = 738.3;
        lifeContainer.image.cache(0, 0, 30, 40);

        return lifeContainer;
    }
    this.builders[gameTypes.gameObjects.TREE] = function (serverBody) {
        var treeBody = {
            Name: "TreeContainer",
            BodyType: "PassiveBody",
            Id: 333,
            Shape: { Position: { X: 0, Y: 0 }, Raius: 10 },
            Life: 10,
            LifeMax: 10,
            Direction: { X: 0, Y: 0 },
            CurrentWeapon: "",
            Speed: 0
    }

        var treeContainer = new BaseBody(treeBody);

        var obj = new TreeContainer();
        obj.image.scaleX = 0.06;
        obj.image.scaleY = 0.06;
        treeContainer.image = obj.image;//.addChild(obj.image);
        treeContainer.image.cache(0, 0, 50, 50);
        return treeContainer;
    }

     
    this.serverTypeMap = [];
    this.serverTypeMap["NPCAI"] = gameTypes.gameObjects.NPCAI;
    this.serverTypeMap["PlayerBody"] = gameTypes.gameObjects.PLAYEROTHER;
    this.serverTypeMap["Bullet"] = gameTypes.gameObjects.BULLET;
    this.serverTypeMap["BulletDynamite"] = gameTypes.gameObjects.DYNAMITE;
    this.serverTypeMap["LifeContainer"] = gameTypes.gameObjects.LIFECONTAINER;
}