/**
 * Created by dimapct on 15.02.2015.
 */


function World(serverMap) {
    this.allGameObjects = [];
    this.gameObjectFactory = new GameObjectFactory();
    // KOSTIL
    this.gameMap = new GameMap(serverMap, this.gameObjectFactory);
    

    this.createGameObject = function (data) {
        var objectType = data["BodyType"];
        
        var id = data["Id"];
        var position = data["Shape"]["Position"];
        var shapeRadius = data["Shape"]["Radius"];
        var life = data["Life"];
        var lifeMax = data["LifeMax"];
        var direction = data["Direction"];
        var currentWeapon = data["CurrentWeapon"];
        var obj;

        if (objectType == "NPC" || objectType == "NPCAI") {
            obj = this.gameObjectFactory.createGameObject(gameTypes.gameObjects.NPCAI, data)
        }

        // To check if it is other player
        else if (objectType == "PlayerBody" && this.allGameObjects.length > 0) {
            obj = this.gameObjectFactory.createGameObject(gameTypes.gameObjects.PLAYEROTHER, data)
        }
            
        // To check if it is self-player
        else if (objectType == "PlayerBody" && this.allGameObjects.length == 0) {
            obj = this.gameObjectFactory.createGameObject(gameTypes.gameObjects.PLAYER, data)
        }

        else if (objectType == "Bullet" || objectType == "BulletDynamite") {
            obj = this.gameObjectFactory.createGameObject(gameTypes.gameObjects.BULLET, data)
        }
        else if (objectType == "LifeContainer") {
            obj = this.gameObjectFactory.createGameObject(gameTypes.gameObjects.LIFECONTAINER, data)
        }

        else throw "World: invalid gameObject type: " + objectType;

        this.allGameObjects.push(obj)

        return obj
    }
}

