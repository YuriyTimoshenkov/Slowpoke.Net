function BodyImageFactory(viewBodyFactory) {
    var self = this;
    this.viewBodyFactory = viewBodyFactory;

    this.createBodyImage = function (gameType, data) {
        return self.builders[gameType](data);
    }

    this.createBodyImagebyServerBody = function (body) {
        var bodyTypeToCreate;
        console.log(111, body)
        if (body.BodyType === "Bullet") bodyTypeToCreate = body.BulletTypeName;
        else if (body.BodyType) bodyTypeToCreate = body.BodyType;
        else bodyTypeToCreate = body.TileTypeName;
        
        console.log(bodyTypeToCreate)
        return self.createBodyImage(self.serverTypeMap[bodyTypeToCreate], body);
    }

    this.builders = [];
    this.builders[gameTypes.gameObjects.PLAYER] = function (serverBody) {
        var playerImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.PLAYER, serverBody);
        var bodyImage = new CharacterBodyImage(serverBody.Id, playerImage);

        // set weapon image
        var weaponType = self.serverTypeMap[serverBody.CurrentWeapon.Name];
        var weaponImage = self.viewBodyFactory.createViewBody(weaponType, serverBody.CurrentWeapon);
        bodyImage.setNewWeaponImage(weaponImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.PLAYEROTHER] = function (serverBody) {
        return self.builders[gameTypes.gameObjects.PLAYER](serverBody);
    }
    this.builders[gameTypes.gameObjects.NPCAI] = function (serverBody) {
        var playerImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.NPCAI, serverBody);
        var bodyImage = new CharacterBodyImage(serverBody.Id, playerImage);

        // set weapon image
        var weaponType = self.serverTypeMap[serverBody.CurrentWeapon.Name];
        var weaponImage = self.viewBodyFactory.createViewBody(weaponType, serverBody.CurrentWeapon);
        bodyImage.setNewWeaponImage(weaponImage);

        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.SHOTGUN] = function (serverBody) {
        var image = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.SHOTGUN, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, image);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.GUN] = function (serverBody) {
        var image = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.GUN, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, image);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.REVOLVER] = function (serverBody) {
        var image = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.REVOLVER, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, image);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.DYNAMITE] = function (serverBody) {
        var bulletImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.DYNAMITE, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, bulletImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.BULLETSHOTGUN] = function (serverBody) {
        var bulletImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.BULLETSHOTGUN, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, bulletImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.BULLETGUN] = function (serverBody) {
        var bulletImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.BULLETGUN, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, bulletImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.BULLETREVOLVER] = function (serverBody) {
        var bulletImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.BULLETREVOLVER, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, bulletImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.BULLETDYNAMITE] = function (serverBody) {
        var bulletImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.BULLETDYNAMITE, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, bulletImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.LIFECONTAINER] = function (serverBody) {
        var lifeContainerImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.LIFECONTAINER, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, lifeContainerImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.MEADOW] = function (serverBody) {
        var tileImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.MEADOW, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, tileImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.WATER] = function (serverBody) {
        var tileImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.WATER, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, tileImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.ROCK] = function (serverBody) {
        var tileImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.ROCK, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, tileImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.ROAD] = function (serverBody) {
        var tileImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.ROAD, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, tileImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.FORD] = function (serverBody) {
        var tileImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.FORD, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, tileImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.TREE] = function (serverBody) {
        var tileImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.TREE, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, tileImage);
        return bodyImage;
    }
    this.builders[gameTypes.gameObjects.BOX] = function (serverBody) {
        var boxImage = self.viewBodyFactory.createViewBody(gameTypes.gameObjects.BOX, serverBody);
        var bodyImage = new BodyImage(serverBody.Id, boxImage);
        return bodyImage;
    }


    this.serverTypeMap = [];
    this.serverTypeMap["NPCAI"] = gameTypes.gameObjects.NPCAI;
    this.serverTypeMap["PlayerBody"] = gameTypes.gameObjects.PLAYER;
    this.serverTypeMap["BulletGun"] = gameTypes.gameObjects.BULLETGUN;
    this.serverTypeMap["BulletShotgun"] = gameTypes.gameObjects.BULLETSHOTGUN;
    this.serverTypeMap["BulletRevolver"] = gameTypes.gameObjects.BULLETREVOLVER;
    this.serverTypeMap["BulletDynamite"] = gameTypes.gameObjects.BULLETDYNAMITE;
    this.serverTypeMap["Gun"] = gameTypes.gameObjects.GUN;
    this.serverTypeMap["Shotgun"] = gameTypes.gameObjects.SHOTGUN;
    this.serverTypeMap["Revolver"] = gameTypes.gameObjects.REVOLVER;
    this.serverTypeMap["Dynamite"] = gameTypes.gameObjects.DYNAMITE;
    this.serverTypeMap["LifeContainer"] = gameTypes.gameObjects.LIFECONTAINER;
    this.serverTypeMap["BoxBody"] = gameTypes.gameObjects.BOX;

    this.serverTypeMap["meadow"] = gameTypes.gameObjects.MEADOW;
    this.serverTypeMap["water"] = gameTypes.gameObjects.WATER;
    this.serverTypeMap["rock"] = gameTypes.gameObjects.ROCK;
    this.serverTypeMap["road"] = gameTypes.gameObjects.ROAD;
    this.serverTypeMap["ford"] = gameTypes.gameObjects.FORD;
    this.serverTypeMap["tree"] = gameTypes.gameObjects.TREE;
    this.serverTypeMap["map"] = gameTypes.gameObjects.MAP;

   
}