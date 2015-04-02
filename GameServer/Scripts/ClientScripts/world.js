/**
 * Created by dimapct on 15.02.2015.
 */


function World(serverMap) {
    this.allGameObjects = [];
    this.gameMap = new GameMap(serverMap);

}


World.prototype = {
    createGameObject: function (data) {
        //console.log("World is creating object");
        var objectType = data["ActiveBodyType"];
        var id = data["Id"];
        var position = data["Shape"]["Position"];
        var shapeRadius = data["Shape"]["Radius"];
        var life = data["Life"];
        var lifeMax = data["LifeMax"];
        var direction = data["Direction"];
        var obj;

        if (objectType == "NPC" || objectType == "NPCAI") {
            obj = new GameObject(id, objectType, position, direction, shapeRadius, life, lifeMax)
        }

        else if (objectType == "PlayerBody") {
            // ТУТ БАГ!! !! !((;;! (;(;(
            var canvasXY = new Point($(window).width() / 2,
                                     $(window).height() / 2);
            console.log("PlayerBody Canvas Point: (" + canvasXY.x + ", " + canvasXY.y + ")");
            obj = new GameObject(id, objectType, position, direction, shapeRadius, life, lifeMax, canvasXY)
        }

        else if (objectType == "Bullet") {
            obj = new GameObject(id, objectType, position, direction, shapeRadius, life, lifeMax)
        }

        else throw "World: invalid gameObject type: " + objectType;

        this.allGameObjects.push(obj)

        return obj
    }
};