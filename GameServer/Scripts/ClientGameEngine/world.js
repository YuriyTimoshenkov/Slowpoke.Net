/**
 * Created by dimapct on 15.02.2015.
 */


function World(serverMap) {
    this.allGameObjects = [];
    this.gameMap = new GameMap(serverMap);

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
            obj = new GameObject("NPC", id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon)
        }

        // To check if it is other player
        else if (objectType == "PlayerBody" && this.allGameObjects.length > 0) {
            var name = data["Name"];
            obj = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon)
        }
            
        // To check if it is self-player
        else if (objectType == "PlayerBody" && this.allGameObjects.length == 0) {
            var name = data["Name"];
            var canvasXY = new Point($(document).width() / 2,
                                     $(document).height() / 2);
            console.log("PlayerBody Canvas Point: (" + canvasXY.x + ", " + canvasXY.y + ")");
            obj = new GameObject(name, id, objectType, position, direction, shapeRadius, life, lifeMax, currentWeapon, canvasXY)
        }

        else if (objectType == "Bullet" || objectType == "BulletDynamite") {
            obj = new GameObject("Bullet", id, objectType, position, direction, shapeRadius, life, lifeMax, null)
        }
        else if (objectType == "LifeContainer") {
            obj = new GameObject("LifeContainer", id, objectType, position, direction, shapeRadius, life, lifeMax, null)
        }


        else throw "World: invalid gameObject type: " + objectType;

        this.allGameObjects.push(obj)

        return obj
    }
}

