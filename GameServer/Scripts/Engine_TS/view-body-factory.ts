class ViewBodyFactory {
    builders: any[];
    serverTypeMap: any[];

    constructor() {
        this.builders = [];
        this.setServerTypeMap();
        this.generateBuilders();
    }

    createGameObject(gameObjectType, data) {
        return this.builders[gameObjectType](data);
    }

    createGameObjectbyServerBody (body) {
        return this.createGameObject(this.serverTypeMap[body.bodyType], body);
    }

    generateBuilders() {
        var self = this;
        this.builders[gameObjects.PLAYER] = function (data: any) {
            var image = new createjs.Container();

            // KOSTIL !!!!!!!!!!!
            var canvasXY = new Point($(document).width() / 2, $(document).height() / 2);
            image.x = canvasXY.x;
            image.y = canvasXY.y;

            // Assign image
            var obj = new CowboyContainerTS();
            image.addChild(obj.image);

            // Configure image
            var imageSize = 280;
            image.regX = imageSize / 2;
            image.regY = imageSize / 2;
            image.scaleX = 0.4;
            image.scaleY = 0.4;
            image.cache(0, 0, imageSize, imageSize);

            return image;
        }
    }

    setServerTypeMap() {
        this.serverTypeMap["NPCAI"] = gameObjects.NPCAI;
        this.serverTypeMap["PlayerBody"] = gameObjects.PLAYER;
        this.serverTypeMap["Bullet"] = gameObjects.BULLET;
        this.serverTypeMap["BulletDynamite"] = gameObjects.DYNAMITE;
        this.serverTypeMap["LifeContainer"] = gameObjects.LIFECONTAINER;

        this.serverTypeMap["meadow"] = gameObjects.MEADOW;
        this.serverTypeMap["water"] = gameObjects.WATER;
        this.serverTypeMap["rock"] = gameObjects.ROCK;
        this.serverTypeMap["road"] = gameObjects.ROAD;
        this.serverTypeMap["ford"] = gameObjects.FORD;
        this.serverTypeMap["tree"] = gameObjects.TREE;
    }

} 