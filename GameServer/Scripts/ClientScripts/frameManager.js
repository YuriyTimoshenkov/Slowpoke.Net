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

        // Create and update
        for (var objId in frameObjectsDict) {
            var objData = frameObjectsDict[objId];
            var filtered = this.world.allGameObjects.filter(function (obj) { return objId == obj.id });
            if (filtered.length > 0) this.updateObject(objData);
            else this.createObject(objData)
        }
    },

    updateObject: function (objData) {
        var objId = objData["Id"];
        var obj = this.world.allGameObjects.filter(function (obj) { return objId == obj.id })[0];

        // Update position
        obj.xy = objData["Position"];

        // Update direction
        obj.direction = objData["Direction"];

    },

    createObject: function (objData) {
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

                obj.canvasXY.X = self.target.canvasXY.X - dx;
                obj.canvasXY.Y = self.target.canvasXY.Y - dy;
            }
        });
    }
};
