/**
 * Created by dimapct on 02.03.2015.
 */


function FrameManager(target, world) {
    console.log(404)
    console.log(target)
    console.log(404)
    this.target = target;
    this.world = world;
    this.currentFrame = { cells: [], objects: [] }
}


FrameManager.prototype = {
    processFrame: function (serverFrame) {
        this.updateGameObjects(serverFrame);
        this.currentFrame.cells = this.world.gameMap.cells;
        this.currentFrame.objects = this.world.allGameObjects;
        this.updateCanvasXY();
    },

    draw: function (context) {
        // Draw background
        this.currentFrame.cells.forEach(function (row) {
            row.forEach(function (cell) {
                cell.draw(context)
            });

        });

        // Draw objects
        this.currentFrame.objects.forEach(function (obj) { obj.draw(context) });
        //console.log("++++++++++++++++++++")

    },

    updateGameObjects: function (frame) {
        console.log("Start Updating Objects");

        var self = this;

        // Convert frame data to dict {obj_id: obj}.
        var frameObjectsDict = (function () {
            var idsDict = {};
            frame.forEach(function (obj) {
                idsDict[obj.Id] = obj;
            });
            return idsDict;
        })();

        // Delete
        var deleteIDs = [];
        this.world.allGameObjects.forEach(function (obj) {
            if (!(obj.id in frameObjectsDict)) deleteIDs.push(obj)
        });

        deleteIDs.forEach(function (obj) {
            var i = self.world.allGameObjects.indexOf(obj);
            var deletedItems = self.world.allGameObjects.splice(i, 1);
        });

        //if (deleteIDs) for (var i = 0; i < deleteIDs.length; i++) delete this.world.allGameObjects[deleteIDs[i]]

        // Create and update
        for (var objId in frameObjectsDict) {
            var objData = frameObjectsDict[objId];
            console.log(565)
            for (var p in objData) {
                console.log(objData)
                

            }
            console.log(565)

            var filtered = this.world.allGameObjects.filter(function (obj) { return objId == obj.id });
            if (filtered.length > 0) this.updateObject(objData);
            else this.createObject(objData)
        }
        console.log("--------------------------------------");

    },

    updateObject: function (objData) {
        console.log("update start");
        var objId = objData["Id"];
        //var obj = this.world.allGameObjects[id];
        var obj = this.world.allGameObjects.filter(function (obj) { return objId == obj.id })[0];
        //console.log(890)
        //console.log(obj)
        //console.log(890)

        // Update position
        obj.xy = objData["Position"];

        // Update direction
        obj.direction = objData["Direction"];

    },

    createObject: function (objData) {
        console.log("create start");

        //var objId = objData["Id"];

        // Calc object type
        //var objType = objData["type"];
        //if (objId === this.target.id) objType = "player";
        //else if ("sss" in objData) objType = "bullet";
        //else objType = "NPC";
        //console.log("ObjData: " + objData);

        //objData["type"] = objType;
        console.log(1230)
        console.log(objData)
        console.log(1230)
        this.world.createGameObject(objData);
    },

    updateCanvasXY: function () {
        var self = this;

        var calcDiff = function (item) {

        };
        // Update cells
        this.currentFrame.cells.forEach(function (row) {
            row.forEach(function (cell) {
                var dx = self.target.xy.X - cell.X;
                var dy = self.target.xy.Y - cell.Y;

                cell.canvasX = self.target.canvasXY.X - dx;
                cell.canvasY = self.target.canvasXY.Y - dy;
            })
        });

        // Update objects
        this.currentFrame.objects.forEach(function (obj) {
            if (obj.objectType !== "PlayerBody") {
                var dx = self.target.xy.X - obj.xy.X;
                var dy = self.target.xy.Y - obj.xy.Y;
                //console.log(222)
                //console.log(dx + ", " + dy);
                //console.log(222)
                obj.canvasXY.X = self.target.canvasXY.X - dx;
                obj.canvasXY.Y = self.target.canvasXY.Y - dy;
            }
        });
    }
};
