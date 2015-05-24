function GameObjectFactory() {
    this.createGameObject = function (gameType, data) {
        return this.builders[gameType](data);
    }

    this.builders = []
    this.builders[gameTypes.gameObjects.PLAYER] = function (data) {
        //name, id, objectType, position, direction, shapeRadius, life, maxLife, currentWeapon, canvasXY, speed
        var name = data["Name"];
        var objectType = data["BodyType"];
        var id = data["Id"];
        var position = data["Shape"]["Position"];
        var shapeRadius = data["Shape"]["Radius"];
        var life = data["Life"];
        var lifeMax = data["LifeMax"];
        var direction = data["Direction"];
        var currentWeapon = data["CurrentWeapon"];
        var speed = data["Speed"];
        
        var player = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon, speed);

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
    this.builders[gameTypes.gameObjects.PLAYEROTHER] = function (data) {
        var name = data["Name"];
        var objectType = data["BodyType"];
        var id = data["Id"];
        var position = data["Shape"]["Position"];
        var shapeRadius = data["Shape"]["Radius"];
        var life = data["Life"];
        var lifeMax = data["LifeMax"];
        var direction = data["Direction"];
        var currentWeapon = data["CurrentWeapon"];
        var speed = data["Speed"];

        var player = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon, speed);

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
    this.builders[gameTypes.gameObjects.NPCAI] = function (data) {
        var name = "NPCAI";
        var objectType = data["BodyType"];
        var id = data["Id"];
        var position = data["Shape"]["Position"];
        var shapeRadius = data["Shape"]["Radius"];
        var life = data["Life"];
        var lifeMax = data["LifeMax"];
        var direction = data["Direction"];
        var currentWeapon = data["CurrentWeapon"];
        var speed = data["Speed"];

        var npc = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon, speed);

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
    this.builders[gameTypes.gameObjects.BULLET] = function (data) {
        var name = "Bullet";
        var objectType = data["BodyType"];
        var id = data["Id"];
        var position = data["Shape"]["Position"];
        var shapeRadius = data["Shape"]["Radius"];
        var life = data["Life"];
        var lifeMax = data["LifeMax"];
        var direction = data["Direction"];
        var currentWeapon = null;
        var speed = data["Speed"];

        var bullet = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon, speed);

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
    this.builders[gameTypes.gameObjects.LIFECONTAINER] = function (data) {
        var name = "LifeContainer";
        var objectType = data["BodyType"];
        var id = data["Id"];
        var position = data["Shape"]["Position"];
        var shapeRadius = data["Shape"]["Radius"];
        var life = data["Life"];
        var lifeMax = data["LifeMax"];
        var direction = data["Direction"];
        var currentWeapon = data["CurrentWeapon"];
        var speed = data["Speed"];

        var lifeContainer = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon, speed);

        // Assign image
        var obj = new BottleContainer();
        obj.image.scaleX = 0.05;
        obj.image.scaleY = 0.05;

        lifeContainer.image.addChild(obj.image);

        // Configure image
        var imageWidth = 215.45;
        var imageHeight = 738.3;
        //lifeContainer.image.scaleX = 0.05;
        //lifeContainer.image.scaleY = 0.05;
        lifeContainer.image.cache(0, 0, 30, 40);

        return lifeContainer;
    }
    this.builders[gameTypes.gameObjects.REVOLVER] = function (data) {

    }
    this.builders[gameTypes.gameObjects.GUN] = function (data) {

    }
    this.builders[gameTypes.gameObjects.SHOTGUN] = function (data) {

    }
    this.builders[gameTypes.gameObjects.DYNAMITE] = function (data) {

    }
    this.builders[gameTypes.gameObjects.TREE] = function (data) {
        var name = "TreeContainer";
        var objectType = "PassiveBody";
        var id = 333;
        var position = {X:0,Y:0};
        var shapeRadius = 10;
        var life = 10;
        var lifeMax = 10;
        var direction = { X: 0, Y: 0 };
        var currentWeapon = "";
        var speed = 0;

        var treeContainer = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon, speed);

        var obj = new TreeContainer();
        obj.image.scaleX = 0.06;
        obj.image.scaleY = 0.06;
        treeContainer.image = obj.image;//.addChild(obj.image);
        treeContainer.image.cache(0, 0, 50, 50);
        return treeContainer;
    }



}