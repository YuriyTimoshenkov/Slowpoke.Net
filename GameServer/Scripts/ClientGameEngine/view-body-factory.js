﻿function ViewBodyFactory() {
    var self = this;

    this.createGameObject = function (gameType, data) {
        return self.builders[gameType](data);
    }

    this.createGameObjectbyServerBody = function (body) {
        return self.createGameObject(self.serverTypeMap[body.bodyType], body);
    }

    this.builders = [];
    this.builders[gameTypes.gameObjects.PLAYER] = function (serverBody) {        
        var image = new createjs.Container();

        var canvasXY = new Point($(document).width() / 2,
                                 $(document).height() / 2);
        image.x = canvasXY.x;
        image.y = canvasXY.y;

        // Assign image
        var obj = new CowboyContainer();
        image.addChild(obj.image);

        // Configure image
        var imageSize = 280;
        image.regX = imageSize / 2;
        image.regY = imageSize / 2;
        image.scaleX = 0.4;
        image.scaleY = 0.4;
        image.cache(0, 0, imageSize, imageSize);
        image.zIndex = 1;

        return image;
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
        var bullet = new BulletBody(serverBody);

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

        var a = lifeContainer.image.addChild(obj.image);

        // Configure image
        var imageWidth = 30;
        var imageHeight = 40;
        lifeContainer.image.regX = imageWidth / 2;
        lifeContainer.image.regY = imageHeight / 2;
        lifeContainer.image.cache(0, 0, imageWidth, imageHeight);

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
        return treeContainer;
    }

    this.builders[gameTypes.gameObjects.MEADOW] = function (serverBody) {
        var image = new createjs.Shape();
        image.graphics.beginFill("#C0F598").drawRect(0, 0, serverBody.size, serverBody.size);
        image.zIndex = 0;
        return image;
    }
    this.builders[gameTypes.gameObjects.WATER] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#89EBF0").drawRect(0, 0, serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.ROCK] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#6E6E6E").drawRect(0, 0, serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.ROAD] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#6E6E6E").drawRect(0, 0, serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.FORD] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#EDC791").drawRect(0, 0, serverBody.size, serverBody.size);
        return image;
    }
    this.builders[gameTypes.gameObjects.TREE] = function (serverBody) {
        var image = new createjs.Shape();
        image.zIndex = 0;
        image.graphics.beginFill("#5EAB00").drawRect(0, 0, serverBody.size, serverBody.size);
        return image;
    }

     
    this.serverTypeMap = [];
    this.serverTypeMap["NPCAI"] = gameTypes.gameObjects.NPCAI;
    this.serverTypeMap["PlayerBody"] = gameTypes.gameObjects.PLAYER;
    this.serverTypeMap["Bullet"] = gameTypes.gameObjects.BULLET;
    this.serverTypeMap["BulletDynamite"] = gameTypes.gameObjects.DYNAMITE;
    this.serverTypeMap["LifeContainer"] = gameTypes.gameObjects.LIFECONTAINER;

    this.serverTypeMap["meadow"] = gameTypes.gameObjects.MEADOW;
    this.serverTypeMap["water"] = gameTypes.gameObjects.WATER;
    this.serverTypeMap["rock"] = gameTypes.gameObjects.ROCK;
    this.serverTypeMap["road"] = gameTypes.gameObjects.ROAD;
    this.serverTypeMap["ford"] = gameTypes.gameObjects.FORD;
    this.serverTypeMap["tree"] = gameTypes.gameObjects.TREE;
}