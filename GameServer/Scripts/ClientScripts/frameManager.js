/**
 * Created by dimapct on 02.03.2015.
 */


function FrameManager(target, world) {
    this.target = target;
    this.world = world;
    this.currentFrame = {cells: [], objects: {}}
}

FrameManager.prototype = {
    processFrame: function(serverFrame) {
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
        for (var id in this.currentFrame.objects) {
            this.currentFrame.objects[id].draw(context)
        }
        //console.log("++++++++++++++++++++")

    },

    updateGameObjects: function(frame) {
        // console.log("Start Updating Objects");

        // Convert frame data to dict {obj_id: obj}.
        var frameObjectsDict = (function () {
            var idsDict = {};
            frame.forEach(function(obj) {
                idsDict[obj.Id] = obj;
            });
            return idsDict;
        })();

        // Delete
        var deleteIDs = [];
        for (var objId in this.world.allGameObjects) {
            if (!(objId in frameObjectsDict)) {
                //console.log("Delete");
                deleteIDs.push(objId)
            }
        }

        if (deleteIDs) for (var i = 0; i < deleteIDs.length; i++) delete this.world.allGameObjects[deleteIDs[i]]

        // Create and update
        for (var id in frameObjectsDict) {
            var obj = frameObjectsDict[id];
            if (id in this.world.allGameObjects) this.updateObject(obj);
            else this.createObject(obj)
        }
        console.log("--------------------------------------");

    },

    updateObject: function(objData) {
        // console.log("update start");
        var id = objData["Id"];
        var obj = this.world.allGameObjects[id];
        // Update position
        obj.xy = objData["Position"];

        // Update direction
        obj.direction = objData["Direction"];

    },

    createObject: function(objData) {
        var id = objData.Id;

        // Calc object type
        var objType;
        if (id === this.target.Id) objType = "player";
        else if ("StartPosition" in objData) objType = "bullet";
        else objType = "NPC";
        //console.log("ObjType: " + objType);

        objData["type"] = objType;
        this.world.createGameObject(objData);
    },

    updateCanvasXY: function () {
        var self = this;

        var calcDiff = function(item)
        {

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
        for (var id in this.currentFrame.objects) {
            var obj = this.currentFrame.objects[id];
            if (obj.objectType !== "player"){
                var dx = self.target.xy.X - obj.xy.X;
                var dy = self.target.xy.Y - obj.xy.Y;
                obj.canvasXY.X = self.target.canvasXY.X - dx;
                obj.canvasXY.Y = self.target.canvasXY.Y - dy;
            }
        }
    }
};
