/**
 * Created by dimapct on 15.02.2015.
 */


function World(width, height, cellSize) {
    this.allGameObjects = [];
    this.gameMap = new GameMap(width, height, cellSize);
}


World.prototype = {
    createGameObject: function (data) {
        console.log("World is creating object");
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
            var canvasXY = { X: $(window).width() / 2, Y: $(window).height() / 2 };
            console.log(canvasXY.X + "!!!!!!");
            obj = new GameObject(id, objectType, position, direction, canvasXY)
        }

        else if (objectType == "Bullet") {
            obj = new GameObject(id, objectType, position, direction)
        }

        else throw "World2: invalid gameObject type: " + objectType;

        this.allGameObjects.push(obj)
    }
};