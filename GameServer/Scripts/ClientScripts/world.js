/**
 * Created by dimapct on 15.02.2015.
 */


function World(width, height, cellSize) {
    this.allGameObjects = [];
    this.gameMap = new GameMap(width, height, cellSize);

}


World.prototype = {
    createGameObject: function (data) {
        //console.log("World is creating object");
        var objectType = data["ActiveBodyType"];
        var id = data["Id"];
        var position = data["Position"];
        
        var direction = data["Direction"];
        var obj;

        if (objectType == "NPC") {
            obj = new GameObject(id, objectType, position, direction)
        }

        else if (objectType == "PlayerBody") {
            // ТУТ БАГ!! !! !((;;! (;(;(
            var canvasXY = { x: $(window).width() / 2, y: $(window).height() / 2 };
            console.log("PlayerBody Canvas Point: (" + canvasXY.x + ", " + canvasXY.y + ")");
            obj = new GameObject(id, objectType, position, direction, canvasXY)
        }

        else if (objectType == "Bullet") {
            obj = new GameObject(id, objectType, position, direction)
        }

        else throw "World: invalid gameObject type: " + objectType;

        this.allGameObjects.push(obj)

        return obj
    }
};