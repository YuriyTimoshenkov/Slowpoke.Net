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
        obj.gameRect.center = objData["Position"];

        // Update direction
        obj.direction = objData["Direction"];

    },

    createObject: function (objData) {
        this.world.createGameObject(objData);
    },

    updateCanvasXY: function () {
        var self = this;

        // Update objects
        this.currentFrame.objects.forEach(function (obj) {
            if (obj.objectType !== "PlayerBody") {
                var dx = self.target.gameRect.x - obj.gameRect.x;
                var dy = self.target.gameRect.y - obj.gameRect.y;

                obj.canvasXY.x = self.target.canvasXY.x - dx;
                obj.canvasXY.y = self.target.canvasXY.y - dy;
            }
        });

        // Update cells
        this.currentFrame.cells.forEach(function (row) {
            row.forEach(function (cell) {
                var dx = self.gameRect.x - cell.gameRect.x;
                var dy = self.gameRect.y - cell.gameRect.y;

                cell.canvasX = self.target.canvasXY.x - dx;
                cell.canvasY = self.target.canvasXY.y - dy;
            })
        });
    }
};
