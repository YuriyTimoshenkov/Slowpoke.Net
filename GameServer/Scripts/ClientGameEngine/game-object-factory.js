function GameObjectFactory() {
    this.createGameObject = function (gameType, data) {
        return this.builders[gameType](data);
    }

    this.builders = []
    this.builders[gameTypes.gameObjects.PLAYER] = function (data) {
        
    }
    this.builders[gameTypes.gameObjects.PLAYEROTHER] = function (data) {

    }
    this.builders[gameTypes.gameObjects.NPC] = function (data) {

    }
    this.builders[gameTypes.gameObjects.BULLET] = function (data) {

    }
    this.builders[gameTypes.gameObjects.LIFECONTAINER] = function (data) {

    }
    this.builders[gameTypes.gameObjects.REVOLVER] = function (data) {

    }
    this.builders[gameTypes.gameObjects.GUN] = function (data) {

    }
    this.builders[gameTypes.gameObjects.SHOTGUN] = function (data) {

    }
    this.builders[gameTypes.gameObjects.DYNAMITE] = function (data) {

    }



}