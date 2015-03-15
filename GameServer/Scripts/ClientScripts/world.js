/**
 * Created by dimapct on 15.02.2015.
 */

//$.getScript("gameObject.js");
//$.getScript("gameMap.js");

function World(width, height, cellSize) {
    //document.write("WorldInitStart");
    this.allGameObjects = {tttt: {}};
    this.gameMap = new GameMap(width, height, cellSize);
    //document.write("WorldInitEnd");
}

World.prototype = {
    createGameObject: function(data) {
        // console.log("World is creating object");
        var objectType = data["type"];
        var id = data["Id"];
        var position = data["Position"];
        var direction = data["Direction"];
        var obj;

        if (objectType == "NPC") {
            obj = new GameObject(id, objectType, position, direction)
        }

        else if (objectType == "player") {
            // ТУТ БАГ!! !! !((;;! (;(;(
            var canvasXY = {X: $(window).width()/2, Y: $(window).height()/2};
            // console.log(canvasXY.X + "!!!!!!");
            obj = new GameObject(id, objectType, position, direction, canvasXY)
        }

        else if (objectType == "bullet") {
            obj = new GameObject(id, objectType, position, direction)
        }

        else throw "invalid gameObject type";

        this.allGameObjects[id] = obj
    }
};